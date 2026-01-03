import { status } from 'elysia'
import type { AuthModel } from './model'

export abstract class AuthService {
  static async login(data: AuthModel.Login) {
    // Example business logic: replace with real DB lookup
    const user = data.username === 'admin' ? { username: 'admin', password: 'password' } : null

    if (!user)
      throw status(401, 'Invalid credentials')

    if (data.password !== user.password)
      throw status(401, 'Invalid credentials')

    return { token: 'jwt-token' }
  }
}
