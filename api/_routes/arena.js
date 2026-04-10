import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';

const router = express.Router();

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    if (sbUser && !sbError) {
      req.userId = sbUser.id;
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    }
    next();
  } catch (e) {
    res.status(401).json({ message: 'Vui lòng đăng nhập lại' });
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const POINTS = { win: 100, lose: -50, draw: 20 };
const calcPoints = (result, score) => {
  const base = POINTS[result] ?? 0;
  const bonus = result === 'win' ? Math.floor(score / 100) * 5 : 0;
  return base + bonus;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. POST /api/arena/create  — Tạo phòng mới
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create', auth, async (req, res) => {
  try {
    const { name, mode, difficulty, max_players } = req.body;
    const host_id = req.userId;

    const roomId = Math.floor(100000 + Math.random() * 900000).toString();

    const { data: newRoom, error } = await supabase
      .from('arena_rooms')
      .insert([{ id: roomId, name, host_id, mode, difficulty, status: 'waiting', max_players, current_players: 1 }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    console.error('Lỗi tạo phòng Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/arena/join  — Tham gia phòng bằng mã PIN
// ─────────────────────────────────────────────────────────────────────────────
router.post('/join', auth, async (req, res) => {
  try {
    const { room_id } = req.body;
    console.log(`[ARENA] User ${req.userId} attempting to join room: ${room_id}`);

    const { data: room, error: fetchError } = await supabase
      .from('arena_rooms').select('*').eq('id', room_id).single();

    if (fetchError || !room)
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng với mã PIN này.' });
    if (room.status !== 'waiting')
      return res.status(400).json({ success: false, message: 'Phòng này đang thi đấu hoặc đã kết thúc.' });
    if (room.current_players >= room.max_players)
      return res.status(400).json({ success: false, message: 'Phòng đã đầy.' });

    const { data: updatedRoom, error: updateError } = await supabase
      .from('arena_rooms')
      .update({ current_players: room.current_players + 1 })
      .eq('id', room_id).select().single();

    if (updateError) throw updateError;

    res.status(200).json({ success: true, room: updatedRoom });
  } catch (error) {
    console.error('Lỗi tham gia phòng Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. POST /api/arena/find-match  — Tìm trận ngẫu nhiên (chờ phòng)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/find-match', auth, async (req, res) => {
  try {
    const { mode } = req.body || {};
    
    // Tìm 1 phòng đang waiting, không đầy, không do chính user này host
    let query = supabase
      .from('arena_rooms')
      .select('*')
      .eq('status', 'waiting')
      .neq('host_id', req.userId);

    if (mode) {
      query = query.eq('mode', mode);
    }
      
    const { data: rooms, error } = await query.order('created_at', { ascending: true }); // Lấy phòng oldest chưa đầy

    if (error) throw error;

    // Lọc thủ công những phòng chưa đầy
    const availableRooms = rooms.filter(r => r.current_players < r.max_players);

    if (availableRooms && availableRooms.length > 0) {
      const roomToJoin = availableRooms[0];
      
      // Có phòng => tăng current_players
      const { data: updatedRoom, error: updateError } = await supabase
        .from('arena_rooms')
        .update({ current_players: roomToJoin.current_players + 1 })
        .eq('id', roomToJoin.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return res.status(200).json({ success: true, room: updatedRoom, found: true });
    }

    // Nếu không có phòng => returned found: false
    res.status(200).json({ success: true, found: false, message: 'Đang xếp trận...' });
  } catch (error) {
    console.error('Lỗi tìm trận:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/arena/questions/:difficulty  — Lấy câu hỏi từ DB
// ─────────────────────────────────────────────────────────────────────────────
router.get('/questions/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    let query = supabase.from('arena_questions').select('*');
    if (difficulty !== 'auto') query = query.eq('difficulty', difficulty);

    // Random 10 questions using order by random
    const { data: questions, error } = await query
      .order('created_at', { ascending: false })
      .limit(50); // fetch more, shuffle on server

    if (error) throw error;

    // Shuffle and pick 10
    const shuffled = (questions || []).sort(() => Math.random() - 0.5).slice(0, 10);

    // Normalize field names (DB uses correct_option_index, frontend expects .correct)
    const normalized = shuffled.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct_option_index,
      difficulty: q.difficulty,
      points: q.points || 10,
    }));

    res.status(200).json({ success: true, questions: normalized });
  } catch (error) {
    console.error('Lỗi tải câu hỏi Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. POST /api/arena/match-result  — Ghi kết quả trận đấu
// ─────────────────────────────────────────────────────────────────────────────
router.post('/match-result', auth, async (req, res) => {
  try {
    const { room_id, result, score, opponent_name } = req.body;
    const userId = req.userId;
    const ptsChange = calcPoints(result, score || 0);

    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('arena_stats')
      .eq('id', userId)
      .single();

    if (fetchErr) throw fetchErr;

    const prev = userData?.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 };
    const newStats = {
      total: prev.total + 1,
      wins:  result === 'win'  ? prev.wins  + 1 : prev.wins,
      losses: result === 'lose' ? prev.losses + 1 : prev.losses,
      points: Math.max(0, (prev.points || 0) + ptsChange),
    };

    const { error: updateErr } = await supabase
      .from('users')
      .update({ arena_stats: newStats })
      .eq('id', userId);

    if (updateErr) throw updateErr;

    await supabase.from('arena_match_history').insert([{
      user_id: userId,
      room_id: room_id || null,
      opponent_name: opponent_name || 'Đối thủ ẩn danh',
      result,
      score: score || 0,
      pts_change: ptsChange,
    }]);

    if (room_id) {
      await supabase.from('arena_rooms').update({ status: 'finished' }).eq('id', room_id);
    }

    // 5. Track mission progress if win
    if (result === 'win') {
      try {
        const Mission = (await import('../models/Mission.js')).default;
        await Mission.updateProgress(userId, 'arena_win', 1);
      } catch (err) {
        console.warn('⚠️ Failed to update mission progress:', err.message);
      }
    }

    res.json({ success: true, stats: newStats, ptsChange });
  } catch (error) {
    console.error('Lỗi ghi kết quả trận đấu:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. GET /api/arena/leaderboard  — Bảng xếp hạng top 10
// ─────────────────────────────────────────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, arena_stats, arena_avatar')
      .not('arena_stats', 'is', null)
      .order('arena_stats->>points', { ascending: false })
      .limit(10);

    if (error) throw error;

    const leaderboard = (users || [])
      .filter(u => (u.arena_stats?.points || 0) > 0)
      .map((u, i) => ({
        rank: i + 1,
        name: u.username,
        points: u.arena_stats?.points || 0,
        wins: u.arena_stats?.wins || 0,
        total: u.arena_stats?.total || 0,
        avatarSeed: u.arena_avatar?.seed || u.username,
        aura: u.arena_avatar?.aura || '#a855f7',
      }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Lỗi tải bảng xếp hạng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GET /api/arena/my-battles  — Lịch sử trận đấu gần đây
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my-battles', auth, async (req, res) => {
  try {
    const { data: battles, error } = await supabase
      .from('arena_match_history')
      .select('*')
      .eq('user_id', req.userId)
      .order('played_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    res.json({ success: true, battles: battles || [] });
  } catch (error) {
    console.error('Lỗi tải lịch sử trận đấu:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PATCH /api/arena/save-avatar  — Lưu avatar + aura
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/save-avatar', auth, async (req, res) => {
  try {
    const { seed, aura } = req.body;
    const { error } = await supabase
      .from('users')
      .update({ arena_avatar: { seed, aura } })
      .eq('id', req.userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi lưu avatar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. GET /api/arena/room/:id  — Lấy thông tin hiện tại của phòng chờ
// ─────────────────────────────────────────────────────────────────────────────
router.get('/room/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: room, error } = await supabase
      .from('arena_rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!room) return res.status(404).json({ success: false, message: 'Phòng không tồn tại' });

    res.json({ success: true, room });
  } catch (error) {
    console.error('Lỗi lấy thông tin phòng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. POST /api/arena/leave  — Rời phòng
// ─────────────────────────────────────────────────────────────────────────────
router.post('/leave', auth, async (req, res) => {
  try {
    const { room_id } = req.body;
    if (!room_id) return res.status(400).json({ success: false, message: 'Thiếu mã phòng' });

    // 1. Lấy thông tin phòng hiện tại
    const { data: room, error: fetchErr } = await supabase
      .from('arena_rooms')
      .select('current_players, host_id')
      .eq('id', room_id)
      .single();

    if (fetchErr || !room) {
      return res.status(404).json({ success: false, message: 'Phòng không tồn tại' });
    }

    const newCount = Math.max(0, (room.current_players || 1) - 1);

    if (newCount <= 0) {
      // 2. Nếu không còn ai, xóa phòng luôn
      const { error: delErr } = await supabase.from('arena_rooms').delete().eq('id', room_id);
      if (delErr) throw delErr;
      return res.json({ success: true, message: 'Phòng đã được xóa vì không còn người' });
    } else {
      // 3. Cập nhật số lượng người
      const { error: upErr } = await supabase
        .from('arena_rooms')
        .update({ current_players: newCount })
        .eq('id', room_id);
      if (upErr) throw upErr;
      return res.json({ success: true, current_players: newCount });
    }
  } catch (error) {
    console.error('Lỗi rời phòng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. GET /api/arena/rooms — Lấy danh sách phòng đang chờ
// ─────────────────────────────────────────────────────────────────────────────
router.get('/rooms', async (req, res) => {
  try {
    // 1. Dọn dẹp các phòng ma (không có người hoặc quá cũ)
    // Tạm thời chỉ dọn phòng 0 người
    await supabase.from('arena_rooms').delete().lte('current_players', 0);
    
    // 2. Lấy danh sách phòng
    const { data: rooms, error } = await supabase
      .from('arena_rooms')
      .select(`
        *,
        users:host_id (username, arena_avatar)
      `)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (rooms || []).map(r => ({
      ...r,
      host_name: r.users?.username || 'Ẩn danh',
      host_avatar: r.users?.arena_avatar || {},
    }));

    res.json({ success: true, rooms: formatted });
  } catch (error) {
    console.error('Lỗi lấy danh sách phòng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
