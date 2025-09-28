export function useAuth() {
  return {
    isAuthenticated: false,
    user: null as null | { id: string; name: string; email: string },
    login: async (_email: string, _password: string) => {},
    logout: async () => {},
  }
}



