import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: `Bạn là Aurum AI Expert, một hệ thống chuyên gia hóa học chuyên sâu và bảo mật cao.
  QUY TẮC BẢO MẬT & QUYỀN RIÊNG TƯ:
  1. Tuyệt đối không tiết lộ thông tin cá nhân, lịch sử tìm kiếm hoặc dữ liệu của người dùng này cho người dùng khác.
  2. Nếu người dùng hỏi về thông tin mang tính cá nhân của người khác (ví dụ: "Người dùng A đã hỏi gì?"), hãy từ chối một cách lịch sự nhưng kiên quyết.
  3. Chỉ tập trung vào kiến thức hóa học, học thuật và an toàn phòng thí nghiệm.
  4. Nếu câu hỏi liên quan đến chất cháy nổ hoặc nguy hiểm ngoài mục đích giáo dục, hãy kích hoạt cảnh báo an toàn Aurum.`
});

/**
 * Endpoint: /api/ai/ask
 * logic: Hybrid AI (Knowledge -> Cache -> Gemini)
 */
router.post('/ask', async (req, res) => {
  try {
    const { query, context = {} } = req.body;
    const { userId, username, role } = context;

    if (!query) return res.status(400).json({ error: 'Query is required' });

    const normalizedQuery = query.toLowerCase().trim();
    const queryHash = crypto.createHash('md5').update(normalizedQuery).digest('hex');

    // 1. Check Root Knowledge Base (ai_knowledge)
    // We search patterns here. (Simple implementation for now)
    const { data: kbMatch } = await supabase
      .from('ai_knowledge')
      .select('*')
      .filter('patterns', 'cs', `{${normalizedQuery}}`); 
      // Note: This is an array overlap check. Might need more complex search logic.

    if (kbMatch && kbMatch.length > 0) {
      const result = kbMatch[0];
      const responseObj = {
        message: result.explanation || result.message || '',
        suggestions: result.suggestions || [],
        actions: result.actions || [],
        source: 'kb_theory',
        title: result.title
      };
      await logQuery(userId, username, normalizedQuery, responseObj, { source: 'kb_theory' });
      return res.json(responseObj);
    }

    // 2. Check AI Cache (ai_cache)
    const { data: cacheMatch } = await supabase
      .from('ai_cache')
      .select('response')
      .eq('query_hash', queryHash)
      .maybeSingle();

    if (cacheMatch) {
      await logQuery(userId, username, normalizedQuery, cacheMatch.response, { source: 'ai_cache' });
      return res.json(cacheMatch.response);
    }

    // 3. Call Gemini AI
    console.log(`🤖 Gemini Search: "${normalizedQuery}"`);
    const prompt = `User Role: ${role || 'student'}\nQuestion: ${query}`;
    const geminiResult = await model.generateContent(prompt);
    const responseText = geminiResult.response.text();

    const responseObj = {
      message: responseText,
      source: 'gemini_ai',
      suggestions: ['Tìm hiểu thêm', 'Ví dụ thực tế', 'Phản ứng liên quan'],
      timestamp: new Date().toISOString()
    };

    // 4. Persistence
    // Save to Cache
    await supabase.from('ai_cache').upsert({
      query_hash: queryHash,
      original_query: normalizedQuery,
      response: responseObj
    });

    // Log Query
    await logQuery(userId, username, normalizedQuery, responseObj, { source: 'gemini_ai', context });

    return res.json(responseObj);

  } catch (err) {
    console.error('💥 AI Route Error:', err);
    res.status(500).json({ 
      error: 'AI Expert System error', 
      message: err.message,
      safety: 'Caution'
    });
  }
});

async function logQuery(userId, username, query, response, metadata = {}) {
  try {
    await supabase.from('ai_user_logs').insert({
      user_id: userId || null,
      username: username || 'Guest',
      query,
      response,
      metadata
    });
  } catch (logErr) {
    console.error('⚠️ Logging failed:', logErr.message);
  }
}

export default router;
