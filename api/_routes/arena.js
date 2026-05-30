import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

const ROUND_COUNT = 10;
const POINTS = { win: 100, lose: -50, draw: 20 };
const MODE_MAX_PLAYERS = { solo: 2, '3vs3': 6, '5vs5': 10 };
const GAME_TYPES = ['calculation', 'balancing', 'atom_match', 'electron_match'];
const QUESTION_COLUMNS = [
  'id',
  'grade_level',
  'difficulty',
  'game_type',
  'question',
  'payload',
  'answer',
  'points',
  'time_limit_seconds',
  'explanation',
].join(',');

const calcPoints = (result, score) => {
  const base = POINTS[result] ?? 0;
  const bonus = result === 'win' ? Math.floor(score / 100) * 5 : 0;
  return base + bonus;
};

const normalizeRpcRoom = (room) => Array.isArray(room) ? room[0] : room;

const shuffle = (items) => {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

const normalizeQuestionIds = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === 'string') {
    return value
      .replace(/[{}]/g, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const hasObjectContent = (value) => (
  value
  && typeof value === 'object'
  && !Array.isArray(value)
  && Object.keys(value).length > 0
);

const isPlayableMiniGameQuestion = (question) => (
  question
  && GAME_TYPES.includes(question.game_type)
  && hasObjectContent(question.payload)
  && hasObjectContent(question.answer)
);

const filterPlayableMiniGameQuestions = (questions) => (
  (questions || []).filter(isPlayableMiniGameQuestion)
);

const sanitizeQuestion = (question, includeExplanation = false) => {
  if (!question) return null;
  return {
    id: question.id,
    gradeLevel: question.grade_level,
    difficulty: question.difficulty,
    gameType: question.game_type,
    question: question.question,
    payload: question.payload || {},
    points: question.points || 100,
    timeLimitSeconds: question.time_limit_seconds || 45,
    ...(includeExplanation ? { explanation: question.explanation || null } : {}),
  };
};

const asNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value.replace(',', '.'));
  return Number.NaN;
};

const sameNumberArray = (actual, expected) => (
  Array.isArray(actual)
  && Array.isArray(expected)
  && actual.length === expected.length
  && actual.every((value, index) => Number(value) === Number(expected[index]))
);

const samePlacementMap = (actual, expected) => {
  if (!actual || typeof actual !== 'object' || Array.isArray(actual)) return false;
  const expectedKeys = Object.keys(expected || {});
  return expectedKeys.length > 0
    && expectedKeys.every((key) => String(actual[key] || '').trim() === String(expected[key]).trim());
};

const evaluateAnswer = (question, payload = {}) => {
  const submitted = payload?.value ?? payload;
  const answer = question?.answer || {};

  switch (question?.game_type) {
    case 'calculation': {
      const actual = asNumber(submitted);
      const expected = asNumber(answer.value);
      const tolerance = Number(answer.tolerance ?? 0);
      return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= tolerance;
    }
    case 'balancing':
      return sameNumberArray(submitted?.coefficients || submitted, answer.coefficients);
    case 'atom_match':
      return samePlacementMap(submitted?.placements || submitted, answer.placements);
    case 'electron_match':
      return sameNumberArray(submitted?.shells || submitted, answer.shells);
    default:
      return false;
  }
};

const roundScore = (question, room, isCorrect) => {
  if (!isCorrect) return 0;
  const basePoints = question.points || 100;
  const endsAt = room.round_ends_at ? new Date(room.round_ends_at).getTime() : Date.now();
  const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  const timeLimit = question.time_limit_seconds || 45;
  const timeBonus = Math.ceil((remainingSeconds / timeLimit) * basePoints * 0.5);
  return basePoints + timeBonus;
};

const getRoom = async (roomId) => {
  const { data, error } = await supabase
    .from('arena_rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  if (error) throw error;
  return data;
};

const getPlayers = async (roomId, { includeLeft = false } = {}) => {
  let query = supabase
    .from('arena_room_players')
    .select('*')
    .eq('room_id', roomId);

  if (!includeLeft) query = query.neq('status', 'left');

  const { data, error } = await query.order('score', { ascending: false });
  if (error) throw error;
  return data || [];
};

const getRoundAnswers = async (roomId, roundIndex) => {
  const { data, error } = await supabase
    .from('arena_round_answers')
    .select('id,user_id,is_correct,score_awarded,submitted_at')
    .eq('room_id', roomId)
    .eq('round_index', roundIndex);
  if (error) throw error;
  return data || [];
};

const getQuestion = async (questionId) => {
  if (!questionId) return null;
  const { data, error } = await supabase
    .from('arena_questions')
    .select(QUESTION_COLUMNS)
    .eq('id', questionId)
    .single();
  if (error) throw error;
  if (!isPlayableMiniGameQuestion(data)) {
    throw new Error('Câu hỏi Arena không có payload mini game hợp lệ.');
  }
  return data;
};

const currentQuestionForRoom = async (room) => {
  const questionIds = normalizeQuestionIds(room.question_ids);
  const currentId = questionIds[room.current_round_index || 0];
  return getQuestion(currentId);
};

const upsertRoomPlayer = async (roomId, user, status = 'joined') => {
  const { error } = await supabase
    .from('arena_room_players')
    .upsert({
      room_id: roomId,
      user_id: user.id,
      username: user.username || 'Ẩn danh',
      avatar_seed: user.avatarSeed || user.avatar_seed || user.username || 'Aurum',
      status,
      last_seen_at: new Date().toISOString(),
    }, { onConflict: 'room_id,user_id' });

  if (error) throw error;
};

const selectQuestionSet = (questions) => {
  const byType = GAME_TYPES.flatMap((type) => shuffle(questions.filter((q) => q.game_type === type)));
  const mixed = [];
  const seen = new Set();

  for (const type of GAME_TYPES) {
    const next = byType.find((question) => question.game_type === type && !seen.has(question.id));
    if (next) {
      mixed.push(next);
      seen.add(next.id);
    }
  }

  for (const question of shuffle(questions)) {
    if (mixed.length >= ROUND_COUNT) break;
    if (!seen.has(question.id)) {
      mixed.push(question);
      seen.add(question.id);
    }
  }

  return mixed.slice(0, ROUND_COUNT);
};

const fetchCandidateQuestions = async (difficulty) => {
  let query = supabase
    .from('arena_questions')
    .select(QUESTION_COLUMNS)
    .eq('is_active', true);

  if (difficulty && difficulty !== 'auto') query = query.eq('difficulty', difficulty);

  const { data, error } = await query.order('created_at', { ascending: false }).limit(80);
  if (error) throw error;

  const playable = filterPlayableMiniGameQuestions(data);
  if (playable.length >= ROUND_COUNT || difficulty === 'auto') return playable;

  const fallback = await supabase
    .from('arena_questions')
    .select(QUESTION_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(80);

  if (fallback.error) throw fallback.error;
  return filterPlayableMiniGameQuestions(fallback.data);
};

const ensureRoomQuestionSet = async (room) => {
  const existingIds = normalizeQuestionIds(room.question_ids);
  if (existingIds.length >= ROUND_COUNT) return { room, questions: [] };

  const questions = await fetchCandidateQuestions(room.difficulty);
  const selected = selectQuestionSet(questions);
  if (selected.length === 0) {
    throw new Error('Chưa có câu hỏi mini game Arena đang hoạt động.');
  }

  const { data: updatedRoom, error } = await supabase
    .from('arena_rooms')
    .update({ question_ids: selected.map((question) => question.id) })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;
  return { room: updatedRoom, questions: selected };
};

const roundTiming = (question, now = new Date()) => ({
  round_started_at: now.toISOString(),
  round_ends_at: new Date(now.getTime() + (question.time_limit_seconds || 45) * 1000).toISOString(),
});

const buildRoomState = async (room, userId) => {
  const [players, currentQuestion, ownAnswers] = await Promise.all([
    getPlayers(room.id),
    room.status === 'playing' ? currentQuestionForRoom(room) : Promise.resolve(null),
    supabase
      .from('arena_round_answers')
      .select('round_index,is_correct,score_awarded,submitted_at')
      .eq('room_id', room.id)
      .eq('user_id', userId)
      .order('round_index', { ascending: true }),
  ]);

  if (ownAnswers.error) throw ownAnswers.error;

  return {
    room: {
      id: room.id,
      name: room.name,
      host_id: room.host_id,
      mode: room.mode,
      difficulty: room.difficulty,
      status: room.status,
      max_players: room.max_players,
      current_players: room.current_players,
      current_round_index: room.current_round_index || 0,
      round_started_at: room.round_started_at,
      round_ends_at: room.round_ends_at,
      started_at: room.started_at,
      finished_at: room.finished_at,
      winner_user_id: room.winner_user_id,
      is_practice: Boolean(room.is_practice),
      total_rounds: Math.min(ROUND_COUNT, normalizeQuestionIds(room.question_ids).length || ROUND_COUNT),
    },
    players: players.map((player) => ({
      user_id: player.user_id,
      username: player.username,
      avatar_seed: player.avatar_seed,
      score: player.score || 0,
      correct_count: player.correct_count || 0,
      answered_rounds: player.answered_rounds || [],
      status: player.status,
    })),
    currentQuestion: sanitizeQuestion(currentQuestion),
    myAnswers: ownAnswers.data || [],
    serverTime: new Date().toISOString(),
  };
};

const updatePlayerAfterAnswer = async (roomId, userId, roundIndex, isCorrect, scoreAwarded) => {
  const { data: player, error: fetchError } = await supabase
    .from('arena_room_players')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  const answeredRounds = Array.from(new Set([...(player.answered_rounds || []), roundIndex])).sort((a, b) => a - b);
  const { error } = await supabase
    .from('arena_room_players')
    .update({
      score: (player.score || 0) + scoreAwarded,
      correct_count: (player.correct_count || 0) + (isCorrect ? 1 : 0),
      answered_rounds: answeredRounds,
      last_seen_at: new Date().toISOString(),
    })
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) throw error;
};

const recordArenaStats = async (room, players, winnerUserId) => {
  if (room.is_practice) return;

  const winner = players.find((player) => player.user_id === winnerUserId);
  const isDraw = !winnerUserId;

  for (const player of players) {
    const result = isDraw ? 'draw' : (player.user_id === winnerUserId ? 'win' : 'lose');
    const ptsChange = calcPoints(result, player.score || 0);

    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('arena_stats')
      .eq('id', player.user_id)
      .single();

    if (fetchErr) throw fetchErr;

    const previous = userData?.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 };
    const nextStats = {
      total: (previous.total || 0) + 1,
      wins: (previous.wins || 0) + (result === 'win' ? 1 : 0),
      losses: (previous.losses || 0) + (result === 'lose' ? 1 : 0),
      points: Math.max(0, (previous.points || 0) + ptsChange),
    };

    const { error: updateErr } = await supabase
      .from('users')
      .update({ arena_stats: nextStats })
      .eq('id', player.user_id);

    if (updateErr) throw updateErr;

    await supabase.from('arena_match_history').insert([{
      user_id: player.user_id,
      room_id: room.id,
      opponent_name: isDraw ? 'Đấu trường Arena' : (winner?.username || 'Đấu trường Arena'),
      result,
      score: player.score || 0,
      pts_change: ptsChange,
    }]);

    if (result === 'win') {
      try {
        const Mission = (await import('../models/Mission.js')).default;
        await Mission.updateProgress(player.user_id, 'arena_win', 1);
      } catch (err) {
        console.warn('Failed to update arena mission progress:', err.message);
      }
    }
  }
};

const finishRoom = async (room) => {
  const freshRoom = await getRoom(room.id);
  if (freshRoom.status === 'finished') return freshRoom;

  const players = await getPlayers(room.id);
  const topScore = players.reduce((max, player) => Math.max(max, player.score || 0), 0);
  const winners = players.filter((player) => (player.score || 0) === topScore);
  const winnerUserId = winners.length === 1 ? winners[0].user_id : null;
  const now = new Date().toISOString();

  const { data: finishedRoom, error } = await supabase
    .from('arena_rooms')
    .update({
      status: 'finished',
      finished_at: now,
      round_ends_at: now,
      winner_user_id: winnerUserId,
    })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;

  await supabase
    .from('arena_room_players')
    .update({ status: 'finished', last_seen_at: now })
    .eq('room_id', room.id)
    .neq('status', 'left');

  await recordArenaStats(finishedRoom, players, winnerUserId);
  return finishedRoom;
};

const canAdvanceRound = async (room) => {
  if (room.status !== 'playing') return false;
  const endsAt = room.round_ends_at ? new Date(room.round_ends_at).getTime() : 0;
  if (endsAt && Date.now() >= endsAt) return true;

  const [players, answers] = await Promise.all([
    getPlayers(room.id),
    getRoundAnswers(room.id, room.current_round_index || 0),
  ]);

  return players.length > 0 && answers.length >= players.length;
};

const advanceRoomRound = async (room) => {
  const questionIds = normalizeQuestionIds(room.question_ids);
  const nextIndex = (room.current_round_index || 0) + 1;

  if (nextIndex >= Math.min(ROUND_COUNT, questionIds.length)) {
    return finishRoom(room);
  }

  const nextQuestion = await getQuestion(questionIds[nextIndex]);
  const now = new Date();
  const { data: updatedRoom, error } = await supabase
    .from('arena_rooms')
    .update({
      current_round_index: nextIndex,
      ...roundTiming(nextQuestion, now),
    })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;
  return updatedRoom;
};

const maybeAdvanceAfterAnswer = async (room) => {
  if (await canAdvanceRound(room)) {
    return advanceRoomRound(room);
  }
  return room;
};

router.post('/create', auth, async (req, res) => {
  try {
    const { name, mode = 'solo', difficulty = 'auto', max_players, is_practice = false } = req.body || {};
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    const maxPlayers = is_practice ? 1 : Math.max(1, Math.min(10, Number(max_players) || MODE_MAX_PLAYERS[mode] || 2));

    const { data: newRoom, error } = await supabase
      .from('arena_rooms')
      .insert([{
        id: roomId,
        name: name || `Arena ${roomId}`,
        host_id: req.userId,
        mode,
        difficulty,
        status: 'waiting',
        max_players: maxPlayers,
        current_players: 1,
        is_practice,
      }])
      .select('*')
      .single();

    if (error) throw error;

    await upsertRoomPlayer(newRoom.id, req.user, is_practice ? 'ready' : 'joined');
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    console.error('Lỗi tạo phòng Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const { room_id } = req.body || {};
    if (!room_id) return res.status(400).json({ success: false, message: 'Thiếu mã phòng.' });

    const room = await getRoom(room_id);
    if (room.is_practice) return res.status(400).json({ success: false, message: 'Phòng luyện tập không cho tham gia.' });
    if (room.status !== 'waiting') {
      return res.status(400).json({ success: false, message: 'Phòng này đang thi đấu hoặc đã kết thúc.' });
    }

    const { data: existingPlayer } = await supabase
      .from('arena_room_players')
      .select('user_id,status')
      .eq('room_id', room_id)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (existingPlayer && existingPlayer.status !== 'left') {
      return res.status(200).json({ success: true, room });
    }

    if ((room.current_players || 0) >= (room.max_players || 2)) {
      return res.status(400).json({ success: false, message: 'Phòng đã đầy.' });
    }

    const { data: updatedRoomData, error: updateError } = await supabase
      .rpc('join_arena_room', { p_room_id: room_id });

    if (updateError) throw updateError;
    const updatedRoom = normalizeRpcRoom(updatedRoomData);
    if (!updatedRoom) return res.status(400).json({ success: false, message: 'Phòng đã đầy hoặc không còn chỗ.' });

    await upsertRoomPlayer(room_id, req.user, 'joined');
    res.status(200).json({ success: true, room: updatedRoom });
  } catch (error) {
    console.error('Lỗi tham gia phòng Arena:', error);
    res.status(error?.code === 'PGRST116' ? 404 : 500).json({ success: false, message: error.message });
  }
});

router.post('/find-match', auth, async (req, res) => {
  try {
    const { mode } = req.body || {};
    let query = supabase
      .from('arena_rooms')
      .select('*')
      .eq('status', 'waiting')
      .eq('is_practice', false)
      .neq('host_id', req.userId);

    if (mode) query = query.eq('mode', mode);

    const { data: rooms, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;

    const roomToJoin = (rooms || []).find((room) => (room.current_players || 0) < (room.max_players || 2));
    if (!roomToJoin) {
      return res.status(200).json({ success: true, found: false, message: 'Đang xếp trận...' });
    }

    const { data: updatedRoomData, error: updateError } = await supabase
      .rpc('join_arena_room', { p_room_id: roomToJoin.id });

    if (updateError) throw updateError;
    const updatedRoom = normalizeRpcRoom(updatedRoomData);
    if (!updatedRoom) return res.status(200).json({ success: true, found: false, message: 'Đang xếp trận...' });

    await upsertRoomPlayer(roomToJoin.id, req.user, 'joined');
    return res.status(200).json({ success: true, room: updatedRoom, found: true });
  } catch (error) {
    console.error('Lỗi tìm trận:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/questions/:difficulty', async (req, res) => {
  try {
    const questions = await fetchCandidateQuestions(req.params.difficulty);
    const selected = selectQuestionSet(questions).map((question) => sanitizeQuestion(question));
    res.status(200).json({ success: true, questions: selected });
  } catch (error) {
    console.error('Lỗi tải câu hỏi Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/realtime-token', auth, async (req, res) => {
  try {
    const secret = process.env.SUPABASE_JWT_SECRET || (process.env.NODE_ENV !== 'production' ? process.env.JWT_SECRET : null);
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Thiếu SUPABASE_JWT_SECRET để cấp realtime token.' });
    }

    const token = jwt.sign(
      {
        sub: req.userId,
        role: 'authenticated',
        aud: 'authenticated',
      },
      secret,
      { expiresIn: '15m' },
    );

    res.json({ success: true, token, expiresIn: 900 });
  } catch (error) {
    console.error('Lỗi cấp realtime token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/realtime-token', auth, async (req, res) => {
  req.method = 'GET';
  router.handle(req, res);
});

router.post('/room/:id/start', auth, async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    if (room.status === 'finished') return res.status(400).json({ success: false, message: 'Trận đã kết thúc.' });
    if (room.status === 'playing') {
      return res.json({ success: true, state: await buildRoomState(room, req.userId) });
    }
    if (room.host_id !== req.userId) {
      return res.status(403).json({ success: false, message: 'Chỉ chủ phòng được bắt đầu trận.' });
    }

    const players = await getPlayers(room.id);
    const playerCount = Math.max(players.length, room.current_players || 1);
    if (!room.is_practice && playerCount < (room.max_players || 2)) {
      return res.status(400).json({ success: false, message: 'Chưa đủ người chơi để bắt đầu.' });
    }

    const ensured = await ensureRoomQuestionSet(room);
    const questionIds = normalizeQuestionIds(ensured.room.question_ids);
    const firstQuestion = ensured.questions.find((question) => question.id === questionIds[0]) || await getQuestion(questionIds[0]);
    const now = new Date();
    const { data: startedRoom, error } = await supabase
      .from('arena_rooms')
      .update({
        status: 'playing',
        current_round_index: 0,
        started_at: now.toISOString(),
        finished_at: null,
        winner_user_id: null,
        ...roundTiming(firstQuestion, now),
      })
      .eq('id', room.id)
      .select('*')
      .single();

    if (error) throw error;

    await supabase
      .from('arena_room_players')
      .update({ status: 'playing', last_seen_at: now.toISOString() })
      .eq('room_id', room.id)
      .neq('status', 'left');

    res.json({ success: true, state: await buildRoomState(startedRoom, req.userId) });
  } catch (error) {
    console.error('Lỗi bắt đầu trận Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/room/:id/state', auth, async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    res.json({ success: true, state: await buildRoomState(room, req.userId) });
  } catch (error) {
    console.error('Lỗi lấy trạng thái phòng Arena:', error);
    res.status(error?.code === 'PGRST116' ? 404 : 500).json({ success: false, message: error.message });
  }
});

router.post('/room/:id/answer', auth, async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    if (room.status !== 'playing') {
      return res.status(400).json({ success: false, message: 'Phòng chưa ở trạng thái thi đấu.' });
    }

    const endsAt = room.round_ends_at ? new Date(room.round_ends_at).getTime() : 0;
    if (endsAt && Date.now() > endsAt + 1000) {
      return res.status(400).json({ success: false, message: 'Vòng chơi đã hết thời gian.' });
    }

    const question = await currentQuestionForRoom(room);
    if (!question) return res.status(400).json({ success: false, message: 'Không tìm thấy câu hỏi hiện tại.' });

    const roundIndex = room.current_round_index || 0;
    const { data: duplicate, error: duplicateError } = await supabase
      .from('arena_round_answers')
      .select('id')
      .eq('room_id', room.id)
      .eq('user_id', req.userId)
      .eq('round_index', roundIndex)
      .maybeSingle();

    if (duplicateError) throw duplicateError;
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Bạn đã trả lời vòng này.' });
    }

    const answerPayload = req.body || {};
    const isCorrect = evaluateAnswer(question, answerPayload);
    const scoreAwarded = roundScore(question, room, isCorrect);

    const { error: insertError } = await supabase.from('arena_round_answers').insert([{
      room_id: room.id,
      question_id: question.id,
      user_id: req.userId,
      round_index: roundIndex,
      answer_payload: answerPayload,
      is_correct: isCorrect,
      score_awarded: scoreAwarded,
    }]);

    if (insertError) throw insertError;

    await updatePlayerAfterAnswer(room.id, req.userId, roundIndex, isCorrect, scoreAwarded);
    const advancedRoom = await maybeAdvanceAfterAnswer(room);

    res.json({
      success: true,
      isCorrect,
      scoreAwarded,
      explanation: isCorrect ? question.explanation || null : null,
      state: await buildRoomState(advancedRoom, req.userId),
    });
  } catch (error) {
    console.error('Lỗi nộp đáp án Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/room/:id/advance', auth, async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    if (room.status !== 'playing') {
      return res.status(400).json({ success: false, message: 'Phòng chưa ở trạng thái thi đấu.' });
    }

    if (!(await canAdvanceRound(room))) {
      return res.status(400).json({ success: false, message: 'Chưa thể chuyển vòng vì còn thời gian hoặc còn người chưa trả lời.' });
    }

    const advancedRoom = await advanceRoomRound(room);
    res.json({ success: true, state: await buildRoomState(advancedRoom, req.userId) });
  } catch (error) {
    console.error('Lỗi chuyển vòng Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/match-result', auth, async (req, res) => {
  try {
    const { room_id, result, score, opponent_name } = req.body || {};
    const ptsChange = calcPoints(result, score || 0);

    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('arena_stats')
      .eq('id', req.userId)
      .single();

    if (fetchErr) throw fetchErr;

    const prev = userData?.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 };
    const newStats = {
      total: (prev.total || 0) + 1,
      wins: (prev.wins || 0) + (result === 'win' ? 1 : 0),
      losses: (prev.losses || 0) + (result === 'lose' ? 1 : 0),
      points: Math.max(0, (prev.points || 0) + ptsChange),
    };

    const { error: updateErr } = await supabase
      .from('users')
      .update({ arena_stats: newStats })
      .eq('id', req.userId);

    if (updateErr) throw updateErr;

    await supabase.from('arena_match_history').insert([{
      user_id: req.userId,
      room_id: room_id || null,
      opponent_name: opponent_name || 'Đối thủ ẩn danh',
      result,
      score: score || 0,
      pts_change: ptsChange,
    }]);

    if (room_id) {
      await supabase.from('arena_rooms').update({ status: 'finished' }).eq('id', room_id);
    }

    if (result === 'win') {
      try {
        const Mission = (await import('../models/Mission.js')).default;
        await Mission.updateProgress(req.userId, 'arena_win', 1);
      } catch (err) {
        console.warn('Failed to update arena mission progress:', err.message);
      }
    }

    res.json({ success: true, stats: newStats, ptsChange });
  } catch (error) {
    console.error('Lỗi ghi kết quả trận đấu:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, arena_stats, avatar_seed, streak_count, level')
      .not('arena_stats', 'is', null)
      .order('arena_stats->>points', { ascending: false })
      .limit(10);

    if (error) throw error;

    const leaderboard = (users || [])
      .filter((user) => (user.arena_stats?.points || 0) > 0)
      .map((user, index) => ({
        rank: index + 1,
        name: user.username,
        points: user.arena_stats?.points || 0,
        wins: user.arena_stats?.wins || 0,
        total: user.arena_stats?.total || 0,
        avatarSeed: user.avatar_seed || user.username,
        streakCount: user.streak_count || 0,
        level: user.level || 1,
      }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Lỗi tải bảng xếp hạng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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

router.patch('/save-avatar', auth, async (req, res) => {
  try {
    const { seed } = req.body || {};
    if (!seed || typeof seed !== 'string') {
      return res.status(400).json({ success: false, message: 'Thiếu avatar seed' });
    }

    const { error } = await supabase
      .from('users')
      .update({ avatar_seed: seed })
      .eq('id', req.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi lưu avatar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/room/:id', async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    res.json({ success: true, room });
  } catch (error) {
    console.error('Lỗi lấy thông tin phòng:', error);
    res.status(error?.code === 'PGRST116' ? 404 : 500).json({ success: false, message: error.message });
  }
});

router.post('/leave', auth, async (req, res) => {
  try {
    const { room_id } = req.body || {};
    if (!room_id) return res.status(400).json({ success: false, message: 'Thiếu mã phòng' });

    const room = await getRoom(room_id);
    await supabase
      .from('arena_room_players')
      .update({ status: 'left', last_seen_at: new Date().toISOString() })
      .eq('room_id', room_id)
      .eq('user_id', req.userId);

    const remainingPlayers = await getPlayers(room_id);
    const nextCount = remainingPlayers.length;

    if (nextCount <= 0 && room.status !== 'playing') {
      const { error: deleteError } = await supabase.from('arena_rooms').delete().eq('id', room_id);
      if (deleteError) throw deleteError;
      return res.json({ success: true, current_players: 0, deleted: true });
    }

    const { error: updateError } = await supabase
      .from('arena_rooms')
      .update({ current_players: nextCount })
      .eq('id', room_id);

    if (updateError) throw updateError;
    res.json({ success: true, current_players: nextCount });
  } catch (error) {
    console.error('Lỗi rời phòng:', error);
    res.status(error?.code === 'PGRST116' ? 404 : 500).json({ success: false, message: error.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('arena_rooms')
      .select(`
        *,
        users:host_id (username, avatar_seed, streak_count, level)
      `)
      .eq('status', 'waiting')
      .eq('is_practice', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (rooms || []).map((room) => ({
      ...room,
      host_name: room.users?.username || 'Ẩn danh',
      host_avatar: {
        seed: room.users?.avatar_seed || room.users?.username || 'Aurum',
        streakCount: room.users?.streak_count || 0,
        level: room.users?.level || 1,
      },
    }));

    res.json({ success: true, rooms: formatted });
  } catch (error) {
    console.error('Lỗi lấy danh sách phòng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
