import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { connectDB } from "./mongodb";
import { rateLimit, clientIp } from "./rateLimit";

// Shared handler for public forms: rate limit, validate, save.
export function formHandler<T extends z.ZodTypeAny>(schema: T, key: string, save: (d: z.infer<T>) => Promise<unknown>) {
  return async (req: NextRequest) => {
    if (!rateLimit(`${key}:${clientIp(req)}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: `${parsed.error.issues[0].path.join(".") || "Form"}: ${parsed.error.issues[0].message}` }, { status: 400 });
    await connectDB();
    await save(parsed.data);
    return NextResponse.json({ ok: true });
  };
}
