import { api } from "@/lib/api"

export const studentService = {
  list: () => api.get<Array<{ id: string; name: string }>>("/api/students"),
  get: (id: string) => api.get<{ id: string; name: string }>(`/api/students/${id}`),
}



