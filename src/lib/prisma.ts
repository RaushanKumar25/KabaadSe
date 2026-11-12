import { PrismaClient } from "@prisma/client";

// Guard against missing or malformed DATABASE_URL strings to prevent P1012 crashes
if (
  !process.env.DATABASE_URL ||
  (!process.env.DATABASE_URL.startsWith("postgresql://") &&
    !process.env.DATABASE_URL.startsWith("postgres://"))
) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/kabaadse?schema=public";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Alias prisma.pickup to prisma.pickupRequest for seamless compatibility
if (basePrisma && !("pickup" in basePrisma) && "pickupRequest" in basePrisma) {
  Object.defineProperty(basePrisma, "pickup", {
    get() {
      return (this as any).pickupRequest;
    },
    enumerable: true,
    configurable: true,
  });
}

export const prisma = basePrisma as PrismaClient & {
  pickup: PrismaClient["pickupRequest"];
};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Execute a Prisma operation with a resilient timeout.
 * If the database is cold or unreachable, it rejects within timeoutMs
 * instead of hanging the client request indefinitely on a TCP socket timeout.
 */
export async function withDbTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 2500
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err: any = new Error(
        "Database connection timed out (server offline or unreachable)"
      );
      err.code = "P1001";
      reject(err);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export default prisma;
