export const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const discountPct = (price: number, compareAt?: number | null) => (compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0);
