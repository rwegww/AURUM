import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.SUPABASE_JWT_SECRET = 'realtime-secret';

const sessionId = 'session-1';

const nguoi_dung = {
  student: { id: 'student', username: 'Student', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  opponent: { id: 'opponent', username: 'Opponent', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
};

const userModel = {
  findById: vi.fn(async (id) => nguoi_dung[id] || null),
  findOne: vi.fn(async () => null),
  create: vi.fn(async (data) => ({ id: 'new-user', ...data, xp: 0, level: 1 })),
  update: vi.fn(async (id, data) => ({ ...nguoi_dung[id], ...data })),
  countStudents: vi.fn(async () => 0),
  aggregateStats: vi.fn(async () => ({ totalXP: 0, avgLevel: 1, levelDistribution: {}, gradeDistribution: {}, topXP: [], topStreak: [] })),
};

const lessonModel = {
  countAll: vi.fn(async () => 0),
  findById: vi.fn(async (id) => ({ id, lessonId: id })),
};

const phan_hoiModel = {
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
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'calculation',
    cau_hoi: '9 gam H2O báº±ng bao nhiÃªu mol?',
    noi_dung_game: { target: { label: 'n', unit: 'mol' } },
    dap_an: { value: 0.5, tolerance: 0.01 },
    diem: 100,
    gioi_han_giay: 45,
    giai_thich: 'n = 9 / 18 = 0,5 mol',
    dang_hoat_dong: true,
  },
  balancing: {
    id: 'q-bal',
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'balancing',
    cau_hoi: 'CÃ¢n báº±ng H2 + O2 -> H2O',
    noi_dung_game: { equation: { reactants: ['H2', 'O2'], products: ['H2O'] } },
    dap_an: { coefficients: [2, 1, 2] },
    diem: 100,
    gioi_han_giay: 45,
    giai_thich: '2H2 + O2 -> 2H2O',
    dang_hoat_dong: true,
  },
  atom_match: {
    id: 'q-atom',
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'atom_match',
    cau_hoi: 'GhÃ©p H2O',
    noi_dung_game: { slots: [{ id: 'center' }, { id: 'left' }, { id: 'right' }] },
    dap_an: { placements: { center: 'O', left: 'H', right: 'H' } },
    diem: 100,
    gioi_han_giay: 45,
    giai_thich: 'O á»Ÿ trung tÃ¢m',
    dang_hoat_dong: true,
  },
  electron_match: {
    id: 'q-electron',
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'electron_match',
    cau_hoi: 'Electron cá»§a O',
    noi_dung_game: { symbol: 'O', atomicNumber: 8, shellLabels: ['K', 'L'] },
    dap_an: { shells: [2, 6] },
    diem: 100,
    gioi_han_giay: 45,
    giai_thich: 'O: 2,6',
    dang_hoat_dong: true,
  },
  legacy_default_calculation: {
    id: 'q-legacy',
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'calculation',
    cau_hoi: 'KÃ½ hiá»‡u hÃ³a há»c cá»§a Oxi lÃ  gÃ¬?',
    noi_dung_game: {},
    dap_an: {},
    diem: 10,
    gioi_han_giay: 45,
    giai_thich: null,
    dang_hoat_dong: true,
  },
};

const arenaState = {
  room: null,
  players: [],
  answers: [],
  insertedAnswers: [],
  history: [],
};

const tokenFor = (id) => jwt.sign({ id, role: nguoi_dung[id].role, sessionId }, process.env.JWT_SECRET);

const matchFilter = (ctx, column) => ctx.filters.find((filter) => filter.column === column)?.value;

const matchesFilters = (row, ctx) => ctx.filters.every((filter) => {
  if (filter.op === 'neq') return row[filter.column] !== filter.value;
  return row[filter.column] === filter.value;
});

const listFor = (ctx) => {
  if (ctx.table === 'cau_hoi_dau') {
    return Object.values(questions).filter((question) => matchesFilters(question, ctx));
  }
  if (ctx.table === 'phong_dau') {
    return arenaState.room && matchesFilters(arenaState.room, ctx) ? [arenaState.room] : [];
  }
  if (ctx.table === 'nguoi_choi') {
    return arenaState.players.filter((player) => matchesFilters(player, ctx));
  }
  if (ctx.table === 'tra_loi_vong') {
    return arenaState.answers.filter((answer) => matchesFilters(answer, ctx));
  }
  if (ctx.table === 'nguoi_dung') {
    const id = matchFilter(ctx, 'id');
    return id && nguoi_dung[id] ? [{ id, thong_ke_dau: { total: 0, wins: 0, losses: 0, points: 0 } }] : [];
  }
  return [];
};

const applyWrite = (ctx) => {
  if (ctx.table === 'tra_loi_vong' && ctx.action === 'insert') {
    const rows = Array.isArray(ctx.payload) ? ctx.payload : [ctx.payload];
    const inserted = rows.map((row, index) => ({ id: `answer-${arenaState.answers.length + index + 1}`, ...row }));
    arenaState.answers.push(...inserted);
    arenaState.insertedAnswers.push(...inserted);
    return inserted;
  }

  if (ctx.table === 'phong_dau' && ctx.action === 'update') {
    arenaState.room = { ...arenaState.room, ...ctx.payload };
    return [arenaState.room];
  }

  if (ctx.table === 'nguoi_choi' && ctx.action === 'update') {
    arenaState.players = arenaState.players.map((player) => (
      matchesFilters(player, ctx) ? { ...player, ...ctx.payload } : player
    ));
    return arenaState.players.filter((player) => matchesFilters(player, ctx));
  }

  if (ctx.table === 'nguoi_choi' && ctx.action === 'upsert') {
    const row = ctx.payload;
    const index = arenaState.players.findIndex((player) => player.phong_dau_id === row.phong_dau_id && player.nguoi_dung_id === row.nguoi_dung_id);
    if (index >= 0) arenaState.players[index] = { ...arenaState.players[index], ...row };
    else arenaState.players.push(row);
    return [row];
  }

  if (ctx.table === 'lich_su_dau' && ctx.action === 'insert') {
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
vi.mock('../api/models/Feedback.js', () => ({ default: phan_hoiModel }));
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
    chu_phong_id: 'student',
    mode: 'solo',
    do_kho: 'auto',
    status: 'playing',
    max_players: 2,
    current_players: 2,
    danh_sach_cau_hoi_id: [question.id],
    vong_hien_tai: 0,
    vong_bat_dau_luc: new Date(Date.now() - 1000).toISOString(),
    vong_ket_thuc_luc: new Date(Date.now() + 45000).toISOString(),
    bat_dau_luc: new Date().toISOString(),
    ket_thuc_luc: null,
    nguoi_thang_id: null,
    la_luyen_tap: true,
  };
  arenaState.players = [
    { phong_dau_id: 'room-1', nguoi_dung_id: 'student', username: 'Student', avatar_seed: 'Student', score: 0, so_cau_dung: 0, vong_da_tra_loi: [], status: 'playing' },
    { phong_dau_id: 'room-1', nguoi_dung_id: 'opponent', username: 'Opponent', avatar_seed: 'Opponent', score: 0, so_cau_dung: 0, vong_da_tra_loi: [], status: 'playing' },
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
      question: questions.calculation.cau_hoi,
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
    arenaState.room.danh_sach_cau_hoi_id = [];
    arenaState.players = [arenaState.players[0]];

    const res = await request(app)
      .post('/api/arena/room/room-1/start')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.state.room.status).toBe('playing');
    expect(res.body.state.currentQuestion.answer).toBeUndefined();
    expect(arenaState.room.danh_sach_cau_hoi_id.length).toBeGreaterThan(0);
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
      cau_hoi_id: question.id,
      nguoi_dung_id: 'student',
      dung: true,
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


