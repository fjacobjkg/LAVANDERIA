import { prisma } from "../../lib/prisma.js";
import type { DatabaseProbe } from "./health.types.js";

export const prismaDatabaseProbe: DatabaseProbe = {
  async check() {
    await prisma.$queryRaw`SELECT 1`;
  },
};

