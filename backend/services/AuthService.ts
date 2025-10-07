import argon2 from "argon2";
import { UserService } from './UserService'

export class AuthService {
  static async register({ email, password, name, roleId }: { email: string; password: string; name?: string; roleId: string }) {
    const existing = await UserService.findByEmail(email)
    if (existing) throw new Error('Email already registered')

    const hashed = await argon2.hash(password);
    const user = await UserService.createUser({ email, name, roleId, password : hashed })
    return user
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await UserService.findByEmail(email)
    if (!user) throw new Error('Invalid credentials')

    const match = await argon2.verify(password, user.password)
    if (!match) throw new Error('Invalid credentials')

    return user
  }
}
