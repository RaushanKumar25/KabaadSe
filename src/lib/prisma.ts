import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Enable WebSocket support for Neon in Node.js environments
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

// Clean and sanitize DATABASE_URL from environment
if (process.env.DATABASE_URL) {
  // Strip any wrapping quotes from Vercel / .env copy-paste and trim whitespace
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "").trim();
}

const globalForPrisma = globalThis as unknown as {
  prisma: (PrismaClient & { pickup: PrismaClient["pickupRequest"] }) | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient & { pickup: PrismaClient["pickupRequest"] } {
  const logOptions =
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as const)
      : (["error"] as const);

  const connectionString = process.env.DATABASE_URL;

  let client: PrismaClient;

  if (connectionString) {
    const pool = globalForPrisma.pool ?? new Pool({ connectionString });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.pool = pool;
    }
    const adapter = new PrismaNeon(pool);
    client = new PrismaClient({
      adapter,
      log: logOptions as any,
    });
  } else {
    client = new PrismaClient({
      log: logOptions as any,
    });
  }

  // Alias prisma.pickup to prisma.pickupRequest for seamless backward compatibility
  if (client && !("pickup" in client) && "pickupRequest" in client) {
    Object.defineProperty(client, "pickup", {
      get() {
        return (this as any).pickupRequest;
      },
      enumerable: true,
      configurable: true,
    });
  }

  return client as PrismaClient & { pickup: PrismaClient["pickupRequest"] };
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Execute a Prisma operation with a resilient serverless timeout.
 * Set to 15,000ms (15 seconds) to handle Neon PostgreSQL compute cold-starts over WebSockets.
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
