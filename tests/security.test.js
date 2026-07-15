import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const sessionId = 'session-1';

const nguoi_dung = {
  student: { id: 'student', username: 'student', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  outsider: { id: 'outsider', username: 'outsider', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  teacher: { id: 'teacher', username: 'teacher', role: 'teacher', currentSessionId: sessionId, xp: 0, level: 1 },
  otherTeacher: { id: 'otherTeacher', username: 'otherTeacher', role: 'teacher', currentSessionId: sessionId, xp: 0, level: 1 },
  admin: { id: 'admin', username: 'admin', role: 'admin', currentSessionId: sessionId, xp: 0, level: 1 },
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
  get: vi.fn(async () => ({ content: 'private note' })),
  save: vi.fn(),
};

const supabaseState = {
  classData: null,
  membership: null,
  post: null,
  upsertedSubmission: null,
  updatedSubmission: null,
  lastUpsertPayload: null,
  insertedMaterial: null,
  lastInsertPayload: null,
  insertAttempted: false,
  updateAttempted: false,
  insertedPost: null,
};

const matchFilter = (ctx, column) => ctx.filters.find((filter) => filter.column === column)?.value;

const resolveSingle = async (ctx) => {
  if (ctx.table === 'hoc_lieu' && ctx.action === 'insert') {
    const row = Array.isArray(ctx.payload) ? ctx.payload[0] : ctx.payload;
    return { data: supabaseState.insertedMaterial || { id: 'material-1', ...row }, error: null };
  }

  if (ctx.table === 'bai_dang_lop' && ctx.action === 'select') {
    return supabaseState.post ? { data: supabaseState.post, error: null } : { data: null, error: { message: 'not found' } };
  }

  if (ctx.table === 'bai_dang_lop' && ctx.action === 'insert') {
    const row = Array.isArray(ctx.payload) ? ctx.payload[0] : ctx.payload;
    return { data: supabaseState.insertedPost || { id: 'post-1', ...row }, error: null };
  }

  if (ctx.table === 'bai_nop' && ctx.action === 'upsert') {
    return { data: supabaseState.upsertedSubmission, error: null };
  }

  if (ctx.table === 'bai_nop' && ctx.action === 'update') {
    supabaseState.updateAttempted = true;
    return { data: supabaseState.updatedSubmission, error: null };
  }

  return { data: null, error: null };
};

const resolveMaybeSingle = async (ctx) => {
  if (ctx.table === 'lop') {
    return supabaseState.classData ? { data: supabaseState.classData, error: null } : { data: null, error: null };
  }

  if (ctx.table === 'thanh_vien_lop') {
    const studentId = matchFilter(ctx, 'hoc_sinh_id');
    const classId = matchFilter(ctx, 'lop_id');
    const membership = supabaseState.membership && supabaseState.membership.hoc_sinh_id === studentId && supabaseState.membership.lop_id === classId
      ? supabaseState.membership
      : null;
    return { data: membership, error: null };
  }

  return resolveSingle(ctx);
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
      supabaseState.lastInsertPayload = payload;
      if (table === 'hoc_lieu') supabaseState.insertAttempted = true;
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
      supabaseState.lastUpsertPayload = payload;
      return builder;
    }),
    delete: vi.fn(() => {
      ctx.action = 'delete';
      return builder;
    }),
    eq: vi.fn((column, value) => {
      ctx.filters.push({ column, value });
      return builder;
    }),
    in: vi.fn(() => builder),
    or: vi.fn(() => builder),
    neq: vi.fn(() => builder),
    gt: vi.fn(() => builder),
    lt: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(() => resolveSingle(ctx)),
    maybeSingle: vi.fn(() => resolveMaybeSingle(ctx)),
  };
  return builder;
};

const supabase = {
  from: vi.fn((table) => createQueryBuilder(table)),
  auth: { getUser: vi.fn() },
  rpc: vi.fn(),
};

vi.mock('../api/models/User.js', () => ({ default: userModel }));
vi.mock('../api/models/Lesson.js', () => ({ default: lessonModel }));
vi.mock('../api/models/Feedback.js', () => ({ default: phan_hoiModel }));
vi.mock('../api/models/Discussion.js', () => ({ Discussion: discussionModel, Note: noteModel }));
vi.mock('../api/lib/supabase.js', () => ({ supabase }));
vi.mock('../api/lib/mailer.js', () => ({
  sendTeacherApprovalEmail: vi.fn(),
  sendTeacherRejectionEmail: vi.fn(),
}));

const { default: app } = await import('../api/index.js');

const tokenFor = (id) => jwt.sign({ id, role: nguoi_dung[id].role, sessionId }, process.env.JWT_SECRET);

beforeEach(() => {
  vi.clearAllMocks();
  supabaseState.classData = null;
  supabaseState.membership = null;
  supabaseState.post = null;
  supabaseState.upsertedSubmission = null;
  supabaseState.updatedSubmission = null;
  supabaseState.lastUpsertPayload = null;
  supabaseState.insertedMaterial = null;
  supabaseState.lastInsertPayload = null;
  supabaseState.insertAttempted = false;
  supabaseState.updateAttempted = false;
  supabaseState.insertedPost = null;
});

const validMaterialPayload = {
  title: 'Phiếu luyện tập cân bằng phương trình',
  description: 'Bài luyện tập ngắn cho học sinh.',
  category: 'PHT HÓA 9',
  file_url: 'https://example.com/material.pdf',
  file_type: 'pdf',
};

describe('security acceptance matrix', () => {
  it('rejects public admin registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'root', password: 'secret123', email: 'root@example.com', role: 'admin' });

    expect(res.status).toBe(403);
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('rejects profile updates for sensitive or unknown fields', async () => {
    const res = await request(app)
      .patch('/api/user/profile')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ role: 'admin', xp: 999999 });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(['role', 'xp']);
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('does not allow teachers into admin user management', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`);

    expect(res.status).toBe(403);
  });

  it('blocks students from uploading library hoc_lieu', async () => {
    const res = await request(app)
      .post('/api/materials')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send(validMaterialPayload);

    expect(res.status).toBe(403);
    expect(supabaseState.insertAttempted).toBe(false);
  });

  it('blocks admins from teacher-only library material uploads', async () => {
    const res = await request(app)
      .post('/api/materials')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send(validMaterialPayload);

    expect(res.status).toBe(403);
    expect(supabaseState.insertAttempted).toBe(false);
  });

  it('validates teacher library material uploads before insert', async () => {
    const res = await request(app)
      .post('/api/materials')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send({
        title: '',
        category: '',
        file_url: 'not-a-url',
        file_type: 'exe',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toMatchObject({
      title: expect.any(String),
      category: expect.any(String),
      file_url: expect.any(String),
      file_type: expect.any(String),
    });
    expect(supabaseState.insertAttempted).toBe(false);
  });

  it('stores teacher as creator when uploading library hoc_lieu', async () => {
    const res = await request(app)
      .post('/api/materials')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send(validMaterialPayload);

    expect(res.status).toBe(201);
    expect(supabaseState.lastInsertPayload[0]).toMatchObject({
      tieu_de: validMaterialPayload.title,
      mo_ta: validMaterialPayload.description,
      danh_muc: validMaterialPayload.category,
      file_url: validMaterialPayload.file_url,
      file_type: validMaterialPayload.file_type,
      nguoi_tao_id: 'teacher',
    });
    expect(res.body).toMatchObject({
      id: 'material-1',
      title: validMaterialPayload.title,
      created_by_user_id: 'teacher',
    });
  });


  it('blocks non-members from class members', async () => {
    supabaseState.classData = { id: 'class-1', giao_vien_id: 'teacher' };

    const res = await request(app)
      .get('/api/classes/class-1/members')
      .set('Authorization', `Bearer ${tokenFor('outsider')}`);

    expect(res.status).toBe(403);
  });

  it('returns class detail for the owning teacher', async () => {
    supabaseState.classData = {
      id: 'class-1',
      ten: 'Lop Hoa 10A1',
      ma_lop: 'ABC123',
      khoi_id: 10,
      giao_vien_id: 'teacher',
      student_count: [{ count: 3 }],
    };

    const res = await request(app)
      .get('/api/classes/class-1')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'class-1',
      name: 'Lop Hoa 10A1',
      code: 'ABC123',
      gradeLevelId: 10,
      teacher_id: 'teacher',
      student_count: 3,
    });
  });

  it('returns class detail for a joined student only', async () => {
    supabaseState.classData = {
      id: 'class-1',
      ten: 'Lop Hoa 10A1',
      ma_lop: 'ABC123',
      khoi_id: 10,
      giao_vien_id: 'teacher',
      student_count: [{ count: 3 }],
    };
    supabaseState.membership = { lop_id: 'class-1', hoc_sinh_id: 'student' };

    const allowed = await request(app)
      .get('/api/classes/class-1')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(allowed.status).toBe(200);
    expect(allowed.body.id).toBe('class-1');

    const blocked = await request(app)
      .get('/api/classes/class-1')
      .set('Authorization', `Bearer ${tokenFor('outsider')}`);

    expect(blocked.status).toBe(403);
  });

  it('allows joined students to send private messages to the class teacher', async () => {
    supabaseState.classData = { id: 'class-1', giao_vien_id: 'teacher' };
    supabaseState.membership = { lop_id: 'class-1', hoc_sinh_id: 'student' };
    supabaseState.insertedPost = {
      id: 'post-1',
      lop_id: 'class-1',
      tac_gia_id: 'student',
      type: 'announcement',
      noi_dung: 'Can thay co ho tro',
      hoc_sinh_nhan_id: 'teacher',
      cau_hoi: [],
      author: { username: 'student' },
      target: { username: 'teacher' },
    };

    const res = await request(app)
      .post('/api/classes/class-1/messages')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ content: '  Can thay co ho tro  ' });

    expect(res.status).toBe(201);
    expect(supabaseState.lastInsertPayload[0]).toMatchObject({
      lop_id: 'class-1',
      tac_gia_id: 'student',
      type: 'announcement',
      noi_dung: 'Can thay co ho tro',
      hoc_sinh_nhan_id: 'teacher',
      cau_hoi: [],
    });
    expect(res.body).toMatchObject({
      id: 'post-1',
      class_id: 'class-1',
      author_id: 'student',
      target_student_id: 'teacher',
      content: 'Can thay co ho tro',
    });
  });

  it('fails closed for production cron reminders when CRON_SECRET is missing', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousCronSecret = process.env.CRON_SECRET;
    process.env.NODE_ENV = 'production';
    delete process.env.CRON_SECRET;

    try {
      const res = await request(app).get('/api/user/cron-send-reminders');

      expect(res.status).toBe(503);
      expect(supabase.from).not.toHaveBeenCalledWith('nguoi_dung');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      if (previousCronSecret === undefined) {
        delete process.env.CRON_SECRET;
      } else {
        process.env.CRON_SECRET = previousCronSecret;
      }
    }
  });

  it('computes automatic assignment score from stored questions instead of trusting the client', async () => {
    supabaseState.post = {
      id: 'post-1',
      lop_id: 'class-1',
      type: 'assignment',
      hoc_sinh_nhan_id: null,
      cau_hoi: [
        { type: 'multiple_choice', options: { A: 'NaCl', B: 'H2O' }, correct_answer: 'A' },
      ],
    };
    supabaseState.membership = { lop_id: 'class-1', hoc_sinh_id: 'student' };
    supabaseState.upsertedSubmission = {
      bai_dang_id: 'post-1',
      hoc_sinh_id: 'student',
      status: 'graded',
      diem: 0,
      cau_tra_loi: { 0: 1 },
    };

    const res = await request(app)
      .post('/api/classes/assignments/post-1/submit')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ answers: { 0: 1 }, score: 100, status: 'graded' });

    expect(res.status).toBe(200);
    expect(supabaseState.lastUpsertPayload[0]).toMatchObject({
      status: 'graded',
      diem: 0,
      phan_hoi_giao_vien: null,
      cau_tra_loi: { 0: 1 },
    });
    expect(res.body.auto_grade).toMatchObject({
      score: 0,
      correct: 0,
      total: 1,
      needsManualReview: false,
    });
  });

  it('blocks teachers who do not own the class from grading', async () => {
    supabaseState.post = { id: 'post-1', lop_id: 'class-1', type: 'assignment' };
    supabaseState.classData = { id: 'class-1', giao_vien_id: 'teacher' };

    const res = await request(app)
      .post('/api/classes/assignments/post-1/grade/student')
      .set('Authorization', `Bearer ${tokenFor('otherTeacher')}`)
      .send({ score: 8, phan_hoi: 'done' });

    expect(res.status).toBe(403);
    expect(supabaseState.updateAttempted).toBe(false);
  });

  it('serves notes route before the lesson discussion wildcard route', async () => {
    const res = await request(app)
      .get('/api/discussions/notes/lesson-1')
      .set('Authorization', `Bearer ${tokenFor('student')}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ content: 'private note' });
    expect(noteModel.get).toHaveBeenCalledWith('student', 'lesson-1');
    expect(discussionModel.getByLesson).not.toHaveBeenCalled();
  });
});

