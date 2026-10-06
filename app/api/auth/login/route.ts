import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { sessionResponse } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  if (!rateLimit(`login:${clientIp(req)}`)) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  await connectDB();
  const u = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
  if (!u || !(await bcrypt.compare(parsed.data.password, u.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  return sessionResponse({ id: String(u._id), role: u.role, name: u.name });
}
