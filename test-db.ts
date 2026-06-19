import "dotenv/config";
import { PrismaClient } from "./app/generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

async function test() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const p = new PrismaClient({ adapter });
  try {
    await p.$connect();
    console.log("CONNECTED ✓");
    const count = await p.program.count();
    console.log(`Programs count: ${count}`);
    const users = await p.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.log("Users:", JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("FAILED:", (e as Error).message);
  } finally {
    await p.$disconnect();
  }
}

test();
