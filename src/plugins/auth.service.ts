import { Elysia } from 'elysia'

export const AuthPlugin = new Elysia({ name: 'Auth.Service' }).macro({
  isAuthenticated: {
    resolve({ cookie, status }) {
      if (!cookie?.session?.value)
        return status(401)
    }
  }
})
