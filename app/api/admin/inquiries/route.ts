import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, requireAdmin } from "@/lib/admin";
import { INQUIRY_STATUSES } from "@/lib/config";
import { ContactMessage } from "@/models/ContactMessage";
import { ServiceBooking } from "@/models/ServiceBooking";

const Body = z.object({ kind: z.enum(["booking", "contact"]), id: z.string().regex(/^[a-f\d]{24}$/i), status: z.enum(INQUIRY_STATUSES) });

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const { kind, id, status } = parsed.data;
  await connectDB();
  await (kind === "booking" ? ServiceBooking : ContactMessage).updateOne({ _id: id }, { status });
  return NextResponse.json({ ok: true });
}
