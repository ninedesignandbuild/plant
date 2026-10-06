import { unstable_cache } from "next/cache";
import { connectDB } from "./mongodb";
import { DELIVERY } from "./config";
import { NURSERY } from "./content";
import { Setting } from "@/models/Setting";

export type Settings = {
  nurseryName: string; phone: string; email: string; whatsapp: string; address: string; openingHours: string; mapsEmbedUrl: string;
  standardFee: number; expressFee: number; freeAbove: number; minOrder: number; codEnabled: boolean; instagram: string; facebook: string; youtube: string;
};
// Used until the admin saves settings (and whenever the database is unreachable).
export const DEFAULT_SETTINGS: Settings = {
  nurseryName: "NYNI Nursery", phone: NURSERY.phone, email: NURSERY.email, whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  address: NURSERY.address, openingHours: NURSERY.hours, mapsEmbedUrl: NURSERY.mapsEmbed,
  standardFee: DELIVERY.standard, expressFee: DELIVERY.express, freeAbove: DELIVERY.freeAbove, minOrder: 0, codEnabled: true, instagram: "", facebook: "", youtube: "",
};

const load = unstable_cache(async () => {
  await connectDB();
  const d = await Setting.findOne({ key: "main" }).lean();
  return d ? JSON.parse(JSON.stringify(d)) : null;
}, ["settings"], { tags: ["settings"], revalidate: 300 });

export async function getSettings(): Promise<Settings> {
  try { return { ...DEFAULT_SETTINGS, ...((await load()) ?? {}) }; } catch { return DEFAULT_SETTINGS; }
}
