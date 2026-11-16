export const ADMIN_SESSION_COOKIE = "kabaadse_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export const CUSTOMER_SESSION_COOKIE = "kabaadse_customer_session";
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface CustomerSessionPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
}

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "kabaadse_default_production_ready_secret_key_32bytes"
  );
}

export function validateAdminCredentials(user: string, pass: string): boolean {
  const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || "GreenTruck#Scrap94").trim();

  if (!user || !pass) return false;
  return user.trim() === expectedUser && pass.trim() === expectedPass;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

function base64UrlEncode(str: string): string {
  const base64 =
    typeof btoa === "function"
      ? btoa(str)
      : Buffer.from(str, "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return typeof atob === "function"
    ? atob(base64)
    : Buffer.from(base64, "base64").toString("utf-8");
}

/* =========================================================================
   ADMIN SESSION TOKENS
   ========================================================================= */

export async function signSessionToken(
  username: string,
  maxAgeSeconds = SESSION_MAX_AGE
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    u: username,
    iat: now,
    exp: now + maxAgeSeconds,
  };
  const jsonStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(jsonStr);

  const key = await getHmacKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(encodedPayload)
  );
  const signatureHex = arrayBufferToHex(signatureBuffer);

  return `${encodedPayload}.${signatureHex}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  const [encodedPayload, signatureHex] = token.split(".");
  if (!encodedPayload || !signatureHex) {
    return { valid: false };
  }

  try {
    const key = await getHmacKey(getSecretKey());
    const enc = new TextEncoder();
    const signatureBuffer = hexToArrayBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(encodedPayload)
    );

    if (!isValid) {
      return { valid: false };
    }

    const jsonStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

/* =========================================================================
   CUSTOMER SESSION TOKENS (ISOLATED FROM ADMIN)
   ========================================================================= */

export async function signCustomerSessionToken(
  customer: CustomerSessionPayload,
  maxAgeSeconds = CUSTOMER_SESSION_MAX_AGE
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    cId: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    role: "customer",
    iat: now,
    exp: now + maxAgeSeconds,
  };
  const jsonStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(jsonStr);

  const key = await getHmacKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(encodedPayload)
  );
  const signatureHex = arrayBufferToHex(signatureBuffer);

  return `${encodedPayload}.${signatureHex}`;
}

export async function verifyCustomerSessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; customer?: CustomerSessionPayload }> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  const [encodedPayload, signatureHex] = token.split(".");
  if (!encodedPayload || !signatureHex) {
    return { valid: false };
  }

  try {
    const key = await getHmacKey(getSecretKey());
    const enc = new TextEncoder();
    const signatureBuffer = hexToArrayBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(encodedPayload)
    );

    if (!isValid) {
      return { valid: false };
    }

    const jsonStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false };
    }

    if (!payload.cId || payload.role !== "customer") {
      return { valid: false };
    }

    return {
      valid: true,
      customer: {
        id: payload.cId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      },
    };
  } catch {
    return { valid: false };
  }
}
