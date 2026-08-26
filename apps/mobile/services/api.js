import Constants from "expo-constants";
import { Platform } from "react-native";

const getExpoDevHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;
  const host = typeof hostUri === "string" ? hostUri.split(":")[0] : "";
  return host && host !== "localhost" && host !== "127.0.0.1" ? host : "";
};

const getDefaultApiUrl = () => {
  const devHost = getExpoDevHost();
  if (devHost) return `http://${devHost}:5000`;
  if (Platform.OS === "android") return "http://10.10.10.20:5000";
  return "http://127.0.0.1:5000";
};

const configuredApiUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  Constants.manifest?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  getDefaultApiUrl();

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const toQueryString = (query) => {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = "GET",
    token,
    sessionId,
    body,
    query,
    headers = {},
    auth = true
  } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const requestHeaders = {
    ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(sessionId ? { "X-Session-ID": sessionId } : {}),
    ...headers
  };

  const response = await fetch(`${API_BASE_URL}${path}${toQueryString(query)}`, {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Server returned ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
};

export const authApi = {
  forgotPassword: (email) => apiRequest('/api/auth/forgot-password', { method: 'POST', auth: false, body: { email } }),
  resetPassword: (email, otp, newPassword) => apiRequest('/api/auth/reset-password', { method: 'POST', auth: false, body: { email, otp, newPassword } }),
  logout: (token) => apiRequest('/api/auth/logout', { method: 'POST', token }),
  login: (username, password) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { username, password }
    }),

  register: ({ username, password, email, grade }) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      auth: false,
      body: { username, password, email, role: "student", grade }
    }),

  requestEmailOtp: (email) =>
    apiRequest("/api/auth/request-otp", {
      method: "POST",
      auth: false,
      body: { email }
    }),

  verifyEmailOtp: (email, otp) =>
    apiRequest("/api/auth/verify-otp", {
      method: "POST",
      auth: false,
      body: { email, otp }
    }),

  profile: (token, sessionId) =>
    apiRequest("/api/user/profile", { token, sessionId }),

  heartbeat: (token, sessionId) =>
    apiRequest("/api/user/heartbeat", {
      method: "POST",
      token,
      sessionId,
      body: {}
    }),

  updateProfile: (token, patch) =>
    apiRequest("/api/user/profile", {
      method: "PATCH",
      token,
      body: patch
    })
};

export const learningApi = {
  bai_hoc: ({ classId, programId, view = "summary" } = {}) =>
    apiRequest("/api/lessons", {
      auth: false,
      query: { classId, programId, view }
    }),

  lesson: (lessonId) =>
    apiRequest(`/api/lessons/${lessonId}`, { auth: false }),

  completeLessonSegment: (token, { lessonId, level, stars }) =>
    apiRequest("/api/user/lesson-segment", {
      method: "POST",
      token,
      body: { lessonId, level, stars }
    }),

  completePlacement: (token, grade) =>
    apiRequest("/api/user/placement-pass", {
      method: "POST",
      token,
      body: { grade }
    }),

  startPlacement: (token, grade) =>
    apiRequest("/api/user/placement/start", {
      method: "POST",
      token,
      body: { grade }
    }),

  submitPlacement: (token, { attemptId, answers }) =>
    apiRequest("/api/user/placement/submit", {
      method: "POST",
      token,
      body: { attemptId, answers }
    }),

  nhiem_vu: (token) => apiRequest("/api/missions", { token }),

  claimMission: (token, missionId) =>
    apiRequest("/api/missions/claim", {
      method: "POST",
      token,
      body: { missionId }
    })
};

export const classApi = {
  list: (token) => apiRequest("/api/classes", { token }),

  posts: (token, classId, { page = 1, limit = 20 } = {}) =>
    apiRequest(`/api/classes/${classId}/posts`, {
      token,
      query: { page, limit }
    }),

  overview: (token, classId, { include } = {}) =>
    apiRequest(`/api/classes/${classId}/overview`, {
      token,
      query: { include }
    }),

  schedules: (token, classId) =>
    apiRequest(`/api/classes/${classId}/schedules`, { token }),

  join: (token, code) =>
    apiRequest("/api/classes/join", {
      method: "POST",
      token,
      body: { code }
    }),

  submitAssignment: (token, postId, payload = {}) => {
    const body = Object.prototype.hasOwnProperty.call(payload, "answers")
      ? payload
      : { answers: payload };

    return apiRequest(`/api/classes/assignments/${postId}/submit`, {
      method: "POST",
      token,
      body
    });
  }
};

export const labApi = {
  chemicals: () => apiRequest("/api/lab/chemicals", { auth: false }),
  reactions: () => apiRequest("/api/lab/reactions", { auth: false }),
  searchEquation: (q) =>
    apiRequest("/api/lab/balancing/search", {
      auth: false,
      query: { q }
    }),
  progress: (token) => apiRequest("/api/lab/balancing/progress", { token })
};

export const arenaApi = {
  leaderboard: () => apiRequest("/api/arena/leaderboard", { auth: false }),
  rooms: () => apiRequest("/api/arena/rooms", { auth: false }),
  myBattles: (token) => apiRequest("/api/arena/my-battles", { token }),
  activeRoom: (token) => apiRequest("/api/arena/active-room", { token }),
  findMatch: (token, mode) =>
    apiRequest("/api/arena/find-match", {
      method: "POST",
      token,
      body: mode ? { mode } : {}
    }),
  createRoom: (token, body) =>
    apiRequest("/api/arena/create", {
      method: "POST",
      token,
      body
    }),
  joinRoom: (token, roomId) =>
    apiRequest("/api/arena/join", {
      method: "POST",
      token,
      body: { phong_dau_id: roomId }
    }),
  startRoom: (token, roomId) =>
    apiRequest(`/api/arena/room/${roomId}/start`, {
      method: "POST",
      token,
      body: {}
    }),
  roomState: (token, roomId) =>
    apiRequest(`/api/arena/room/${roomId}/state`, { token }),
  answerRoom: (token, roomId, body) =>
    apiRequest(`/api/arena/room/${roomId}/answer`, {
      method: "POST",
      token,
      body
    }),
  advanceRoom: (token, roomId) =>
    apiRequest(`/api/arena/room/${roomId}/advance`, {
      method: "POST",
      token,
      body: {}
    }),
  leaveRoom: (token, roomId) =>
    apiRequest("/api/arena/leave", {
      method: "POST",
      token,
      body: { phong_dau_id: roomId }
    })
};

export const libraryApi = {
  list: ({ category, search, page = 1, limit = 24 } = {}) =>
    apiRequest("/api/materials", {
      auth: false,
      query: { category, search, page, limit }
    }),
  detail: (id, { increment, token } = {}) =>
    apiRequest(`/api/materials/${id}`, {
      auth: Boolean(token),
      token,
      query: { increment: increment === false ? "false" : undefined }
    }),
  phan_hoi: (id, { page = 1, limit = 10 } = {}) => apiRequest(`/api/materials/${id}/feedback`, {
    auth: false,
    query: { page, limit }
  }),
  postFeedback: (token, id, body) =>
    apiRequest(`/api/materials/${id}/feedback`, {
      method: "POST",
      token,
      body
    })
};

export const publicApi = {
  leaderboard: () => apiRequest("/api/user/leaderboard", { auth: false }),
  onlineCount: () => apiRequest("/api/user/online-count", { auth: false })
};
