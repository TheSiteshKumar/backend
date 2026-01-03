import { Elysia } from 'elysia'
import { BookingService } from './service'
import { BookingModel } from './model'

export const booking = new Elysia({ prefix: '/booking' })
  .get('/:id', ({ params }) => BookingService.get(params.id))
  .post('/', ({ body }) => BookingService.create(body as any), { body: BookingModel.create })
