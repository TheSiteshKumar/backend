import type { BookingModel } from './model'

export abstract class BookingService {
  static async get(id: string) {
    return { id, status: 'pending' }
  }

  static async create(data: BookingModel.Create) {
    return { id: 'booking-1', ...data }
  }
}
