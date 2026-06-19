const { PrismaClient } = require("./app/generated/prisma");
const p = new PrismaClient();
p.$connect()
  .then(() => console.log("CONNECTED"))
  .catch((e) => console.error("FAILED:", e.message))
  .finally(() => p.$disconnect());
