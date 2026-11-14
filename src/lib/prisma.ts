import { PrismaClient } from "@prisma/client";

// Clean and sanitize DATABASE_URL from environment
if (process.env.DATABASE_URL) {
  // Strip any wrapping quotes from Vercel / .env copy-paste and trim whitespace
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "").trim();
}

// In local development only: provide local fallback string if DATABASE_URL is not set
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/kabaadse?schema=public";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js standard singleton pattern for Vercel / serverless connection reuse
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
 * Execute a Prisma operation with a resilient serverless timeout.
 * Set to 15,000ms by default to handle Neon PostgreSQL compute cold-starts.
 */
export async function withDbTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 15000
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err: any = new Error(
        `Database operation timed out after ${timeoutMs}ms (Neon cold-start or unreachable server)`
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
