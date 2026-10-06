export const SERVICES = [
  { name: "Landscape Design", blurb: "Plan and plant a garden that suits your space, light and budget." },
  { name: "Garden Setup", blurb: "Beds, planters, soil and irrigation set up from start to finish." },
  { name: "Indoor Plant Styling", blurb: "Plants and planters chosen to suit your rooms." },
  { name: "Garden Maintenance", blurb: "Regular pruning, feeding and pest care by our team." },
  { name: "Corporate Greenery", blurb: "Plants for offices, lobbies and retail spaces." },
  { name: "Event Greenery", blurb: "Plant displays and décor for weddings and events." },
  { name: "Bulk Plant Orders", blurb: "Plants in volume for projects, gifting and resellers." },
] as const;
export const SERVICE_NAMES = SERVICES.map((s) => s.name) as unknown as readonly [string, ...string[]];
export const PROPERTY_TYPES = ["Home", "Apartment", "Villa", "Office", "Commercial space", "Event venue", "Other"] as const;
export const BLOG_CATEGORIES = ["Plant Care", "Indoor Plants", "Outdoor Plants", "Gardening", "Beginner Guide", "Seasonal Tips"] as const;
// Set in .env.local until the admin settings page exists.
export const NURSERY = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "", email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "Hyderabad, Telangana", hours: process.env.NEXT_PUBLIC_HOURS ?? "", mapsEmbed: process.env.NEXT_PUBLIC_MAPS_EMBED_URL ?? "",
};
// Confirm this with the business: it is quoted on the Returns page.
export const RETURN_WINDOW = "48 hours";
