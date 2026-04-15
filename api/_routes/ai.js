import express from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

const router = express.Router();

const SYSTEM_INSTRUCTION = `BẠN LÀ AURUM AI EXPERT. 
PHONG CÁCH PHẢN HỒI BẮT BUỘC:
- NGẮN GỌN, ĐÚNG TRỌNG TÂM.
- Ưu tiên sử dụng gạch đầu dòng và bảng biểu.
- Không câu dẫn rườm rà.
QUY TẮC BẢO MẬT: Không tiết lộ dữ liệu người dùng khác.
KHẢ NĂNG ĐẶC BIỆT: Bạn có quyền truy cập dữ liệu thực tế từ hệ thống (lớp học, bài tập, tiến độ, điểm số, phòng thí nghiệm, phản ứng hóa học) thông qua ngữ cảnh được cung cấp. Hãy trả lời dựa trên dữ liệu đó nếu người dùng hỏi về thông tin hệ thống hoặc hóa học.

NÔI DUNG: `;

/**
 * Dynamic Database Context Fetcher
 * This tool allows Aurum AI to "read" from relevant platform tables
 */
const fetchDatabaseContext = async (userId, query) => {
  let context = "\n--- DỮ LIỆU THỰC TẾ TỪ HỆ THỐNG ---\n";
  const q = query.toLowerCase();

  try {
    // 1. Lab & Knowledge (Public - Available to all)
    // Detect if it's a chemistry question and extract a search term
    const chemKeywords = ['phản ứng', 'tạo ra', 'điều chế', 'chất', 'hóa học', 'phương trình', 'h2o', 'o2', 'co2', 'na', 'fe'];
    const isChemQuery = chemKeywords.some(k => q.includes(k)) || q.match(/[A-Z][a-z]?\d*/);
    
    if (isChemQuery) {
      // Extract formula or use the last word
      const formulas = q.match(/[a-z]{1,2}\d+/g) || []; // Simple regex for formulas like h2o, co2
      const searchTerm = formulas.length > 0 ? formulas[0] : q.split(' ').pop();
      
      // Search chemicals
      const { data: chems } = await supabase.from('lab_chemicals')
        .select('name, formula, type')
        .or(`name.ilike.%${searchTerm}%,formula.ilike.%${searchTerm}%`)
        .limit(2);
      if (chems?.length > 0) {
        context += `- Hóa chất liên quan: ${chems.map(c => `${c.name} (${c.formula})`).join('; ')}.\n`;
      }

      // Search reactions
      const { data: rx } = await supabase.from('lab_reactions')
        .select('name, equation, observation')
        .or(`equation.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .limit(3);
      if (rx?.length > 0) {
        context += `- Phản ứng liên quan: ${rx.map(r => `${r.name}: ${r.equation} (${r.observation})`).join('; ')}.\n`;
      }
    }

    // If anonymous, return early with only public data
    if (!userId || userId === 'anonymous') {
      return context.length > 40 ? context + "------------------------------------\n" : "";
    }

    // 2. Core User Data (Private)
    const { data: user } = await supabase.from('users').select('xp, level, arena_stats').eq('id', userId).single();
    if (user) {
      context += `- Người dùng: Cấp ${user.level}, XP: ${user.xp}. Stats Arena: Thắng ${user.arena_stats?.wins}, Bại ${user.arena_stats?.losses}, Điểm ${user.arena_stats?.points}.\n`;
    }

    // 3. Class Context
    if (q.includes('lớp') || q.includes('bạn') || q.includes('thành viên') || q.includes('bài tập')) {
      const { data: members } = await supabase.from('class_members').select('class_id, class:class_id(name, code, teacher:teacher_id(username))').eq('student_id', userId);
      if (members?.length > 0) {
        context += `- Danh sách lớp đang tham gia: ${members.map(m => `${m.class.name} (GV: ${m.class.teacher?.username})`).join(', ')}.\n`;
        
        if (q.includes('bài tập') || q.includes('deadline')) {
           const classIds = members.map(m => m.class_id);
           const { data: posts } = await supabase.from('class_posts').select('content, deadline, type').in('class_id', classIds).eq('type', 'assignment').limit(3);
           if (posts?.length > 0) {
             context += `- Bài tập mới nhất: ${posts.map(p => `${p.content} (Hạn: ${p.deadline || 'Không có'})`).join('; ')}.\n`;
           }
        }
      }
    }

    // 4. Lesson Progress
    if (q.includes('bài học') || q.includes('tiến độ') || q.includes('mở khóa')) {
      const { data: unlocked } = await supabase.from('user_unlocked_lessons').select('lesson:lesson_id(title)').eq('user_id', userId);
      if (unlocked?.length > 0) {
        context += `- Bài học đã mở khóa: ${unlocked.map(u => u.lesson?.title).join(', ')}.\n`;
      }
    }

    // 5. Missions
    if (q.includes('nhiệm vụ') || q.includes('achievement')) {
      const { data: missions } = await supabase.from('user_missions').select('mission:mission_id(title), current_count, is_completed').eq('user_id', userId).eq('is_completed', false).limit(3);
      if (missions?.length > 0) {
        context += `- Nhiệm vụ đang thực hiện: ${missions.map(m => `${m.mission?.title} (${m.current_count})`).join(', ')}.\n`;
      }
    }

    return context + "------------------------------------\n";
  } catch (err) {
    console.error('Error fetching DB context:', err.message);
    return "";
  }
};

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
    
    // 2. Fetch Database Context
    const dbContext = await fetchDatabaseContext(userId, normalizedQuery);
    const enrichedQuery = dbContext ? `${dbContext}\nCâu hỏi: ${normalizedQuery}` : normalizedQuery;

    try {
      const startTime = Date.now();
      let responseText = '';
      let usedEngine = '';

      if (context.user_api_key) {
        // BYOK: Use Personal Gemini API Key with Multi-turn Chat
        console.log('📡 BYOK Active: Using Personal API Key with Chat History...');
        try {
          const personalGenAI = new GoogleGenerativeAI(context.user_api_key);
          const personalModel = personalGenAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash',
            systemInstruction: SYSTEM_INSTRUCTION,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
          });

          // Build Gemini-compatible chat history from frontend messages
          // Gemini requires: first message must be 'user', roles must alternate
          let rawHistory = (context.chat_history || []).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));
          
          // Drop leading 'model' messages (e.g. welcome greeting)
          while (rawHistory.length > 0 && rawHistory[0].role === 'model') {
            rawHistory.shift();
          }
          
          // Merge consecutive same-role messages
          const chatHistory = [];
          for (const msg of rawHistory) {
            if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === msg.role) {
              chatHistory[chatHistory.length - 1].parts[0].text += '\n' + msg.parts[0].text;
            } else {
              chatHistory.push(msg);
            }
          }

          const chat = personalModel.startChat({ history: chatHistory });
          const result = await chat.sendMessage(enrichedQuery);
          
          if (result.response.promptFeedback?.blockReason) {
            throw new Error(`SAFETY_BLOCK: ${result.response.promptFeedback.blockReason}`);
          }
          
          responseText = result.response.text();
          usedEngine = 'personal-gemini-key';
        } catch (personalErr) {
          console.error('💥 Personal API Key Error:', personalErr.message);
          
          const isAuthError = personalErr.message.includes('API_KEY_INVALID') || 
                            personalErr.message.includes('401') || 
                            personalErr.message.includes('unauthorized');
                            
          if (isAuthError) {
            return res.status(401).json({ error: 'Invalid or Expired Personal API Key', message: 'API Key không hợp lệ hoặc đã hết hạn.', details: personalErr.message });
          } else if (personalErr.message.includes('SAFETY_BLOCK')) {
            return res.status(400).json({ 
              error: 'Content Filtered', 
              message: 'Nội dung bị bộ lọc an toàn chặn. Vui lòng thử câu hỏi khác.',
              details: personalErr.message 
            });
          } else {
            return res.status(503).json({ error: 'AI Model Error', message: `Lỗi AI: ${personalErr.message}`, details: personalErr.message });
          }
        }
      } else {
        // System Hybrid Mode (Currently out of quota)
        return res.status(503).json({
          error: 'AI Service Temporarily Unavailable',
          message: 'Tất cả các dịch vụ AI hiện đang bận. Vui lòng thử lại sau giây lát hoặc cung cấp API Key cá nhân.',
          details: 'System quota exceeded.'
        });
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
