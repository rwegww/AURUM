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
    cau_hoi: '9 gam H2O bằng bao nhiêu mol?',
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
    cau_hoi: 'Cân bằng H2 + O2 -> H2O',
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
    cau_hoi: 'Ghép H2O',
    noi_dung_game: { slots: [{ id: 'center' }, { id: 'left' }, { id: 'right' }] },
    dap_an: { placements: { center: 'O', left: 'H', right: 'H' } },
    diem: 100,
    gioi_han_giay: 45,
    giai_thich: 'O ở trung tâm',
    dang_hoat_dong: true,
  },
  electron_match: {
    id: 'q-electron',
    khoi_id: 8,
    do_kho: 'easy',
    loai_game: 'electron_match',
    cau_hoi: 'Electron của O',
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
    cau_hoi: 'Ký hiệu hóa học của Oxi là gì?',
    noi_dung_game: {},
    dap_an: {},
    diem: 10,
    gioi_han_giay: 45,
    giai_thich: null,
    dang_hoat_dong: true,
  },
};

const arenaState = {
  rooms: new Map(),
  players: [],
  answers: [],
  insertedAnswers: [],
  history: [],
};

Object.defineProperty(arenaState, 'room', {
  get() {
    return arenaState.rooms.get('room-1') || arenaState.rooms.values().next().value || null;
  },
  set(value) {
    if (!value) {
      arenaState.rooms.clear();
      return;
    }
    arenaState.rooms.set(value.id, value);
  },
});

const tokenFor = (id) => jwt.sign({ id, role: nguoi_dung[id].role, sessionId }, process.env.JWT_SECRET);

const matchFilter = (ctx, column) => ctx.filters.find((filter) => filter.column === column)?.value;

const matchesFilters = (row, ctx) => ctx.filters.every((filter) => {
  if (filter.op === 'neq') return row[filter.column] !== filter.value;
  if (filter.op === 'in') return filter.value.includes(row[filter.column]);
  return row[filter.column] === filter.value;
});

const listFor = (ctx) => {
  if (ctx.table === 'cau_hoi_dau') {
    return Object.values(questions).filter((question) => matchesFilters(question, ctx));
  }
  if (ctx.table === 'phong_dau') {
    return [...arenaState.rooms.values()].filter((room) => matchesFilters(room, ctx));
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
    const updated = [];
    for (const [roomId, room] of arenaState.rooms) {
      if (!matchesFilters(room, ctx)) continue;
      const nextRoom = { ...room, ...ctx.payload };
      arenaState.rooms.set(roomId, nextRoom);
      updated.push(nextRoom);
    }
    return updated;
  }

  if (ctx.table === 'phong_dau' && ctx.action === 'insert') {
    const rows = Array.isArray(ctx.payload) ? ctx.payload : [ctx.payload];
    rows.forEach((room) => arenaState.rooms.set(room.id, room));
    return rows;
  }

  if (ctx.table === 'phong_dau' && ctx.action === 'delete') {
    const deleted = [...arenaState.rooms.values()].filter((room) => matchesFilters(room, ctx));
    deleted.forEach((room) => {
      arenaState.rooms.delete(room.id);
      arenaState.players = arenaState.players.filter((player) => player.phong_dau_id !== room.id);
    });
    return deleted;
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
    in: vi.fn((column, value) => {
      ctx.filters.push({ column, value, op: 'in' });
      return builder;
    }),
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
  rpc: vi.fn(async (name, args) => {
    if (name === 'create_arena_room') {
      const activeMemberships = arenaState.players.filter((player) => (
        player.nguoi_dung_id === args.p_user_id
        && ['joined', 'ready', 'playing'].includes(player.status)
      ));
      for (const membership of activeMemberships) {
        arenaState.players = arenaState.players.map((player) => (
          player === membership ? { ...player, status: 'left' } : player
        ));
        const remaining = arenaState.players.filter((player) => (
          player.phong_dau_id === membership.phong_dau_id && player.status !== 'left'
        ));
        if (remaining.length === 0) arenaState.rooms.delete(membership.phong_dau_id);
      }

      const room = {
        id: args.p_room_id,
        ten: args.p_name,
        chu_phong_id: args.p_user_id,
        che_do: args.p_mode,
        do_kho: args.p_difficulty,
        status: 'waiting',
        so_nguoi_toi_da: args.p_max_players,
        so_nguoi_hien_tai: 1,
        la_luyen_tap: args.p_is_practice,
        danh_sach_cau_hoi_id: [],
      };
      arenaState.rooms.set(room.id, room);
      arenaState.players.push({
        phong_dau_id: room.id,
        nguoi_dung_id: args.p_user_id,
        username: args.p_username,
        avatar_seed: args.p_avatar_seed,
        status: args.p_is_practice ? 'ready' : 'joined',
        score: 0,
        so_cau_dung: 0,
        vong_da_tra_loi: [],
      });
      return { data: room, error: null };
    }

    if (name === 'leave_arena_room') {
      arenaState.players = arenaState.players.map((player) => (
        player.phong_dau_id === args.p_room_id && player.nguoi_dung_id === args.p_user_id
          ? { ...player, status: 'left' }
          : player
      ));
      const remaining = arenaState.players.filter((player) => (
        player.phong_dau_id === args.p_room_id && player.status !== 'left'
      ));
      if (remaining.length === 0) arenaState.rooms.delete(args.p_room_id);
      return { data: { deleted: remaining.length === 0, current_players: remaining.length }, error: null };
    }

    if (name === 'start_arena_room') {
      const targetRoom = arenaState.rooms.get(args.p_room_id);
      if (!targetRoom || targetRoom.status === 'finished') return { data: null, error: null };
      if (targetRoom.status === 'playing') return { data: targetRoom, error: null };

      const hostId = targetRoom.chu_phong_id ?? targetRoom.host_id;
      const questionIds = targetRoom.danh_sach_cau_hoi_id ?? targetRoom.question_ids ?? [];
      const activePlayers = arenaState.players.filter((player) => (
        player.phong_dau_id === args.p_room_id
        && ['joined', 'ready', 'playing'].includes(player.status)
      ));
      const maxPlayers = targetRoom.so_nguoi_toi_da ?? targetRoom.max_players ?? 2;
      const isPractice = targetRoom.la_luyen_tap ?? targetRoom.is_practice ?? false;
      if (hostId !== args.p_user_id || questionIds.length === 0) return { data: null, error: null };
      if (!isPractice && activePlayers.length < maxPlayers) return { data: null, error: null };

      const startedRoom = {
        ...targetRoom,
        status: 'playing',
        ...(targetRoom.so_nguoi_hien_tai !== undefined
          ? { so_nguoi_hien_tai: activePlayers.length }
          : { current_players: activePlayers.length }),
        vong_hien_tai: 0,
        bat_dau_luc: args.p_started_at,
        ket_thuc_luc: null,
        nguoi_thang_id: null,
        vong_bat_dau_luc: args.p_started_at,
        vong_ket_thuc_luc: args.p_round_ends_at,
      };
      arenaState.rooms.set(args.p_room_id, startedRoom);
      arenaState.players = arenaState.players.map((player) => (
        player.phong_dau_id === args.p_room_id
        && ['joined', 'ready', 'playing'].includes(player.status)
          ? { ...player, status: 'playing' }
          : player
      ));
      return { data: startedRoom, error: null };
    }

    if (name !== 'join_arena_room') return { data: null, error: null };
    const targetRoom = arenaState.rooms.get(args.p_room_id);
    if (!targetRoom) return { data: null, error: null };
    const currentPlayers = targetRoom.so_nguoi_hien_tai ?? targetRoom.current_players ?? 0;
    const maxPlayers = targetRoom.so_nguoi_toi_da ?? targetRoom.max_players ?? 2;
    const alreadyJoined = arenaState.players.some((player) => (
      player.phong_dau_id === args.p_room_id
      && player.nguoi_dung_id === args.p_user_id
      && player.status !== 'left'
    ));
    if (!alreadyJoined && currentPlayers >= maxPlayers) {
      return { data: null, error: null };
    }
    const nextCount = alreadyJoined ? currentPlayers : currentPlayers + 1;
    const updatedRoom = {
      ...targetRoom,
      ...(targetRoom.so_nguoi_hien_tai !== undefined
        ? { so_nguoi_hien_tai: nextCount }
        : { current_players: nextCount }),
    };
    arenaState.rooms.set(args.p_room_id, updatedRoom);
    const existingIndex = arenaState.players.findIndex((player) => (
      player.phong_dau_id === args.p_room_id && player.nguoi_dung_id === args.p_user_id
    ));
    const player = {
      phong_dau_id: args.p_room_id,
      nguoi_dung_id: args.p_user_id,
      username: args.p_username,
      avatar_seed: args.p_avatar_seed,
      score: 0,
      so_cau_dung: 0,
      vong_da_tra_loi: [],
      status: 'joined',
    };
    if (existingIndex >= 0) arenaState.players[existingIndex] = { ...arenaState.players[existingIndex], ...player };
    else arenaState.players.push(player);
    return { data: updatedRoom, error: null };
  }),
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
  arenaState.rooms.clear();
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
  it('keeps both players in the same room from create through refresh and start', async () => {
    arenaState.rooms.clear();
    arenaState.players = [];
    arenaState.answers = [];
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    const created = await request(app)
      .post('/api/arena/create')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ name: 'PK regression', mode: 'solo', difficulty: 'auto', max_players: 2 });

    random.mockRestore();
    const roomId = created.body.room?.id;
    const joined = await request(app)
      .post('/api/arena/join')
      .set('Authorization', `Bearer ${tokenFor('opponent')}`)
      .send({ phong_dau_id: roomId });
    const [hostRefresh, guestRefresh, guestRecoveredRoom] = await Promise.all([
      request(app)
        .get(`/api/arena/room/${roomId}/state`)
        .set('Authorization', `Bearer ${tokenFor('student')}`),
      request(app)
        .get(`/api/arena/room/${roomId}/state`)
        .set('Authorization', `Bearer ${tokenFor('opponent')}`),
      request(app)
        .get('/api/arena/active-room')
        .set('Authorization', `Bearer ${tokenFor('opponent')}`),
    ]);

    expect(created.status).toBe(201);
    expect(joined.status).toBe(200);
    expect(joined.body.room.id).toBe(roomId);
    for (const refreshed of [hostRefresh, guestRefresh]) {
      expect(refreshed.status).toBe(200);
      expect(refreshed.body.state.room.id).toBe(roomId);
      expect(refreshed.body.state.room.current_players).toBe(2);
      expect(refreshed.body.state.players.map((player) => player.nguoi_dung_id).sort())
        .toEqual(['opponent', 'student']);
    }
    expect(guestRecoveredRoom.status).toBe(200);
    expect(guestRecoveredRoom.body.room.id).toBe(roomId);

    const started = await request(app)
      .post(`/api/arena/room/${roomId}/start`)
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({});
    const guestPlayingState = await request(app)
      .get(`/api/arena/room/${roomId}/state`)
      .set('Authorization', `Bearer ${tokenFor('opponent')}`);

    expect(started.status).toBe(200);
    expect(started.body.state.room).toMatchObject({ id: roomId, status: 'playing' });
    expect(supabase.rpc).toHaveBeenCalledWith('start_arena_room', expect.objectContaining({
      p_room_id: roomId,
      p_user_id: 'student',
    }));
    expect(guestPlayingState.status).toBe(200);
    expect(guestPlayingState.body.state.room).toMatchObject({ id: roomId, status: 'playing' });
    expect(guestPlayingState.body.state.currentQuestion.id)
      .toBe(started.body.state.currentQuestion.id);
  });

  it('joins a room atomically so the host state contains the new player', async () => {
    resetArenaState();
    arenaState.room.status = 'waiting';
    arenaState.room.current_players = 1;
    arenaState.room.la_luyen_tap = false;
    arenaState.players = [arenaState.players[0]];

    const joined = await request(app)
      .post('/api/arena/join')
      .set('Authorization', `Bearer ${tokenFor('opponent')}`)
      .send({ phong_dau_id: 'room-1' });

    const hostState = await request(app)
      .get('/api/arena/room/room-1/state')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(joined.status).toBe(200);
    expect(hostState.status).toBe(200);
    expect(hostState.body.state.players.map((player) => player.nguoi_dung_id))
      .toEqual(expect.arrayContaining(['student', 'opponent']));
    expect(hostState.body.state.room.current_players).toBe(2);
  });

  it('moves a player out of an old room before joining the requested room', async () => {
    resetArenaState();
    arenaState.room.status = 'waiting';
    arenaState.room.current_players = 1;
    arenaState.room.la_luyen_tap = false;
    arenaState.players = [arenaState.players[0]];
    arenaState.rooms.set('room-old', {
      id: 'room-old',
      name: 'Old room',
      chu_phong_id: 'opponent',
      mode: 'solo',
      status: 'waiting',
      max_players: 2,
      current_players: 1,
      la_luyen_tap: false,
    });
    arenaState.players.push({
      phong_dau_id: 'room-old',
      nguoi_dung_id: 'opponent',
      username: 'Opponent',
      status: 'joined',
    });

    const joined = await request(app)
      .post('/api/arena/join')
      .set('Authorization', `Bearer ${tokenFor('opponent')}`)
      .send({ phong_dau_id: 'room-1' });

    const hostState = await request(app)
      .get('/api/arena/room/room-1/state')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(joined.status).toBe(200);
    expect(joined.body.room.id).toBe('room-1');
    expect(arenaState.rooms.has('room-old')).toBe(false);
    expect(hostState.body.state.room.id).toBe('room-1');
    expect(hostState.body.state.players.map((player) => player.nguoi_dung_id).sort())
      .toEqual(['opponent', 'student']);
  });

  it('keeps the current room when joining a full room fails', async () => {
    resetArenaState();
    arenaState.room.status = 'waiting';
    arenaState.room.current_players = 2;
    arenaState.room.max_players = 2;
    arenaState.room.la_luyen_tap = false;
    arenaState.players = [
      arenaState.players[0],
      {
        phong_dau_id: 'room-1',
        nguoi_dung_id: 'occupant',
        username: 'Occupant',
        status: 'joined',
      },
    ];
    arenaState.rooms.set('room-old', {
      id: 'room-old',
      name: 'Old room',
      chu_phong_id: 'opponent',
      mode: 'solo',
      status: 'waiting',
      max_players: 2,
      current_players: 1,
      la_luyen_tap: false,
    });
    arenaState.players.push({
      phong_dau_id: 'room-old',
      nguoi_dung_id: 'opponent',
      username: 'Opponent',
      status: 'joined',
    });

    const joined = await request(app)
      .post('/api/arena/join')
      .set('Authorization', `Bearer ${tokenFor('opponent')}`)
      .send({ phong_dau_id: 'room-1' });

    expect(joined.status).toBe(400);
    expect(arenaState.rooms.has('room-old')).toBe(true);
    expect(arenaState.players).toContainEqual(expect.objectContaining({
      phong_dau_id: 'room-old',
      nguoi_dung_id: 'opponent',
      status: 'joined',
    }));
    expect(arenaState.players).not.toContainEqual(expect.objectContaining({
      phong_dau_id: 'room-1',
      nguoi_dung_id: 'opponent',
    }));
  });

  it('keeps only the newest room when the same user creates twice', async () => {
    const random = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1);

    const first = await request(app)
      .post('/api/arena/create')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ name: 'First', mode: 'solo', difficulty: 'auto' });
    const second = await request(app)
      .post('/api/arena/create')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ name: 'Second', mode: 'solo', difficulty: 'auto' });

    random.mockRestore();
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.room.id).not.toBe(first.body.room.id);
    expect(arenaState.rooms.has(first.body.room.id)).toBe(false);
    expect(arenaState.rooms.has(second.body.room.id)).toBe(true);
    expect(arenaState.players.filter((player) => (
      player.nguoi_dung_id === 'student' && ['joined', 'ready', 'playing'].includes(player.status)
    ))).toHaveLength(1);
  });

  it('derives room count from active player rows and rejects a stale 2/2 counter', async () => {
    resetArenaState();
    arenaState.room.status = 'waiting';
    arenaState.room.current_players = 2;
    arenaState.room.max_players = 2;
    arenaState.room.la_luyen_tap = false;
    arenaState.players = [arenaState.players[0]];

    const state = await request(app)
      .get('/api/arena/room/room-1/state')
      .set('Authorization', `Bearer ${tokenFor('student')}`);
    const started = await request(app)
      .post('/api/arena/room/room-1/start')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(state.status).toBe(200);
    expect(state.body.state.room.current_players).toBe(1);
    expect(state.body.state.players).toHaveLength(1);
    expect(started.status).toBe(400);
    expect(started.body.message).toContain('Chưa đủ người chơi');
  });

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

  it('handles concurrent host start requests idempotently', async () => {
    resetArenaState(questions.calculation);
    arenaState.room.status = 'waiting';
    arenaState.room.la_luyen_tap = false;
    arenaState.room.danh_sach_cau_hoi_id = Array(10).fill(questions.calculation.id);
    arenaState.players = arenaState.players.map((player) => ({ ...player, status: 'joined' }));

    const starts = await Promise.all([
      request(app)
        .post('/api/arena/room/room-1/start')
        .set('Authorization', `Bearer ${tokenFor('student')}`)
        .send({}),
      request(app)
        .post('/api/arena/room/room-1/start')
        .set('Authorization', `Bearer ${tokenFor('student')}`)
        .send({}),
    ]);

    for (const started of starts) {
      expect(started.status).toBe(200);
      expect(started.body.state.room).toMatchObject({ id: 'room-1', status: 'playing' });
      expect(started.body.state.currentQuestion.id).toBe(questions.calculation.id);
    }
    expect(arenaState.players.filter((player) => (
      player.phong_dau_id === 'room-1' && player.status === 'playing'
    ))).toHaveLength(2);
    expect(supabase.rpc.mock.calls.filter(([name]) => name === 'start_arena_room').length)
      .toBeGreaterThanOrEqual(1);
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


