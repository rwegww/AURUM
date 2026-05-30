export type AurumRole = 'student' | 'teacher' | 'admin';

export type Nullable<T> = T | null;

export interface AurumUser {
  id: string;
  username?: string;
  email?: string;
  role: AurumRole;
  grade?: string | number | null;
  avatar?: string | null;
  xp?: number;
  level?: number;
  streakCount?: number;
  todayOnlineMinutes?: number;
  progress?: Record<string, unknown>;
  studyPlan?: unknown;
  linkedAccounts?: unknown[];
  [key: string]: unknown;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: AurumUser;
  message?: string;
  redirecting?: boolean;
}

export interface LessonSummary {
  id?: string;
  lessonId?: string;
  title?: string;
  name?: string;
  grade?: string | number;
  classId?: string | number;
  description?: string;
  content?: unknown;
  theory?: unknown;
  modules?: unknown[];
  [key: string]: unknown;
}

export interface MaterialSummary {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  url?: string;
  downloadUrl?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ClassSummary {
  id: string;
  name?: string;
  code?: string;
  grade?: string | number;
  teacher_id?: string;
  teacherName?: string;
  [key: string]: unknown;
}

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
  sessionId?: string | null;
}

export interface TokenStore {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}
