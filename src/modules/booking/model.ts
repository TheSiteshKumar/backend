import { t } from 'elysia'

export const BookingModel = {
  create: t.Object({
    userId: t.String(),
    date: t.String()
  })
}

export namespace BookingModel {
  export type Create = typeof BookingModel.create.static
}
