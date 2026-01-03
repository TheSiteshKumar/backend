import { Elysia } from 'elysia'
import { AuthService } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/login',
    async ({ body }) => AuthService.login(body as any),
    { body: AuthModel.login }
  )
