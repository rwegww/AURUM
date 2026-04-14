import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

const router = express.Router();

const SYSTEM_INSTRUCTION = `Bạn là Aurum AI Expert, một hệ thống chuyên gia hóa học chuyên sâu và bảo mật cao.
PHONG CÁCH PHẢN HỒI: 
1. Ưu tiên sự NGẮN GỌN, súc tích và ĐÚNG TRỌNG TÂM.
2. Sử dụng danh sách gạch đầu dòng (-) thay cho các đoạn văn dài.
3. Nếu có dữ liệu so sánh hoặc tính chất, hãy ưu tiên trình bày dạng BẢNG.
4. Tránh các câu dẫn rườm rà như "Dưới đây là...", "Tôi xin trả lời...". Đi thẳng vào nội dung chính.

QUY TẮC BẢO MẬT & QUYỀN RIÊNG TƯ:
1. Tuyệt đối không tiết lộ thông tin cá nhân hoặc dữ liệu của người dùng khác.
2. Chỉ tập trung vào kiến thức hóa học, học thuật và an toàn phòng thí nghiệm.
3. Nếu câu hỏi liên quan đến chất cháy nổ nguy hiểm ngoài mục đích giáo dục, hãy kích hoạt cảnh báo an toàn.`;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel(
  { model: 'gemini-2.5-flash', systemInstruction: SYSTEM_INSTRUCTION },
  { apiVersion: 'v1' }
);

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
    let kbMatch = null;
    try {
      const { data } = await supabase
        .from('ai_knowledge')
        .select('*')
        .filter('patterns', 'cs', `{${normalizedQuery}}`);
      kbMatch = data;
    } catch (dbErr) {
      console.warn('⚠️ Supabase KB Lookup failed, bypassing to Cache/AI:', dbErr.message);
    }

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
    let cacheMatch = null;
    try {
      const { data } = await supabase
        .from('ai_cache')
        .select('response')
        .eq('query_hash', queryHash)
        .maybeSingle();
      cacheMatch = data;
    } catch (cacheErr) {
      console.warn('⚠️ Supabase Cache Lookup failed, bypassing to Gemini:', cacheErr.message);
    }

    if (cacheMatch) {
      await logQuery(userId, username, normalizedQuery, cacheMatch.response, { source: 'ai_cache' });
      return res.json(cacheMatch.response);
    }

    // 3. Call Gemini AI
    console.log(`🤖 Gemini Search Starting: "${normalizedQuery}"`);
    
    try {
      // 3. Call Gemini AI (Enhanced Multi-model Fallback Logic)
      const startTime = Date.now();
      let result;
      let attemptLogs = [];
      
      // Order: Prefer newest/stable, fallback to other next-gen models supported by this key
      const modelCandidates = ['gemini-2.5-flash', 'gemini-3.1-pro-preview', 'gemini-2.0-flash'];

      for (const modelName of modelCandidates) {
        try {
          console.log(`📡 Attempting Gemini with model: ${modelName}...`);
          const currentModel = genAI.getGenerativeModel(
            { model: modelName, systemInstruction: SYSTEM_INSTRUCTION }, 
            { apiVersion: 'v1' }
          );
          result = await currentModel.generateContent(normalizedQuery);
          if (result) {
            console.log(`✅ Success with model: ${modelName}`);
            attemptLogs.push(`${modelName}: Success`);
            break; 
          }
        } catch (e) {
          console.warn(`⚠️ Model ${modelName} failed:`, e.message);
          attemptLogs.push(`${modelName}: ${e.message}`);
          // Continue to next model
        }
      }

      if (!result) {
        throw new Error(`All models failed. History: ${attemptLogs.join(' | ')}`);
      }

      const response = await result.response;
      const responseText = response.text();
      const duration = Date.now() - startTime;

      const responseObj = {
        message: responseText,
        source: 'gemini_ai',
        suggestions: ['Tìm hiểu thêm', 'Ví dụ thực tế', 'Phản ứng liên quan'],
        timestamp: new Date().toISOString(),
        generation_time_ms: duration,
        engine: attemptLogs[attemptLogs.length - 1]
      };

      // 4. Persistence (Background)
      // Save to Cache without blocking the response
      supabase.from('ai_cache').upsert({
        query_hash: queryHash,
        original_query: normalizedQuery,
        response: responseObj
      }).then(({ error }) => {
        if (error) console.error('⚠️ Failed to cache Gemini response:', error.message);
      });

      // Log Query (Background)
      logQuery(userId, username, normalizedQuery, responseObj, { source: 'gemini_ai', context, duration_ms: duration });

      return res.json(responseObj);
    } catch (geminiErr) {
      console.error('💥 Ultimate AI Failure:', geminiErr.message);
      
      return res.status(503).json({
        error: 'AI Systems Overloaded',
        message: 'Tất cả các máy chủ AI của Google hiện đang quá tải hoặc không khả dụng cho khu vực của bạn.',
        details: geminiErr.message,
        hint: 'Hãy thử lại sau 1-2 phút hoặc kiểm tra kết nối mạng của bạn.'
      });
    }

  } catch (err) {
    console.error('💥 Global AI Route Error:', err);
    res.status(500).json({ 
      error: 'Internal System Error', 
      message: err.message
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
