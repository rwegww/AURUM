import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const sessionId = 'session-1';

const users = {
  student: { id: 'student', username: 'student', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  outsider: { id: 'outsider', username: 'outsider', role: 'student', currentSessionId: sessionId, xp: 0, level: 1 },
  teacher: { id: 'teacher', username: 'teacher', role: 'teacher', currentSessionId: sessionId, xp: 0, level: 1 },
  otherTeacher: { id: 'otherTeacher', username: 'otherTeacher', role: 'teacher', currentSessionId: sessionId, xp: 0, level: 1 },
  admin: { id: 'admin', username: 'admin', role: 'admin', currentSessionId: sessionId, xp: 0, level: 1 },
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
  updateAttempted: false,
};

const matchFilter = (ctx, column) => ctx.filters.find((filter) => filter.column === column)?.value;

const resolveSingle = async (ctx) => {
  if (ctx.table === 'class_posts' && ctx.action === 'select') {
    return supabaseState.post ? { data: supabaseState.post, error: null } : { data: null, error: { message: 'not found' } };
  }

  if (ctx.table === 'class_assignment_submissions' && ctx.action === 'upsert') {
    return { data: supabaseState.upsertedSubmission, error: null };
  }

  if (ctx.table === 'class_assignment_submissions' && ctx.action === 'update') {
    supabaseState.updateAttempted = true;
    return { data: supabaseState.updatedSubmission, error: null };
  }

  return { data: null, error: null };
};

const resolveMaybeSingle = async (ctx) => {
  if (ctx.table === 'classes') {
    return supabaseState.classData ? { data: supabaseState.classData, error: null } : { data: null, error: null };
  }

  if (ctx.table === 'class_members') {
    const studentId = matchFilter(ctx, 'student_id');
    const classId = matchFilter(ctx, 'class_id');
    const membership = supabaseState.membership && supabaseState.membership.student_id === studentId && supabaseState.membership.class_id === classId
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
vi.mock('../api/models/Feedback.js', () => ({ default: feedbackModel }));
vi.mock('../api/models/Discussion.js', () => ({ Discussion: discussionModel, Note: noteModel }));
vi.mock('../api/lib/supabase.js', () => ({ supabase }));
vi.mock('../api/lib/mailer.js', () => ({
  sendTeacherApprovalEmail: vi.fn(),
  sendTeacherRejectionEmail: vi.fn(),
}));

const { default: app } = await import('../api/index.js');

const tokenFor = (id) => jwt.sign({ id, role: users[id].role, sessionId }, process.env.JWT_SECRET);

beforeEach(() => {
  vi.clearAllMocks();
  supabaseState.classData = null;
  supabaseState.membership = null;
  supabaseState.post = null;
  supabaseState.upsertedSubmission = null;
  supabaseState.updatedSubmission = null;
  supabaseState.lastUpsertPayload = null;
  supabaseState.updateAttempted = false;
});

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

  it('blocks non-members from class members', async () => {
    supabaseState.classData = { id: 'class-1', teacher_id: 'teacher' };

    const res = await request(app)
      .get('/api/classes/class-1/members')
      .set('Authorization', `Bearer ${tokenFor('outsider')}`);

    expect(res.status).toBe(403);
  });

  it('ignores student-submitted score and always stores submitted status', async () => {
    supabaseState.post = { id: 'post-1', class_id: 'class-1', type: 'assignment', target_student_id: null };
    supabaseState.membership = { class_id: 'class-1', student_id: 'student' };
    supabaseState.upsertedSubmission = { post_id: 'post-1', student_id: 'student', status: 'submitted', score: null, answers: ['A'] };

    const res = await request(app)
      .post('/api/classes/assignments/post-1/submit')
      .set('Authorization', `Bearer ${tokenFor('student')}`)
      .send({ answers: ['A'], score: 100, status: 'graded' });

    expect(res.status).toBe(200);
    expect(supabaseState.lastUpsertPayload[0]).toMatchObject({
      status: 'submitted',
      score: null,
      feedback: null,
      answers: ['A'],
    });
  });

  it('blocks teachers who do not own the class from grading', async () => {
    supabaseState.post = { id: 'post-1', class_id: 'class-1', type: 'assignment' };
    supabaseState.classData = { id: 'class-1', teacher_id: 'teacher' };

    const res = await request(app)
      .post('/api/classes/assignments/post-1/grade/student')
      .set('Authorization', `Bearer ${tokenFor('otherTeacher')}`)
      .send({ score: 100, feedback: 'done' });

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
