import { Elysia } from 'elysia'
import { UserService } from './service'
import { UserModel } from './model'

export const user = new Elysia({ prefix: '/user' })
  .get('/:id', ({ params }) => UserService.get(params.id))
  .post('/', ({ body }) => UserService.create(body as any), { body: UserModel.create })
