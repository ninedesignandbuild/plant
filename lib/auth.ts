import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, signSession, verifySession, type Session } from "./session";

export const getSession = async () => verifySession((await cookies()).get(COOKIE)?.value);

export async function sessionResponse(s: Session) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signSession(s), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
