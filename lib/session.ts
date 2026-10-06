import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "nyni_session";
export type Session = { id: string; role: "customer" | "admin"; name: string };
const key = () => {
  if (!process.env.NEXTAUTH_SECRET) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
};
export const signSession = (s: Session) => new SignJWT({ ...s }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
export async function verifySession(token?: string): Promise<Session | null> {
  if (!token || !process.env.NEXTAUTH_SECRET) return null;
  try { return (await jwtVerify(token, key())).payload as unknown as Session; } catch { return null; }
}
