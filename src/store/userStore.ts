import { create } from "zustand"

type User = { id: string; name: string; email: string } | null

type State = {
  user: User
  setUser: (user: User) => void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))



