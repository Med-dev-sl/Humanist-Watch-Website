import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "superadmin@huwasal.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Superadmin user already exists.");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Superadmin",
      email,
      password: "admin123",
      role: "SUPERADMIN",
    },
  });

  console.log("Superadmin user created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
