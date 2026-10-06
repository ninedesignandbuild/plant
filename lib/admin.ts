import { NextResponse } from "next/server";
import type { z } from "zod";
import { getSession } from "./auth";
import { connectDB } from "./mongodb";
import { Category } from "@/models/Category";

export async function requireAdmin() { const s = await getSession(); return s?.role === "admin" ? s : null; }
export const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
export const notFoundJson = () => NextResponse.json({ error: "Not found." }, { status: 404 });
export const invalid = (e: z.ZodError) => NextResponse.json({ error: `${e.issues[0].path.join(".") || "Request"}: ${e.issues[0].message}` }, { status: 400 });
export const isId = (s: string) => /^[a-f\d]{24}$/i.test(s);
export const isDup = (e: unknown) => typeof e === "object" && e !== null && (e as { code?: number }).code === 11000;
export async function getCategories(): Promise<{ name: string; slug: string }[]> {
  await connectDB();
  return JSON.parse(JSON.stringify(await Category.find().sort({ order: 1 }).select("name slug").lean()));
}
