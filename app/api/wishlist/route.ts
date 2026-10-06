import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { User } from "@/models/User";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ ids: [] });
  await connectDB();
  const u = await User.findById(s.id).select("wishlist").lean();
  return NextResponse.json({ ids: (u?.wishlist ?? []).map(String) });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Sign in to save plants." }, { status: 401 });
  const id = (await req.json().catch(() => ({})))?.productId;
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ error: "Invalid product." }, { status: 400 });
  await connectDB();
  const has = await User.exists({ _id: s.id, wishlist: id });
  await User.updateOne({ _id: s.id }, has ? { $pull: { wishlist: id } } : { $addToSet: { wishlist: id } });
  return NextResponse.json({ saved: !has });
}
