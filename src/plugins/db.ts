import { Elysia } from 'elysia'
import { connect, mongoose } from '../lib/db'
import { MONGODB_URI } from '../config/env'

export const DbPlugin = new Elysia({ name: 'DB' })
  .onStart(async () => {
    await connect(MONGODB_URI)
  })
  .decorate('db', {
    mongoose
  })

