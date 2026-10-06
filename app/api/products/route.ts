import { NextRequest, NextResponse } from "next/server";
import { ListQuery, cleanParams, listProducts } from "@/lib/products";

export async function GET(req: NextRequest) {
  const parsed = ListQuery.safeParse(cleanParams(Object.fromEntries(req.nextUrl.searchParams)));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  return NextResponse.json(await listProducts(parsed.data));
}
