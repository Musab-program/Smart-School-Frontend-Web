import { api } from "@/lib/api"

export const authService = {
  login: (email: string, password: string) => api.post<{ token: string }>("/api/login", { email, password }),
  me: () => api.get<{ id: string; name: string; email: string }>("/api/me"),
}



