import { Elysia } from 'elysia'
import { auth } from './modules/auth'
import { user } from './modules/user'
import { booking } from './modules/booking'
import { health } from './modules/health'
import { ErrorPlugin } from './plugins/error'
import { AuthGuard } from './plugins/auth.guard'
// import { DbPlugin } from './plugins/db'

export const app = new Elysia()
  .use(ErrorPlugin)
  .use(AuthGuard)
  .use(health)
  .use(auth)
  .use(user)
  .use(booking)
