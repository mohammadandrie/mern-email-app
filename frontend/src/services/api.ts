import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// Contacts
export const contactAPI = {
  getAll: () => api.get("/contacts"),
  getOne: (id: string) => api.get(`/contacts/${id}`),
  create: (data: { email: string; date: string; description: string }) => api.post("/contacts", data),
  update: (id: string, data: { email: string; date: string; description: string }) => api.put(`/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/contacts/${id}`),
  sendEmail: (id: string) => api.post(`/contacts/${id}/send-email`),
};

export default api;
