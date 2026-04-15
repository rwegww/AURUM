import express from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

const router = express.Router();

const SYSTEM_INSTRUCTION = `BẠN LÀ AURUM AI EXPERT. 
PHONG CÁCH PHẢN HỒI BẮT BUỘC:
- NGẮN GỌN, ĐÚNG TRỌNG TÂM.
- Ưu tiên sử dụng gạch đầu dòng và bảng biểu.
- Không câu dẫn rườm rà.
QUY TẮC BẢO MẬT: Không tiết lộ dữ liệu người dùng khác.

NÔI DUNG: `;

// Initialize Providers
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
 * logic: Hybrid AI (Knowledge -> Cache -> OpenAI -> Gemini Fallback)
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
      console.warn('⚠️ Cache lookup failed:', e.message);
    }

    console.log(`🤖 Hybrid AI Search Starting: "${normalizedQuery}"`);
    
    try {
      const startTime = Date.now();
      let responseText = '';
      let usedEngine = '';

      // Stage 1: Try OpenAI (Premium)
      try {
        console.log('📡 Attempting OpenAI (gpt-4o-mini)...');
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: normalizedQuery }
          ],
          max_tokens: 800,
          temperature: 0.7
        });
        responseText = completion.choices[0].message.content;
        usedEngine = 'openai-gpt-4o-mini';
      } catch (openAiErr) {
        console.warn('⚠️ OpenAI Failed (likely quota), falling back to Gemini:', openAiErr.message);
        
        // Stage 2: Emergency Fallback to Gemini 2.5 Flash (Only working model for this key)
        console.log('📡 Emergency Fallback to Gemini (2.5-flash)...');
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }, { apiVersion: 'v1' });
        const fullPrompt = `${SYSTEM_INSTRUCTION}\n${normalizedQuery}`;
        const result = await geminiModel.generateContent(fullPrompt);
        const response = await result.response;
        responseText = response.text();
        usedEngine = 'gemini-2.5-flash-fallback';
      }

      const duration = Date.now() - startTime;

      const responseObj = {
        message: responseText,
        source: 'hybrid_ai',
        suggestions: ['Tìm hiểu thêm', 'Ví dụ thực tế', 'Phản ứng liên quan'],
        timestamp: new Date().toISOString(),
        generation_time_ms: duration,
        engine: usedEngine
      };

      // 4. Persistence (Background)
      supabase.from('ai_cache').upsert({
        query_hash: queryHash,
        original_query: normalizedQuery,
        response: responseObj
      }).then(({ error }) => {
        if (error) console.error('⚠️ Failed to cache AI response:', error.message);
      });

      // Log Query (Background)
      logQuery(userId, username, normalizedQuery, responseObj, { source: 'hybrid_ai', engine: usedEngine, context, duration_ms: duration });

      return res.json(responseObj);
    } catch (aiError) {
      console.error('💥 Ultimate Hybrid AI Failure:', aiError.message);
      return res.status(503).json({
        error: 'AI Service Temporarily Unavailable',
        message: 'Tất cả các dịch vụ AI hiện đang bận. Vui lòng thử lại sau giây lát.',
        details: aiError.message
      });
    }

  } catch (err) {
    console.error('💥 Global AI Route Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.get('/ask', (req, res) => {
  res.json({ message: 'Aurum Hybrid AI is ready.' });
});

export default router;
