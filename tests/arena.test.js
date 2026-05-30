import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.SUPABASE_JWT_SECRET = 'realtime-secret';

const sessionId = 'session-1';

const users = {
  student: { id: 'student', username: 'Student', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  opponent: { id: 'opponent', username: 'Opponent', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
};

const userModel = {
  findById: vi.fn(async (id) => users[id] || null),
  findOne: vi.fn(async () => null),
  create: vi.fn(async (data) => ({ id: 'new-user', ...data, xp: 0, level: 1 })),
  update: vi.fn(async (id, data) => ({ ...users[id], ...data })),
  countStudents: vi.fn(async () => 0),
  aggregateStats: vi.fn(async () => ({ totalXP: 0, avgLevel: 1, levelDistribution: {}, gradeDistribution: {}, topXP: [], topStreak: [] })),
};

const lessonModel = {
  countAll: vi.fn(async () => 0),
  findById: vi.fn(async (id) => ({ id, lessonId: id })),
};

const feedbackModel = {
  countUnread: vi.fn(async () => 0),
  getTypeDistribution: vi.fn(async () => ({})),
};

const discussionModel = {
  getByLesson: vi.fn(async () => []),
  create: vi.fn(),
  like: vi.fn(),
};

const noteModel = {
  get: vi.fn(async () => ({ content: '' })),
  save: vi.fn(),
};

const questions = {
  calculation: {
    id: 'q-calc',
    grade_level: 8,
    difficulty: 'easy',
    game_type: 'calculation',
    question: '9 gam H2O bằng bao nhiêu mol?',
    payload: { target: { label: 'n', unit: 'mol' } },
    answer: { value: 0.5, tolerance: 0.01 },
    points: 100,
    time_limit_seconds: 45,
    explanation: 'n = 9 / 18 = 0,5 mol',
    is_active: true,
  },
  balancing: {
    id: 'q-bal',
    grade_level: 8,
    difficulty: 'easy',
    game_type: 'balancing',
    question: 'Cân bằng H2 + O2 -> H2O',
    payload: { equation: { reactants: ['H2', 'O2'], products: ['H2O'] } },
    answer: { coefficients: [2, 1, 2] },
    points: 100,
    time_limit_seconds: 45,
    explanation: '2H2 + O2 -> 2H2O',
    is_active: true,
  },
  atom_match: {
    id: 'q-atom',
    grade_level: 8,
    difficulty: 'easy',
    game_type: 'atom_match',
    question: 'Ghép H2O',
    payload: { slots: [{ id: 'center' }, { id: 'left' }, { id: 'right' }] },
    answer: { placements: { center: 'O', left: 'H', right: 'H' } },
    points: 100,
    time_limit_seconds: 45,
    explanation: 'O ở trung tâm',
    is_active: true,
  },
  electron_match: {
    id: 'q-electron',
    grade_level: 8,
    difficulty: 'easy',
    game_type: 'electron_match',
    question: 'Electron của O',
    payload: { symbol: 'O', atomicNumber: 8, shellLabels: ['K', 'L'] },
    answer: { shells: [2, 6] },
    points: 100,
    time_limit_seconds: 45,
    explanation: 'O: 2,6',
    is_active: true,
  },
  legacy_default_calculation: {
    id: 'q-legacy',
    grade_level: 8,
    difficulty: 'easy',
    game_type: 'calculation',
    question: 'Ký hiệu hóa học của Oxi là gì?',
    payload: {},
    answer: {},
    points: 10,
    time_limit_seconds: 45,
    explanation: null,
    is_active: true,
  },
};

const arenaState = {
  room: null,
  players: [],
  answers: [],
  insertedAnswers: [],
  history: [],
};

const tokenFor = (id) => jwt.sign({ id, role: users[id].role, sessionId }, process.env.JWT_SECRET);

const matchFilter = (ctx, column) => ctx.filters.find((filter) => filter.column === column)?.value;

const matchesFilters = (row, ctx) => ctx.filters.every((filter) => {
  if (filter.op === 'neq') return row[filter.column] !== filter.value;
  return row[filter.column] === filter.value;
});

const listFor = (ctx) => {
  if (ctx.table === 'arena_questions') {
    return Object.values(questions).filter((question) => matchesFilters(question, ctx));
  }
  if (ctx.table === 'arena_rooms') {
    return arenaState.room && matchesFilters(arenaState.room, ctx) ? [arenaState.room] : [];
  }
  if (ctx.table === 'arena_room_players') {
    return arenaState.players.filter((player) => matchesFilters(player, ctx));
  }
  if (ctx.table === 'arena_round_answers') {
    return arenaState.answers.filter((answer) => matchesFilters(answer, ctx));
  }
  if (ctx.table === 'users') {
    const id = matchFilter(ctx, 'id');
    return id && users[id] ? [{ id, arena_stats: { total: 0, wins: 0, losses: 0, points: 0 } }] : [];
  }
  return [];
};

const applyWrite = (ctx) => {
  if (ctx.table === 'arena_round_answers' && ctx.action === 'insert') {
    const rows = Array.isArray(ctx.payload) ? ctx.payload : [ctx.payload];
    const inserted = rows.map((row, index) => ({ id: `answer-${arenaState.answers.length + index + 1}`, ...row }));
    arenaState.answers.push(...inserted);
    arenaState.insertedAnswers.push(...inserted);
    return inserted;
  }

  if (ctx.table === 'arena_rooms' && ctx.action === 'update') {
    arenaState.room = { ...arenaState.room, ...ctx.payload };
    return [arenaState.room];
  }

  if (ctx.table === 'arena_room_players' && ctx.action === 'update') {
    arenaState.players = arenaState.players.map((player) => (
      matchesFilters(player, ctx) ? { ...player, ...ctx.payload } : player
    ));
    return arenaState.players.filter((player) => matchesFilters(player, ctx));
  }

  if (ctx.table === 'arena_room_players' && ctx.action === 'upsert') {
    const row = ctx.payload;
    const index = arenaState.players.findIndex((player) => player.room_id === row.room_id && player.user_id === row.user_id);
    if (index >= 0) arenaState.players[index] = { ...arenaState.players[index], ...row };
    else arenaState.players.push(row);
    return [row];
  }

  if (ctx.table === 'arena_match_history' && ctx.action === 'insert') {
    const rows = Array.isArray(ctx.payload) ? ctx.payload : [ctx.payload];
    arenaState.history.push(...rows);
    return rows;
  }

  return listFor(ctx);
};

const resolveList = async (ctx) => {
  const data = ['insert', 'update', 'upsert', 'delete'].includes(ctx.action)
    ? applyWrite(ctx)
    : listFor(ctx);
  return { data, error: null };
};

const resolveSingle = async (ctx) => {
  const { data } = await resolveList(ctx);
  return data?.[0]
    ? { data: data[0], error: null }
    : { data: null, error: { code: 'PGRST116', message: 'not found' } };
};

const resolveMaybeSingle = async (ctx) => {
  const { data } = await resolveList(ctx);
  return { data: data?.[0] || null, error: null };
};

const createQueryBuilder = (table) => {
  const ctx = { table, action: null, filters: [], payload: null };
  const builder = {
    select: vi.fn(() => {
      ctx.action ||= 'select';
      return builder;
    }),
    insert: vi.fn((payload) => {
      ctx.action = 'insert';
      ctx.payload = payload;
      return builder;
    }),
    update: vi.fn((payload) => {
      ctx.action = 'update';
      ctx.payload = payload;
      return builder;
    }),
    upsert: vi.fn((payload) => {
      ctx.action = 'upsert';
      ctx.payload = payload;
      return builder;
    }),
    delete: vi.fn(() => {
      ctx.action = 'delete';
      return builder;
    }),
    eq: vi.fn((column, value) => {
      ctx.filters.push({ column, value, op: 'eq' });
      return builder;
    }),
    neq: vi.fn((column, value) => {
      ctx.filters.push({ column, value, op: 'neq' });
      return builder;
    }),
    in: vi.fn(() => builder),
    or: vi.fn(() => builder),
    not: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(() => resolveSingle(ctx)),
    maybeSingle: vi.fn(() => resolveMaybeSingle(ctx)),
    then: (resolve, reject) => resolveList(ctx).then(resolve, reject),
  };
  return builder;
};

const supabase = {
  from: vi.fn((table) => createQueryBuilder(table)),
  auth: { getUser: vi.fn() },
  rpc: vi.fn(async () => ({ data: arenaState.room, error: null })),
};

vi.mock('../api/models/User.js', () => ({ default: userModel }));
vi.mock('../api/models/Lesson.js', () => ({ default: lessonModel }));
vi.mock('../api/models/Feedback.js', () => ({ default: feedbackModel }));
vi.mock('../api/models/Discussion.js', () => ({ Discussion: discussionModel, Note: noteModel }));
vi.mock('../api/models/Mission.js', () => ({ default: { updateProgress: vi.fn() } }));
vi.mock('../api/lib/supabase.js', () => ({ supabase }));
vi.mock('../api/lib/mailer.js', () => ({
  sendTeacherApprovalEmail: vi.fn(),
  sendTeacherRejectionEmail: vi.fn(),
}));

const { default: app } = await import('../api/index.js');

const resetArenaState = (question = questions.calculation) => {
  arenaState.room = {
    id: 'room-1',
    name: 'Arena test',
    host_id: 'student',
    mode: 'solo',
    difficulty: 'auto',
    status: 'playing',
    max_players: 2,
    current_players: 2,
    question_ids: [question.id],
    current_round_index: 0,
    round_started_at: new Date(Date.now() - 1000).toISOString(),
    round_ends_at: new Date(Date.now() + 45000).toISOString(),
    started_at: new Date().toISOString(),
    finished_at: null,
    winner_user_id: null,
    is_practice: true,
  };
  arenaState.players = [
    { room_id: 'room-1', user_id: 'student', username: 'Student', avatar_seed: 'Student', score: 0, correct_count: 0, answered_rounds: [], status: 'playing' },
    { room_id: 'room-1', user_id: 'opponent', username: 'Opponent', avatar_seed: 'Opponent', score: 0, correct_count: 0, answered_rounds: [], status: 'playing' },
  ];
  arenaState.answers = [];
  arenaState.insertedAnswers = [];
  arenaState.history = [];
};

beforeEach(() => {
  vi.clearAllMocks();
  resetArenaState();
});

describe('arena mini game backend', () => {
  it('issues a short lived Supabase Realtime compatible token', async () => {
    const res = await request(app)
      .get('/api/arena/realtime-token')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(res.status).toBe(200);
    const decoded = jwt.verify(res.body.token, process.env.SUPABASE_JWT_SECRET);
    expect(decoded.sub).toBe('student');
    expect(decoded.role).toBe('authenticated');
    expect(decoded.aud).toBe('authenticated');
  });

  it('returns room state without leaking the answer', async () => {
    const res = await request(app)
      .get('/api/arena/room/room-1/state')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(res.status).toBe(200);
    expect(res.body.state.currentQuestion).toMatchObject({
      id: 'q-calc',
      gameType: 'calculation',
      question: questions.calculation.question,
    });
    expect(res.body.state.currentQuestion.answer).toBeUndefined();
  });

  it('filters legacy multiple-choice rows that were defaulted to calculation without mini game payload', async () => {
    const res = await request(app)
      .get('/api/arena/questions/auto');

    expect(res.status).toBe(200);
    expect(res.body.questions.map((question) => question.id)).not.toContain('q-legacy');
    expect(res.body.questions.every((question) => question.payload && Object.keys(question.payload).length > 0)).toBe(true);
  });

  it('starts a practice room and still hides answers in state', async () => {
    resetArenaState(questions.calculation);
    arenaState.room.status = 'waiting';
    arenaState.room.current_players = 1;
    arenaState.room.max_players = 1;
    arenaState.room.question_ids = [];
    arenaState.players = [arenaState.players[0]];

    const res = await request(app)
      .post('/api/arena/room/room-1/start')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.state.room.status).toBe('playing');
    expect(res.body.state.currentQuestion.answer).toBeUndefined();
    expect(arenaState.room.question_ids.length).toBeGreaterThan(0);
  });

  it.each([
    ['calculation', questions.calculation, { gameType: 'calculation', value: 0.5 }],
    ['balancing', questions.balancing, { gameType: 'balancing', value: [2, 1, 2] }],
    ['atom_match', questions.atom_match, { gameType: 'atom_match', value: { center: 'O', left: 'H', right: 'H' } }],
    ['electron_match', questions.electron_match, { gameType: 'electron_match', value: [2, 6] }],
  ])('scores a correct %s mini game answer on the backend', async (_type, question, payload) => {
    resetArenaState(question);

    const res = await request(app)
      .post('/api/arena/room/room-1/answer')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.isCorrect).toBe(true);
    expect(res.body.scoreAwarded).toBeGreaterThan(0);
    expect(arenaState.insertedAnswers[0]).toMatchObject({
      question_id: question.id,
      user_id: 'student',
      is_correct: true,
    });
    expect(res.body.state.currentQuestion.answer).toBeUndefined();
  });

  it('rejects duplicate submits for the same round', async () => {
    resetArenaState(questions.calculation);
    const authHeader = `Bearer ${tokenFor('student')}`;

    const first = await request(app)
      .post('/api/arena/room/room-1/answer')
      .set('Authorization', authHeader)
      .send({ gameType: 'calculation', value: 0.5 });

    const second = await request(app)
      .post('/api/arena/room/room-1/answer')
      .set('Authorization', authHeader)
      .send({ gameType: 'calculation', value: 0.5 });

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);
  });

  it('blocks advancing while the round still has time and unanswered players', async () => {
    resetArenaState(questions.calculation);

    const res = await request(app)
      .post('/api/arena/room/room-1/advance')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Ch');
  });
});
