import { PrismaClient } from "@prisma/client";

const createPrismaClient = () =>
    new PrismaClient({
        errorFormat: "pretty",
    });

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
