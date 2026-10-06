import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, requireAdmin } from "@/lib/admin";
import { settingsSchema } from "@/lib/validations/admin";
import { Setting } from "@/models/Setting";

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  await connectDB();
  await Setting.updateOne({ key: "main" }, { key: "main", ...parsed.data }, { upsert: true });
  revalidateTag("settings");
  return NextResponse.json({ ok: true });
}
