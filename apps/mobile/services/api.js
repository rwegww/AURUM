import Constants from "expo-constants";

const configuredApiUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  Constants.manifest?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

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
  lessons: ({ classId, programId } = {}) =>
    apiRequest("/api/lessons", {
      auth: false,
      query: { classId, programId }
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

  missions: (token) => apiRequest("/api/missions", { token }),

  claimMission: (token, missionId) =>
    apiRequest("/api/missions/claim", {
      method: "POST",
      token,
      body: { missionId }
    })
};

export const classApi = {
  list: (token) => apiRequest("/api/classes", { token }),

  posts: (token, classId) =>
    apiRequest(`/api/classes/${classId}/posts`, { token }),

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
      body: { room_id: roomId }
    }),
  startRoom: (token, roomId) =>
    apiRequest(`/api/arena/room/${roomId}/start`, {
      method: "POST",
      token,
      body: {}
    }),
  roomState: (token, roomId) =>
    apiRequest(`/api/arena/room/${roomId}/state`, { token })
};

export const libraryApi = {
  list: ({ category, search } = {}) =>
    apiRequest("/api/materials", {
      auth: false,
      query: { category, search }
    }),
  detail: (id) => apiRequest(`/api/materials/${id}`, { auth: false }),
  feedback: (id) => apiRequest(`/api/materials/${id}/feedback`, { auth: false }),
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
