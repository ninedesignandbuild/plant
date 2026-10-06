import { NextResponse } from "next/server";
import { forbidden, requireAdmin } from "@/lib/admin";
import { signUpload } from "@/lib/cloudinary";

export async function GET() {
  if (!(await requireAdmin())) return forbidden();
  try { return NextResponse.json(signUpload()); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Upload unavailable" }, { status: 503 }); }
}
