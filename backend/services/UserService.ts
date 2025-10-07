import prisma from '../db/client'
import type { Prisma, User } from '@prisma/client';

export type CreateUserInput = Prisma.UserUncheckedCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;
export type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

export class UserService {
  static async createUser({ email, name, roleId, password }: CreateUserInput) : Promise<User>{
    return prisma.user.create({
      data: { email, name, roleId, password },
      include: { role: true },
    })
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })
  }
}
