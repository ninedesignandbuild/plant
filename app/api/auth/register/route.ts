import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { sessionResponse } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { registerSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  if (!rateLimit(`reg:${clientIp(req)}`, 5)) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, email, phone, password } = parsed.data;
  await connectDB();
  if (await User.exists({ email })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  const u = await User.create({ name, email, phone: phone || undefined, passwordHash: await bcrypt.hash(password, 12) });
  return sessionResponse({ id: String(u._id), role: "customer", name });
}
