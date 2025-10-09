import prisma from '../db/client'
import type { Prisma, User } from '@prisma/client';

export type CreateUserInput = Prisma.UserUncheckedCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;
export type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

export class UserService {
  static async createUser({ email, name, roleId, password }: CreateUserInput): Promise<UserWithRole> {
    return prisma.user.create({
      data: { email, name, roleId, password },
      include: { role: true },
    })
  }

  static async findByEmail(email: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })
  }

  static async findById(id: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })
  }

  static async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserWithRole[]> {
    const { skip, take, where, orderBy } = params || {};
    return prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { role: true },
    })
  }

  static async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where })
  }

  // Update
  static async updateUser(id: string, data: UpdateUserInput): Promise<UserWithRole> {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    })
  }

  // Delete
  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    })
  }

  static async deleteMany(where: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return prisma.user.deleteMany({ where })
  }

  // Upsert
  static async upsertUser(
    where: Prisma.UserWhereUniqueInput,
    create: CreateUserInput,
    update: UpdateUserInput
  ): Promise<UserWithRole> {
    return prisma.user.upsert({
      where,
      create,
      update,
      include: { role: true },
    })
  }
}