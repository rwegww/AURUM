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
  comparePassword: vi.fn(async () => false),
  toggleLock: vi.fn(),
};

const lessonModel = {
  countAll: vi.fn(async () => 0),
  findById: vi.fn(async (id) => ({ id, lessonId: id })),
  update: vi.fn(async (id, lesson) => ({ ...lesson, id, lessonId: id })),
};

const phan_hoiModel = {
  countUnread: vi.fn(async () => 0),
  getTypeDistribution: vi.fn(async () => ({})),
  findAll: vi.fn(async () => []),
  findById: vi.fn(async () => null),
  create: vi.fn(async (data) => ({ id: 'feedback-1', ...data })),
  updateStatus: vi.fn(),
  approve: vi.fn(),
  findPendingTeacherRegistration: vi.fn(async () => null),
};

const approvalModel = {
  list: vi.fn(async () => []),
  createOrApprove: vi.fn(async ({ actionKey, actionLabel, payload, adminUser }) => ({
    request: {
      id: '11111111-1111-4111-8111-111111111111',
      status: 'pending',
      actionKey,
      actionLabel,
      payload,
      requestedBy: adminUser.id,
      approverIds: [adminUser.id],
      currentApprovals: 1,
      requiredApprovals: 2,
      createdAt: new Date().toISOString(),
    },
    readyToExecute: false,
    alreadyApproved: false,
  })),
  addApproval: vi.fn(),
  claimExecution: vi.fn(),
  markExecuted: vi.fn(),
  markFailed: vi.fn(),
  reject: vi.fn(),
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
  materialData: null,
  deleteAttempted: false,
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

  if (ctx.table === 'bai_nop' && ctx.action === 'insert') {
    return { data: supabaseState.upsertedSubmission, error: null };
  }

  if (ctx.table === 'bai_nop' && ctx.action === 'update') {
    supabaseState.updateAttempted = true;
    return { data: supabaseState.updatedSubmission, error: null };
  }

  return { data: null, error: null };
};

const resolveMaybeSingle = async (ctx) => {
  if (ctx.table === 'hoc_lieu') {
    const materialId = matchFilter(ctx, 'id');
    const creatorId = matchFilter(ctx, 'nguoi_tao_id');
    const matches = supabaseState.materialData
      && supabaseState.materialData.id === materialId
      && (!creatorId || supabaseState.materialData.nguoi_tao_id === creatorId);
    if (ctx.action === 'delete') supabaseState.deleteAttempted = true;
    return { data: matches ? supabaseState.materialData : null, error: null };
  }

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
vi.mock('../api/models/AdminApproval.js', () => ({ default: approvalModel }));
vi.mock('../api/models/Discussion.js', () => ({ Discussion: discussionModel, Note: noteModel }));
vi.mock('../api/lib/supabase.js', () => ({ supabase }));
vi.mock('../api/lib/mailer.js', () => ({
  sendTeacherApprovalEmail: vi.fn(),
  sendTeacherRejectionEmail: vi.fn(),
}));

const { default: app } = await import('../api/index.js');
const { authenticateToken } = await import('../api/_middleware/auth.js');

const tokenFor = (id) => jwt.sign({ id, role: nguoi_dung[id].role, sessionId }, process.env.JWT_SECRET);

beforeEach(() => {
  vi.clearAllMocks();
  supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
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
  supabaseState.materialData = null;
  supabaseState.deleteAttempted = false;
  userModel.findById.mockImplementation(async (id) => nguoi_dung[id] || null);
  userModel.findOne.mockResolvedValue(null);
  userModel.comparePassword.mockResolvedValue(false);
  phan_hoiModel.findAll.mockResolvedValue([]);
  phan_hoiModel.findById.mockResolvedValue(null);
  phan_hoiModel.findPendingTeacherRegistration.mockResolvedValue(null);
});

const validMaterialPayload = {
  title: 'Phiếu luyện tập cân bằng phương trình',
  description: 'Bài luyện tập ngắn cho học sinh.',
  category: 'PHT HÓA 9',
  file_url: 'https://example.com/material.pdf',
  file_type: 'pdf',
};

const createMinimalPdf = (lines) => {
  const escapedLines = lines.map((line) => line.replace(/([\\()])/g, '\\$1'));
  const stream = [
    'BT /F1 12 Tf 72 720 Td',
    ...escapedLines.flatMap((line, index) => [
      ...(index === 0 ? [] : ['0 -20 Td']),
      `(${line}) Tj`,
    ]),
    'ET',
  ].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf);
};

describe('security acceptance matrix', () => {
  it('blocks the legacy shared OAuth password even on existing accounts', async () => {
    userModel.findOne.mockResolvedValue(nguoi_dung.student);
    userModel.comparePassword.mockResolvedValue(true);
    const res = await request(app).post('/api/auth/login').send({
      username: 'student', password: 'supabase_oauth_no_password',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_CREDENTIALS');
    expect(userModel.comparePassword).not.toHaveBeenCalled();
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('creates OAuth accounts with different unpredictable password placeholders', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: {
      id: 'new-oauth-user', email: 'oauth@example.com', email_confirmed_at: '2026-09-01',
    } }, error: null });
    await authenticateToken('oauth-fixture-token');
    await authenticateToken('oauth-fixture-token');
    const passwords = userModel.create.mock.calls.map(([input]) => input.password);
    expect(passwords).toHaveLength(2);
    expect(passwords[0]).toMatch(/^[A-Za-z0-9_-]{64}$/);
    expect(passwords[1]).not.toBe(passwords[0]);
  });

  it('does not automatically link an OAuth email to an administrator', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: {
      id: 'new-oauth-user', email: 'admin@example.com', email_confirmed_at: '2026-09-01',
    } }, error: null });
    userModel.findOne.mockImplementation(async (filter) => filter.email ? nguoi_dung.admin : null);
    await expect(authenticateToken('oauth-fixture-token')).rejects.toMatchObject({
      code: 'PRIVILEGED_ACCOUNT_LINK_REQUIRED', status: 403,
    });
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('prefers an explicitly linked teacher account for Supabase OAuth sessions', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: {
      id: 'oauth-shadow-user', email: 'teacher@gmail.com', email_confirmed_at: '2026-09-01',
    } }, error: null });
    userModel.findOne.mockImplementation(async (filter) => (filter.googleId ? nguoi_dung.teacher : null));
    userModel.findById.mockImplementation(async (id) => (id === 'oauth-shadow-user'
      ? { ...nguoi_dung.student, id: 'oauth-shadow-user' }
      : nguoi_dung[id] || null));

    const { user } = await authenticateToken('oauth-fixture-token');

    expect(user.id).toBe('teacher');
    expect(user.role).toBe('teacher');
  });

  it('normalizes teacher role casing before class permission checks', async () => {
    const roleVariantUser = {
      ...nguoi_dung.teacher,
      id: 'teacherRoleVariant',
      role: ' Teacher ',
    };
    userModel.findById.mockImplementation(async (id) => (id === roleVariantUser.id ? roleVariantUser : nguoi_dung[id] || null));
    const token = jwt.sign({ id: roleVariantUser.id, role: roleVariantUser.role, sessionId }, process.env.JWT_SECRET);

    const res = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '8A1', khoi_id: 8, description: 'Luyen tap on thi' });

    expect(res.status).toBe(201);
    expect(supabaseState.lastInsertPayload[0]).toMatchObject({
      ten: '8A1',
      khoi_id: 8,
      mo_ta: 'Luyen tap on thi',
      giao_vien_id: 'teacherRoleVariant',
    });
  });

  it('rejects public admin registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'root', password: 'secret123', email: 'root@example.com', role: 'admin' });

    expect(res.status).toBe(403);
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('rejects a non-string teacher proof URL without leaking an internal error', async () => {
    const res = await request(app)
      .post('/api/auth/register-teacher')
      .send({
        username: 'teacher-candidate',
        password: 'secure-password',
        email: 'candidate@example.com',
        proofImageUrl: { url: 'https://example.com/proof.png' },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_PROOF_URL');
    expect(phan_hoiModel.create).not.toHaveBeenCalled();
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

  it('does not allow teachers to request an admin media upload signature', async () => {
    const res = await request(app)
      .post('/api/admin/media/signature')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send({ folder: 'chemistry-odyssey/admin' });

    expect(res.status).toBe(403);
  });

  it('restricts signed admin uploads to the admin media folder', async () => {
    const res = await request(app)
      .post('/api/admin/media/signature')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ folder: 'chemistry-odyssey/teacher-proofs' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_UPLOAD_FOLDER');
  });

  it('blocks a locked account from creating a new password session', async () => {
    userModel.findOne.mockResolvedValueOnce({
      ...nguoi_dung.student,
      password: '$2b$10$test',
      isLocked: true,
    });
    userModel.comparePassword.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'student', password: 'correct-password' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('ACCOUNT_LOCKED');
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('rejects string values for the admin account lock flag', async () => {
    const res = await request(app)
      .patch('/api/admin/users/student/lock')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ isLocked: 'false' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(approvalModel.createOrApprove).not.toHaveBeenCalled();
  });

  it('never allows an admin account to be locked', async () => {
    const res = await request(app)
      .patch('/api/admin/users/admin/lock')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ isLocked: true });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('ADMIN_LOCK_FORBIDDEN');
    expect(approvalModel.createOrApprove).not.toHaveBeenCalled();
  });

  it('redacts password and session fields from admin user details', async () => {
    userModel.findById.mockImplementation(async (id) => {
      if (id === 'student') {
        return {
          ...nguoi_dung.student,
          email: 'student@example.com',
          password: '$2b$10$sensitive',
          password_hash: '$2b$10$sensitive',
          currentSessionId: 'private-session',
        };
      }
      return nguoi_dung[id] || null;
    });

    const res = await request(app)
      .get('/api/admin/users/student')
      .set('Authorization', `Bearer ${tokenFor('admin')}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('student@example.com');
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('password_hash');
    expect(res.body).not.toHaveProperty('currentSessionId');
  });

  it('redacts teacher password hashes from the admin feedback list', async () => {
    const sensitiveMessage = JSON.stringify({
      email: 'teacher@example.com',
      hashedPassword: '$2b$10$super-sensitive-hash',
    });
    phan_hoiModel.findAll.mockResolvedValueOnce([{
      id: '22222222-2222-4222-8222-222222222222',
      username: 'teacher-candidate',
      type: 'teacher_registration',
      status: 'unread',
      message: sensitiveMessage,
      noi_dung: sensitiveMessage,
      createdAt: '2026-09-04T09:00:00.000Z',
    }]);

    const res = await request(app)
      .get('/api/admin/feedback?limit=50')
      .set('Authorization', `Bearer ${tokenFor('admin')}`);

    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).not.toContain('super-sensitive-hash');
    expect(res.body[0]).not.toHaveProperty('noi_dung');
    expect(JSON.parse(res.body[0].message)).toEqual({ email: 'teacher@example.com' });
  });

  it('accepts grouped journey quizzes without corrupting them into an array', async () => {
    const quizzes = {
      level1: [{ question: 'Câu 1', options: ['A', 'B'], answer: 0 }],
      level2: [],
      level3: [],
    };

    const res = await request(app)
      .post('/api/admin/lessons')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ lessonId: 'hoa8_bai1', title: 'Bài 1', gradeLevelId: 8, quizzes });

    expect(res.status).toBe(202);
    expect(approvalModel.createOrApprove).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ lesson: expect.objectContaining({ quizzes }) }),
    }));
  });

  it('preserves the latest lesson content when approving an order-only change', async () => {
    const approvalId = '11111111-1111-4111-8111-111111111111';
    const currentLesson = {
      lessonId: 'hoa8_bai1', title: 'Tiêu đề mới', gradeLevelId: 8, order: 1,
      quizzes: { level1: [{ question: 'Mới cập nhật', options: ['A', 'B'], answer: 1 }] },
      theoryModules: [{ type: 'markdown', content: { text: 'Nội dung mới nhất' } }],
      isPremium: true,
    };
    lessonModel.findById.mockResolvedValueOnce(currentLesson);
    approvalModel.addApproval.mockResolvedValueOnce({ readyToExecute: true, request: { id: approvalId } });
    approvalModel.claimExecution.mockResolvedValueOnce({
      id: approvalId, actionKey: 'lesson.update', payload: { id: 'hoa8_bai1', lesson: { order: 2 } },
    });
    approvalModel.markExecuted.mockResolvedValueOnce({ id: approvalId, status: 'executed' });

    const res = await request(app)
      .post(`/api/admin/approvals/${approvalId}/approve`)
      .set('Authorization', `Bearer ${tokenFor('admin')}`);

    expect(res.status).toBe(200);
    expect(lessonModel.update).toHaveBeenCalledWith('hoa8_bai1', expect.objectContaining({
      title: 'Tiêu đề mới', order: 2, quizzes: currentLesson.quizzes,
      theoryModules: currentLesson.theoryModules, isPremium: true,
    }));
    expect(approvalModel.markFailed).not.toHaveBeenCalled();
  });

  it('validates public feedback before writing to the database', async () => {
    const res = await request(app)
      .post('/api/admin/feedback/submit')
      .send({ type: 'teacher_registration', message: 'Không được phép' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_FEEDBACK_TYPE');
    expect(phan_hoiModel.create).not.toHaveBeenCalled();
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

  it('allows a teacher to delete only their own library material', async () => {
    supabaseState.materialData = { id: 'material-1', nguoi_tao_id: 'teacher' };

    const ownerResponse = await request(app)
      .delete('/api/materials/material-1')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`);
    expect(ownerResponse.status).toBe(200);
    expect(ownerResponse.body.id).toBe('material-1');

    supabaseState.deleteAttempted = false;
    const outsiderResponse = await request(app)
      .delete('/api/materials/material-1')
      .set('Authorization', `Bearer ${tokenFor('otherTeacher')}`);
    expect(outsiderResponse.status).toBe(404);
    expect(supabaseState.deleteAttempted).toBe(true);
  });

  it('rejects invalid class data before creating an admin approval request', async () => {
    const res = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ name: '   ', khoi_id: 99, description: 'Không hợp lệ' });

    expect(res.status).toBe(400);
    expect(approvalModel.createOrApprove).not.toHaveBeenCalled();
    expect(supabaseState.lastInsertPayload).toBeNull();
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

  it('increments material downloads atomically through the database function', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 7, error: null });

    const res = await request(app).post('/api/materials/material-1/download');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ download_count: 7 });
    expect(supabase.rpc).toHaveBeenCalledWith('increment_material_download', {
      material_id: 'material-1',
    });
    expect(supabase.from).not.toHaveBeenCalledWith('hoc_lieu');
  });

  it('parses PDF exam files with the installed pdf-parse v2 API', async () => {
    const pdf = createMinimalPdf([
      'C1: Chat nao la nuoc?',
      'A. H2O',
      'B. NaCl',
      'C. CO2',
      'D. O2',
    ]);

    const res = await request(app)
      .post('/api/classes/parse-exam-file')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .attach('file', pdf, { filename: 'de-thi.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      type: 'multiple_choice',
      content: 'Chat nao la nuoc?',
      options: { A: 'H2O', B: 'NaCl', C: 'CO2', D: 'O2' },
    });
  });

  it('rejects a class post targeted to a student outside the class', async () => {
    supabaseState.classData = { id: 'class-1', giao_vien_id: 'teacher' };

    const res = await request(app)
      .post('/api/classes/class-1/posts')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send({
        type: 'announcement',
        content: 'Thông báo riêng',
        hoc_sinh_nhan_id: 'outsider',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('không thuộc lớp');
    expect(supabaseState.lastInsertPayload).toBeNull();
  });

  it('rejects a class schedule whose end time is before its start time', async () => {
    supabaseState.classData = { id: 'class-1', giao_vien_id: 'teacher' };

    const res = await request(app)
      .post('/api/classes/class-1/schedules')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send({
        title: 'Ôn tập chương 1',
        start_time: '2026-09-06T09:00:00+07:00',
        end_time: '2026-09-06T08:00:00+07:00',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('phải sau');
    expect(supabaseState.lastInsertPayload).toBeNull();
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
    expect(supabaseState.lastInsertPayload[0]).toMatchObject({
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

  it('blocks assignment submissions after the deadline', async () => {
    supabaseState.post = {
      id: 'post-1',
      lop_id: 'class-1',
      type: 'assignment',
      hoc_sinh_nhan_id: null,
      cau_hoi: [],
      han_nop: '2020-01-01T00:00:00.000Z',
    };

    const res = await request(app)
      .post('/api/classes/assignments/post-1/submit')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ answers: {} });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('hết hạn');
    expect(supabaseState.lastInsertPayload).toBeNull();
  });

  it('does not interpret a missing grade as zero', async () => {
    const res = await request(app)
      .post('/api/classes/assignments/post-1/grade/student')
      .set('Authorization', `Bearer ${tokenFor('teacher')}`)
      .send({ phan_hoi: 'Cần bổ sung lời giải.' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('nhập điểm');
    expect(supabaseState.updateAttempted).toBe(false);
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

