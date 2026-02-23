import { User, AuthResponse, RegisterRequest, LoginRequest, UserProgress, ProgressCompleteRequest } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8000";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data as T;
}

export const authApi = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const progressApi = {
  complete: (data: ProgressCompleteRequest): Promise<{ status: string }> =>
    apiRequest("/progress/complete", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByUser: (userId: string): Promise<UserProgress[]> =>
    apiRequest(`/progress/${userId}`),

  getByTopic: (userId: string, topicId: string): Promise<UserProgress[]> =>
    apiRequest(`/progress/${userId}/topic/${topicId}`),
};

export const sessionApi = {
  create: (userId: string): Promise<{ thread_id: string }> =>
    apiRequest("/sessions/create", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  get: (userId: string): Promise<{ thread_id: string; conversation_history: Array<{ role: string; content: string }> }> =>
    apiRequest(`/sessions/${userId}`),

  addMessage: (userId: string, role: "user" | "assistant", content: string): Promise<{ status: string }> =>
    apiRequest(`/sessions/${userId}/message`, {
      method: "PUT",
      body: JSON.stringify({ role, content }),
    }),
};
