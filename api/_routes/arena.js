import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

const ROUND_COUNT = 10;
const POINTS = { win: 100, lose: -50, draw: 20 };
const MODE_MAX_PLAYERS = { solo: 2, '3vs3': 6, '5vs5': 10 };
const GAME_TYPES = ['calculation', 'balancing', 'atom_match', 'electron_match'];
const ACTIVE_PLAYER_STATUSES = ['joined', 'ready', 'playing'];
const QUESTION_COLUMNS = [
  'id',
  'khoi_id',
  'do_kho',
  'loai_game',
  'cau_hoi',
  'noi_dung_game',
  'dap_an',
  'diem',
  'gioi_han_giay',
  'giai_thich',
].join(',');

const calcPoints = (result, score) => {
  const base = POINTS[result] ?? 0;
  const bonus = result === 'win' ? Math.floor(score / 100) * 5 : 0;
  return base + bonus;
};

const normalizeQuestionRow = (question) => {
  if (!question) return null;
  return {
    ...question,
    difficulty: question.do_kho ?? question.difficulty,
    game_type: question.loai_game ?? question.game_type,
    question: question.cau_hoi ?? question.question,
    payload: question.noi_dung_game ?? question.payload,
    answer: question.dap_an ?? question.answer,
    points: question.diem ?? question.points,
    time_limit_seconds: question.gioi_han_giay ?? question.time_limit_seconds,
    explanation: question.giai_thich ?? question.explanation,
    is_active: question.dang_hoat_dong ?? question.is_active,
  };
};

const normalizeRoomRow = (room) => {
  if (!room) return null;
  return {
    ...room,
    name: room.ten ?? room.name,
    host_id: room.chu_phong_id ?? room.host_id,
    mode: room.che_do ?? room.mode,
    difficulty: room.do_kho ?? room.difficulty,
    max_players: room.so_nguoi_toi_da ?? room.max_players,
    current_players: room.so_nguoi_hien_tai ?? room.current_players,
    question_ids: room.danh_sach_cau_hoi_id ?? room.question_ids ?? room.cau_hoi_ids,
    current_round_index: room.vong_hien_tai ?? room.current_round_index,
    round_started_at: room.vong_bat_dau_luc ?? room.round_started_at,
    round_ends_at: room.vong_ket_thuc_luc ?? room.round_ends_at,
    started_at: room.bat_dau_luc ?? room.started_at,
    finished_at: room.ket_thuc_luc ?? room.finished_at,
    winner_user_id: room.nguoi_thang_id ?? room.winner_user_id,
    is_practice: room.la_luyen_tap ?? room.is_practice,
  };
};

const normalizePlayerRow = (player) => {
  if (!player) return null;
  return {
    ...player,
    room_id: player.phong_dau_id ?? player.room_id,
    user_id: player.nguoi_dung_id ?? player.user_id,
    correct_count: player.so_cau_dung ?? player.correct_count,
    answered_rounds: player.vong_da_tra_loi ?? player.answered_rounds,
    joined_at: player.tham_gia_luc ?? player.joined_at,
    last_seen_at: player.xem_cuoi_luc ?? player.last_seen_at,
  };
};

const normalizeAnswerRow = (answer) => {
  if (!answer) return null;
  return {
    ...answer,
    room_id: answer.phong_dau_id ?? answer.room_id,
    question_id: answer.cau_hoi_id ?? answer.question_id,
    user_id: answer.nguoi_dung_id ?? answer.user_id,
    round_index: answer.thu_tu_vong ?? answer.round_index,
    answer_payload: answer.noi_dung_tra_loi ?? answer.answer_payload,
    is_correct: answer.dung ?? answer.is_correct,
    score_awarded: answer.diem_duoc_cong ?? answer.score_awarded,
    submitted_at: answer.nop_luc ?? answer.submitted_at,
  };
};

const normalizeBattleRow = (battle) => {
  if (!battle) return null;
  return {
    ...battle,
    user_id: battle.nguoi_dung_id ?? battle.user_id,
    room_id: battle.phong_dau_id ?? battle.room_id,
    opponent_name: battle.ten_doi_thu ?? battle.opponent_name,
    result: battle.ket_qua ?? battle.result,
    score: battle.diem ?? battle.score,
    points_delta: battle.diem_thay_doi ?? battle.points_delta,
    played_at: battle.dau_luc ?? battle.played_at,
  };
};

const normalizeRpcRoom = (room) => normalizeRoomRow(Array.isArray(room) ? room[0] : room);
const isMissingRpcError = (error) => (
  error?.code === 'PGRST202'
  || error?.code === '42883'
  || /function .* does not exist|schema cache/i.test(error?.message || '')
);

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
  const gradeLevelId = question.khoi_id;
  return {
    id: question.id,
    gradeLevel: gradeLevelId,
    khoi_id: gradeLevelId,
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
    .from('phong_dau')
    .select('*')
    .eq('id', roomId)
    .single();
  if (error) throw error;
  return normalizeRoomRow(data);
};

const getPlayers = async (roomId, { includeLeft = false } = {}) => {
  let query = supabase
    .from('nguoi_choi')
    .select('*')
    .eq('phong_dau_id', roomId);

  if (!includeLeft) query = query.neq('status', 'left');

  const { data, error } = await query.order('score', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizePlayerRow);
};

const getRoundAnswers = async (roomId, roundIndex) => {
  const { data, error } = await supabase
    .from('tra_loi_vong')
    .select('id,nguoi_dung_id,dung,diem_duoc_cong,nop_luc')
    .eq('phong_dau_id', roomId)
    .eq('thu_tu_vong', roundIndex);
  if (error) throw error;
  return (data || []).map(normalizeAnswerRow);
};

const getQuestion = async (questionId) => {
  if (!questionId) return null;
  const { data, error } = await supabase
    .from('cau_hoi_dau')
    .select(QUESTION_COLUMNS)
    .eq('id', questionId)
    .single();
  if (error) throw error;
  const question = normalizeQuestionRow(data);
  if (!isPlayableMiniGameQuestion(question)) {
    throw new Error('Câu hỏi Arena không có payload mini game hợp lệ.');
  }
  return question;
};

const currentQuestionForRoom = async (room) => {
  const questionIds = normalizeQuestionIds(room.question_ids);
  const currentId = questionIds[room.current_round_index || 0];
  return getQuestion(currentId);
};

const upsertRoomPlayer = async (roomId, user, status = 'joined') => {
  const { error } = await supabase
    .from('nguoi_choi')
    .upsert({
      phong_dau_id: roomId,
      nguoi_dung_id: user.id,
      username: user.username || 'Ẩn danh',
      avatar_seed: user.avatarSeed || user.avatar_seed || user.username || 'Aurum',
      status,
      xem_cuoi_luc: new Date().toISOString(),
    }, { onConflict: 'phong_dau_id,nguoi_dung_id' });

  if (error) throw error;
};

const leaveRoomMembership = async (roomId, userId) => {
  const { data: roomRow, error: roomError } = await supabase
    .from('phong_dau')
    .select('*')
    .eq('id', roomId)
    .maybeSingle();

  if (roomError) throw roomError;
  if (!roomRow) return { deleted: true, current_players: 0 };

  const room = normalizeRoomRow(roomRow);
  const { error: leaveError } = await supabase
    .from('nguoi_choi')
    .update({ status: 'left', xem_cuoi_luc: new Date().toISOString() })
    .eq('phong_dau_id', roomId)
    .eq('nguoi_dung_id', userId)
    .in('status', ACTIVE_PLAYER_STATUSES);

  if (leaveError) throw leaveError;

  const remainingPlayers = await getPlayers(roomId);
  const nextCount = remainingPlayers.length;

  if (nextCount === 0 && room.status === 'waiting') {
    const { error: deleteError } = await supabase.from('phong_dau').delete().eq('id', roomId);
    if (deleteError) throw deleteError;
    return { deleted: true, current_players: 0 };
  }

  const updates = { so_nguoi_hien_tai: nextCount };
  if (room.host_id === userId && remainingPlayers.length > 0) {
    const nextHost = [...remainingPlayers].sort((a, b) => (
      new Date(a.joined_at || 0).getTime() - new Date(b.joined_at || 0).getTime()
    ))[0];
    updates.chu_phong_id = nextHost.nguoi_dung_id;
  }

  const { error: updateError } = await supabase
    .from('phong_dau')
    .update(updates)
    .eq('id', roomId);

  if (updateError) throw updateError;
  return { deleted: false, current_players: nextCount, host_id: updates.chu_phong_id || room.host_id };
};

const leaveOtherActiveRooms = async (userId, keepRoomId = null) => {
  const { data: memberships, error } = await supabase
    .from('nguoi_choi')
    .select('phong_dau_id')
    .eq('nguoi_dung_id', userId)
    .in('status', ACTIVE_PLAYER_STATUSES);

  if (error) throw error;

  const otherRoomIds = [...new Set((memberships || [])
    .map((membership) => membership.phong_dau_id)
    .filter((roomId) => roomId && roomId !== keepRoomId))];

  for (const roomId of otherRoomIds) {
    await leaveRoomMembership(roomId, userId);
  }
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
    .from('cau_hoi_dau')
    .select(QUESTION_COLUMNS)
    .eq('dang_hoat_dong', true);

  if (difficulty && difficulty !== 'auto') query = query.eq('do_kho', difficulty);

  const { data, error } = await query.order('created_at', { ascending: false }).limit(80);
  if (error) throw error;

  const playable = filterPlayableMiniGameQuestions((data || []).map(normalizeQuestionRow));
  if (playable.length >= ROUND_COUNT || difficulty === 'auto') return playable;

  const fallback = await supabase
    .from('cau_hoi_dau')
    .select(QUESTION_COLUMNS)
    .eq('dang_hoat_dong', true)
    .order('created_at', { ascending: false })
    .limit(80);

  if (fallback.error) throw fallback.error;
  return filterPlayableMiniGameQuestions((fallback.data || []).map(normalizeQuestionRow));
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
    .from('phong_dau')
    .update({ danh_sach_cau_hoi_id: selected.map((question) => question.id) })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;
  return { room: normalizeRoomRow(updatedRoom), questions: selected };
};

const roundTiming = (question, now = new Date()) => ({
  vong_bat_dau_luc: now.toISOString(),
  vong_ket_thuc_luc: new Date(now.getTime() + (question.time_limit_seconds || 45) * 1000).toISOString(),
});

const buildRoomState = async (room, userId) => {
  const [players, currentQuestion, ownAnswers] = await Promise.all([
    getPlayers(room.id),
    room.status === 'playing' ? currentQuestionForRoom(room) : Promise.resolve(null),
    supabase
      .from('tra_loi_vong')
      .select('thu_tu_vong,dung,diem_duoc_cong,nop_luc')
      .eq('phong_dau_id', room.id)
      .eq('nguoi_dung_id', userId)
      .order('thu_tu_vong', { ascending: true }),
  ]);

  if (ownAnswers.error) throw ownAnswers.error;

  const actualPlayerCount = players.length;

  return {
    room: {
      id: room.id,
      name: room.name,
      host_id: room.host_id,
      chu_phong_id: room.host_id,
      mode: room.mode,
      difficulty: room.difficulty,
      status: room.status,
      max_players: room.max_players,
      current_players: actualPlayerCount,
      current_round_index: room.current_round_index || 0,
      round_started_at: room.round_started_at,
      round_ends_at: room.round_ends_at,
      started_at: room.started_at,
      finished_at: room.finished_at,
      winner_user_id: room.winner_user_id,
      nguoi_thang_id: room.winner_user_id,
      is_practice: Boolean(room.is_practice),
      total_rounds: Math.min(ROUND_COUNT, normalizeQuestionIds(room.question_ids).length || ROUND_COUNT),
    },
    players: players.map((player) => ({
      nguoi_dung_id: player.nguoi_dung_id,
      username: player.username,
      avatar_seed: player.avatar_seed,
      score: player.score || 0,
      correct_count: player.correct_count || 0,
      answered_rounds: player.answered_rounds || [],
      status: player.status,
    })),
    currentQuestion: sanitizeQuestion(currentQuestion),
    myAnswers: (ownAnswers.data || []).map(normalizeAnswerRow),
    serverTime: new Date().toISOString(),
  };
};

const updatePlayerAfterAnswer = async (roomId, userId, roundIndex, isCorrect, scoreAwarded) => {
  const { data: player, error: fetchError } = await supabase
    .from('nguoi_choi')
    .select('*')
    .eq('phong_dau_id', roomId)
    .eq('nguoi_dung_id', userId)
    .single();

  if (fetchError) throw fetchError;

  const normalizedPlayer = normalizePlayerRow(player);
  const answeredRounds = Array.from(new Set([...(normalizedPlayer.answered_rounds || []), roundIndex])).sort((a, b) => a - b);
  const { error } = await supabase
    .from('nguoi_choi')
    .update({
      score: (normalizedPlayer.score || 0) + scoreAwarded,
      so_cau_dung: (normalizedPlayer.correct_count || 0) + (isCorrect ? 1 : 0),
      vong_da_tra_loi: answeredRounds,
      xem_cuoi_luc: new Date().toISOString(),
    })
    .eq('phong_dau_id', roomId)
    .eq('nguoi_dung_id', userId);

  if (error) throw error;
};

const recordArenaStats = async (room, players, winnerUserId) => {
  if (room.is_practice) return;

  const winner = players.find((player) => player.nguoi_dung_id === winnerUserId);
  const isDraw = !winnerUserId;

  for (const player of players) {
    const result = isDraw ? 'draw' : (player.nguoi_dung_id === winnerUserId ? 'win' : 'lose');
    const ptsChange = calcPoints(result, player.score || 0);

    const { data: userData, error: fetchErr } = await supabase
      .from('nguoi_dung')
      .select('thong_ke_dau')
      .eq('id', player.nguoi_dung_id)
      .single();

    if (fetchErr) throw fetchErr;

    const previous = userData?.thong_ke_dau || { total: 0, wins: 0, losses: 0, points: 0 };
    const nextStats = {
      total: (previous.total || 0) + 1,
      wins: (previous.wins || 0) + (result === 'win' ? 1 : 0),
      losses: (previous.losses || 0) + (result === 'lose' ? 1 : 0),
      points: Math.max(0, (previous.points || 0) + ptsChange),
    };

    const { error: updateErr } = await supabase
      .from('nguoi_dung')
      .update({ thong_ke_dau: nextStats })
      .eq('id', player.nguoi_dung_id);

    if (updateErr) throw updateErr;

    await supabase.from('lich_su_dau').insert([{
      nguoi_dung_id: player.nguoi_dung_id,
      phong_dau_id: room.id,
      ten_doi_thu: isDraw ? 'Đấu trường Arena' : (winner?.username || 'Đấu trường Arena'),
      ket_qua: result,
      diem: player.score || 0,
      diem_thay_doi: ptsChange,
    }]);

    if (result === 'win') {
      try {
        const Mission = (await import('../models/Mission.js')).default;
        await Mission.updateProgress(player.nguoi_dung_id, 'arena_win', 1);
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
  const winnerUserId = winners.length === 1 ? winners[0].nguoi_dung_id : null;
  const now = new Date().toISOString();

  const { data: finishedRoom, error } = await supabase
    .from('phong_dau')
    .update({
      status: 'finished',
      ket_thuc_luc: now,
      vong_ket_thuc_luc: now,
      nguoi_thang_id: winnerUserId,
    })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;

  const normalizedFinishedRoom = normalizeRoomRow(finishedRoom);

  await supabase
    .from('nguoi_choi')
    .update({ status: 'finished', xem_cuoi_luc: now })
    .eq('phong_dau_id', room.id)
    .neq('status', 'left');

  await recordArenaStats(normalizedFinishedRoom, players, winnerUserId);
  return normalizedFinishedRoom;
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
    .from('phong_dau')
    .update({
      vong_hien_tai: nextIndex,
      ...roundTiming(nextQuestion, now),
    })
    .eq('id', room.id)
    .select('*')
    .single();

  if (error) throw error;
  return normalizeRoomRow(updatedRoom);
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

    const rpcParams = {
      p_room_id: roomId,
      p_name: name || `Arena ${roomId}`,
      p_user_id: req.userId,
      p_username: req.user.username || 'Ẩn danh',
      p_avatar_seed: req.user.avatarSeed || req.user.avatar_seed || req.user.username || 'Aurum',
      p_mode: mode,
      p_difficulty: difficulty,
      p_max_players: maxPlayers,
      p_is_practice: Boolean(is_practice),
    };

    let { data: newRoomData, error } = await supabase.rpc('create_arena_room', rpcParams);

    // Compatibility while the SQL update is being deployed. Once the RPC is
    // available, room + host membership are committed in one transaction.
    if (error && isMissingRpcError(error)) {
      const fallback = await supabase
        .from('phong_dau')
        .insert([{
          id: roomId,
          ten: rpcParams.p_name,
          chu_phong_id: req.userId,
          che_do: mode,
          do_kho: difficulty,
          status: 'waiting',
          so_nguoi_toi_da: maxPlayers,
          so_nguoi_hien_tai: 1,
          la_luyen_tap: is_practice,
        }])
        .select('*')
        .single();
      if (fallback.error) throw fallback.error;
      try {
        await upsertRoomPlayer(fallback.data.id, req.user, is_practice ? 'ready' : 'joined');
        await leaveOtherActiveRooms(req.userId, fallback.data.id);
      } catch (playerError) {
        await supabase.from('phong_dau').delete().eq('id', fallback.data.id);
        throw playerError;
      }
      newRoomData = fallback.data;
      error = null;
    }

    if (error) throw error;
    const newRoom = normalizeRpcRoom(newRoomData);
    if (!newRoom) throw new Error('Không thể tạo phòng Arena.');
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    console.error('Lỗi tạo phòng Arena:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const phong_dau_id = String(req.body?.phong_dau_id || '').trim();
    if (!phong_dau_id) return res.status(400).json({ success: false, message: 'Thiếu mã phòng.' });

    const room = await getRoom(phong_dau_id);
    if (room.is_practice) return res.status(400).json({ success: false, message: 'Phòng luyện tập không cho tham gia.' });
    if (room.status !== 'waiting') {
      return res.status(400).json({ success: false, message: 'Phòng này đang thi đấu hoặc đã kết thúc.' });
    }

    const { data: existingPlayer, error: existingPlayerError } = await supabase
      .from('nguoi_choi')
      .select('nguoi_dung_id,status')
      .eq('phong_dau_id', phong_dau_id)
      .eq('nguoi_dung_id', req.userId)
      .maybeSingle();

    if (existingPlayerError) throw existingPlayerError;

    if (existingPlayer && existingPlayer.status !== 'left') {
      await leaveOtherActiveRooms(req.userId, phong_dau_id);
      return res.status(200).json({ success: true, room });
    }

    // The database function reserves a slot and creates/reactivates the player
    // in the same transaction.  Keeping these writes together prevents a room
    // from displaying 2/2 while its host can still only load one player.
    const { data: updatedRoomData, error: updateError } = await supabase
      .rpc('join_arena_room', {
        p_room_id: phong_dau_id,
        p_user_id: req.userId,
        p_username: req.user.username || 'Ẩn danh',
        p_avatar_seed: req.user.avatarSeed || req.user.avatar_seed || req.user.username || 'Aurum',
      });

    if (updateError) throw updateError;
    const updatedRoom = normalizeRpcRoom(updatedRoomData);
    if (!updatedRoom) return res.status(400).json({ success: false, message: 'Phòng đã đầy hoặc không còn chỗ.' });

    // The current RPC already performs this cleanup transactionally. Keeping
    // the post-success cleanup makes rolling deployments compatible with the
    // previous RPC without ejecting a player when the target room is full.
    await leaveOtherActiveRooms(req.userId, phong_dau_id);
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
      .from('phong_dau')
      .select('*')
      .eq('status', 'waiting')
      .eq('la_luyen_tap', false)
      .neq('chu_phong_id', req.userId);

    if (mode) query = query.eq('che_do', mode);

    const { data: rooms, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;

    const candidateRooms = (rooms || []).map(normalizeRoomRow);
    if (candidateRooms.length === 0) {
      return res.status(200).json({ success: true, found: false, message: 'Đang xếp trận...' });
    }

    // Stored counters may be stale and another request can fill a room between
    // listing and joining it. Let the transactional RPC verify actual rows and
    // continue to the next candidate when the first one loses that race.
    for (const candidateRoom of candidateRooms) {
      const { data: updatedRoomData, error: updateError } = await supabase
        .rpc('join_arena_room', {
          p_room_id: candidateRoom.id,
          p_user_id: req.userId,
          p_username: req.user.username || 'Ẩn danh',
          p_avatar_seed: req.user.avatarSeed || req.user.avatar_seed || req.user.username || 'Aurum',
        });

      if (updateError) throw updateError;
      const updatedRoom = normalizeRpcRoom(updatedRoomData);
      if (!updatedRoom) continue;

      await leaveOtherActiveRooms(req.userId, candidateRoom.id);
      return res.status(200).json({ success: true, room: updatedRoom, found: true });
    }

    return res.status(200).json({ success: true, found: false, message: 'Đang xếp trận...' });
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
    // This token is consumed by Supabase Realtime and must be signed with the
    // project's JWT secret. The application's JWT_SECRET is unrelated.
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Thiếu SUPABASE_JWT_SECRET để cấp realtime token.' });
    }

    const token = jwt.sign(
      {
        sub: req.userId,
        role: 'authenticated',
        aud: 'authenticated',
        ...(req.decodedCustomJwt
          ? { app_session_id: req.decodedCustomJwt.sessionId }
          : { session_id: jwt.decode(req.token)?.session_id, aurum_auth_user_id: jwt.decode(req.token)?.sub }),
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

router.get('/active-room', auth, async (req, res) => {
  try {
    const { data: membership, error } = await supabase
      .from('nguoi_choi')
      .select('phong_dau_id')
      .eq('nguoi_dung_id', req.userId)
      .in('status', ACTIVE_PLAYER_STATUSES)
      .order('xem_cuoi_luc', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!membership?.phong_dau_id) {
      return res.json({ success: true, room: null });
    }

    const room = await getRoom(membership.phong_dau_id);
    if (!['waiting', 'playing'].includes(room.status)) {
      return res.json({ success: true, room: null });
    }
    return res.json({ success: true, room });
  } catch (error) {
    console.error('Lỗi khôi phục phòng Arena:', error);
    return res.status(error?.code === 'PGRST116' ? 200 : 500).json({
      success: error?.code === 'PGRST116',
      room: null,
      ...(error?.code === 'PGRST116' ? {} : { message: error.message }),
    });
  }
});

router.post('/room/:id/start', auth, async (req, res) => {
  try {
    const room = await getRoom(req.params.id);
    if (room.status === 'finished') return res.status(400).json({ success: false, message: 'Trận đã kết thúc.' });
    if (room.status === 'playing') {
      return res.json({ success: true, state: await buildRoomState(room, req.userId) });
    }
    if (room.chu_phong_id !== req.userId) {
      return res.status(403).json({ success: false, message: 'Chỉ chủ phòng được bắt đầu trận.' });
    }

    const players = await getPlayers(room.id);
    const playerCount = players.length;
    if (!room.is_practice && playerCount < (room.max_players || 2)) {
      return res.status(400).json({ success: false, message: 'Chưa đủ người chơi để bắt đầu.' });
    }

    const ensured = await ensureRoomQuestionSet(room);
    const questionIds = normalizeQuestionIds(ensured.room.question_ids);
    const firstQuestion = ensured.questions.find((question) => question.id === questionIds[0]) || await getQuestion(questionIds[0]);
    const now = new Date();
    const timing = roundTiming(firstQuestion, now);
    let { data: startedRoomData, error } = await supabase.rpc('start_arena_room', {
      p_room_id: room.id,
      p_user_id: req.userId,
      p_started_at: timing.vong_bat_dau_luc,
      p_round_ends_at: timing.vong_ket_thuc_luc,
    });

    if (error && isMissingRpcError(error)) {
      const fallback = await supabase
        .from('phong_dau')
        .update({
          status: 'playing',
          vong_hien_tai: 0,
          bat_dau_luc: now.toISOString(),
          ket_thuc_luc: null,
          nguoi_thang_id: null,
          ...timing,
        })
        .eq('id', room.id)
        .eq('status', 'waiting')
        .eq('chu_phong_id', req.userId)
        .select('*')
        .single();

      if (fallback.error) throw fallback.error;
      const { error: playersUpdateError } = await supabase
        .from('nguoi_choi')
        .update({ status: 'playing', xem_cuoi_luc: now.toISOString() })
        .eq('phong_dau_id', room.id)
        .in('status', ACTIVE_PLAYER_STATUSES);
      if (playersUpdateError) throw playersUpdateError;
      startedRoomData = fallback.data;
      error = null;
    }

    if (error) throw error;
    const startedRoom = normalizeRpcRoom(startedRoomData);
    if (!startedRoom) {
      const freshRoom = await getRoom(room.id);
      if (freshRoom.status === 'playing') {
        return res.json({ success: true, state: await buildRoomState(freshRoom, req.userId) });
      }
      if (freshRoom.chu_phong_id !== req.userId) {
        return res.status(403).json({ success: false, message: 'Bạn không còn là chủ phòng.' });
      }
      const freshPlayers = await getPlayers(room.id);
      if (!freshRoom.is_practice && freshPlayers.length < (freshRoom.max_players || 2)) {
        return res.status(400).json({ success: false, message: 'Người chơi đã rời phòng, chưa thể bắt đầu.' });
      }
      return res.status(409).json({ success: false, message: 'Trạng thái phòng vừa thay đổi, vui lòng thử lại.' });
    }

    return res.json({ success: true, state: await buildRoomState(startedRoom, req.userId) });
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
      .from('tra_loi_vong')
      .select('id')
      .eq('phong_dau_id', room.id)
      .eq('nguoi_dung_id', req.userId)
      .eq('thu_tu_vong', roundIndex)
      .maybeSingle();

    if (duplicateError) throw duplicateError;
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Bạn đã trả lời vòng này.' });
    }

    const answerPayload = req.body || {};
    const isCorrect = evaluateAnswer(question, answerPayload);
    const scoreAwarded = roundScore(question, room, isCorrect);

    const { error: insertError } = await supabase.from('tra_loi_vong').insert([{
      phong_dau_id: room.id,
      cau_hoi_id: question.id,
      nguoi_dung_id: req.userId,
      thu_tu_vong: roundIndex,
      noi_dung_tra_loi: answerPayload,
      dung: isCorrect,
      diem_duoc_cong: scoreAwarded,
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
    const { phong_dau_id, result, score, opponent_name } = req.body || {};
    const ptsChange = calcPoints(result, score || 0);

    const { data: userData, error: fetchErr } = await supabase
      .from('nguoi_dung')
      .select('thong_ke_dau')
      .eq('id', req.userId)
      .single();

    if (fetchErr) throw fetchErr;

    const prev = userData?.thong_ke_dau || { total: 0, wins: 0, losses: 0, points: 0 };
    const newStats = {
      total: (prev.total || 0) + 1,
      wins: (prev.wins || 0) + (result === 'win' ? 1 : 0),
      losses: (prev.losses || 0) + (result === 'lose' ? 1 : 0),
      points: Math.max(0, (prev.points || 0) + ptsChange),
    };

    const { error: updateErr } = await supabase
      .from('nguoi_dung')
      .update({ thong_ke_dau: newStats })
      .eq('id', req.userId);

    if (updateErr) throw updateErr;

    await supabase.from('lich_su_dau').insert([{
      nguoi_dung_id: req.userId,
      phong_dau_id: phong_dau_id || null,
      ten_doi_thu: opponent_name || 'Đối thủ ẩn danh',
      ket_qua: result,
      diem: score || 0,
      diem_thay_doi: ptsChange,
    }]);

    if (phong_dau_id) {
      await supabase.from('phong_dau').update({ status: 'finished' }).eq('id', phong_dau_id);
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
    const { data: nguoi_dung, error } = await supabase
      .from('nguoi_dung')
      .select('id, username, thong_ke_dau, avatar_seed, so_ngay_chuoi, cap_do')
      .not('thong_ke_dau', 'is', null)
      .order('thong_ke_dau->>points', { ascending: false })
      .limit(10);

    if (error) throw error;

    const leaderboard = (nguoi_dung || [])
      .filter((user) => (user.thong_ke_dau?.points || 0) > 0)
      .map((user, index) => ({
        rank: index + 1,
        name: user.username,
        points: user.thong_ke_dau?.points || 0,
        wins: user.thong_ke_dau?.wins || 0,
        total: user.thong_ke_dau?.total || 0,
        avatarSeed: user.avatar_seed || user.username,
        streakCount: user.so_ngay_chuoi || 0,
        level: user.cap_do || 1,
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
      .from('lich_su_dau')
      .select('*')
      .eq('nguoi_dung_id', req.userId)
      .order('dau_luc', { ascending: false })
      .limit(5);

    if (error) throw error;
    const formattedBattles = (battles || []).map((battle) => {
      const normalizedBattle = normalizeBattleRow(battle);
      return {
        ...normalizedBattle,
        diem_thay_doi: normalizedBattle.points_delta ?? 0,
      };
    });
    res.json({ success: true, battles: formattedBattles });
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
      .from('nguoi_dung')
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
    const { phong_dau_id } = req.body || {};
    if (!phong_dau_id) return res.status(400).json({ success: false, message: 'Thiếu mã phòng' });

    let { data: result, error } = await supabase.rpc('leave_arena_room', {
      p_room_id: phong_dau_id,
      p_user_id: req.userId,
    });

    if (error && isMissingRpcError(error)) {
      result = await leaveRoomMembership(phong_dau_id, req.userId);
      error = null;
    }

    if (error) throw error;
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Lỗi rời phòng:', error);
    res.status(error?.code === 'PGRST116' ? 404 : 500).json({ success: false, message: error.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('phong_dau')
      .select(`
        *,
        nguoi_dung:chu_phong_id (username, avatar_seed, so_ngay_chuoi, cap_do)
      `)
      .eq('status', 'waiting')
      .eq('la_luyen_tap', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (rooms || []).map((room) => ({
      ...normalizeRoomRow(room),
      host_name: room.nguoi_dung?.username || 'Ẩn danh',
      host_avatar: {
        seed: room.nguoi_dung?.avatar_seed || room.nguoi_dung?.username || 'Aurum',
        streakCount: room.nguoi_dung?.so_ngay_chuoi || 0,
        level: room.nguoi_dung?.cap_do || 1,
      },
    }));

    res.json({ success: true, rooms: formatted });
  } catch (error) {
    console.error('Lỗi lấy danh sách phòng:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

