// test-db.ts
import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

const prisma = new PrismaClient();

async function main() {
  // Create a role
  const role = await prisma.userRole.create({
    data: {
      id: ulid(),
      name: "admin",
    },
  });
  console.log("Created role:", role);

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: ulid(),
      name: "Galih",
      email: "galih@example.com",
      roleId: role.id,
    },
  });
  console.log("Created user:", user);

  // Query users
  const users = await prisma.user.findMany({ include: { role: true } });
  console.log("All users:", users);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
