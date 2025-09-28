import { api } from "@/lib/api"

export const courseService = {
  list: () => api.get<Array<{ id: string; title: string }>>("/api/courses"),
}



