import type { UserModel } from './model'

export abstract class UserService {
  static async get(id: string) {
    return { id, name: 'Demo User' }
  }

  static async create(data: UserModel.Create) {
    return { id: 'new-id', ...data }
  }
}
