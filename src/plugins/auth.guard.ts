import { Elysia } from 'elysia'

export const AuthGuard = new Elysia({ name: 'Auth.Guard' }).macro({
  isAuthenticated: {
    resolve({ cookie, status }) {
      if (!cookie?.session?.value)
        return status(401)
    }
  }
})
