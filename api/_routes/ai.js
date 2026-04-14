import express from 'express';
import OpenAI from 'openai';
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

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Standardized logging utility
 */
const logQuery = async (userId, username, query, response, metadata) => {
  try {
    await supabase.from('ai_logs').insert({
      user_id: userId || 'anonymous',
      username: username || 'Guest',
      query,
      response,
      metadata
    });
  } catch (err) {
    console.error('⚠️ Failed to log query to Supabase:', err.message);
  }
};

/**
 * Endpoint: /api/ai/ask
 * logic: Hybrid AI (Knowledge -> Cache -> OpenAI)
 */
router.post('/ask', async (req, res) => {
  try {
    const { query, context = {} } = req.body;
    const { userId, username, role } = context;

    if (!query) return res.status(400).json({ error: 'Query is required' });

    const normalizedQuery = query.trim();
    const queryHash = crypto.createHash('md5').update(normalizedQuery.toLowerCase()).digest('hex');

    // 1. Try Cache
    try {
      const { data: cachedResponse, error: cacheError } = await supabase
        .from('ai_cache')
        .select('response')
        .eq('query_hash', queryHash)
        .maybeSingle();

      if (cachedResponse && !cacheError) {
        console.log('💎 Cache Hit');
        return res.json({ ...cachedResponse.response, source: 'cache' });
      }
    } catch (e) {
      console.warn('⚠️ Cache lookup failed, proceeding to OpenAI:', e.message);
    }

    console.log(`🤖 OpenAI Search Starting: "${normalizedQuery}"`);
    
    try {
      // 2. Call OpenAI (Primary: gpt-4o-mini, Fallback: gpt-4o)
      const startTime = Date.now();
      let responseText = '';
      let usedModel = 'gpt-4o-mini';

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: normalizedQuery }
          ],
          temperature: 0.7,
        });
        responseText = completion.choices[0].message.content;
      } catch (primaryErr) {
        console.warn('⚠️ OpenAI Mini failed, retrying with gpt-4o:', primaryErr.message);
        usedModel = 'gpt-4o';
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: normalizedQuery }
          ],
        });
        responseText = completion.choices[0].message.content;
      }

      const duration = Date.now() - startTime;

      const responseObj = {
        message: responseText,
        source: 'openai_gpt',
        suggestions: ['Tìm hiểu thêm', 'Ví dụ thực tế', 'Phản ứng liên quan'],
        timestamp: new Date().toISOString(),
        generation_time_ms: duration,
        engine: usedModel
      };

      // 3. Persistence (Background)
      supabase.from('ai_cache').upsert({
        query_hash: queryHash,
        original_query: normalizedQuery,
        response: responseObj
      }).then(({ error }) => {
        if (error) console.error('⚠️ Failed to cache OpenAI response:', error.message);
      });

      // Log Query (Background)
      logQuery(userId, username, normalizedQuery, responseObj, { source: 'openai_gpt', context, duration_ms: duration });

      return res.json(responseObj);
    } catch (openAiErr) {
      console.error('💥 OpenAI API Error:', openAiErr.message);
      return res.status(503).json({
        error: 'AI Service Temporarily Unavailable',
        message: 'Hệ thống AI đang gặp sự cố. Vui lòng thử lại sau giây lát.',
        details: openAiErr.message
      });
    }

  } catch (err) {
    console.error('💥 Global AI Route Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.get('/ask', (req, res) => {
  res.json({
    message: 'Welcome to Aurum AI Assistant. Please use POST to ask questions.',
    usage: {
      endpoint: '/api/ai/ask',
      method: 'POST',
      body: { query: 'string', context: 'object' }
    }
  });
});

export default router;
