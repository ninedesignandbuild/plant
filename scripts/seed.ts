import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { User } from "../models/User";
import { Coupon } from "../models/Coupon";
import { BlogPost } from "../models/BlogPost";
import { slugify } from "../lib/utils";

config({ path: ".env.local" }); config();

const cats = [["Indoor Plants", "indoor-plants"], ["Outdoor Plants", "outdoor-plants"], ["Flowering Plants", "flowering-plants"], ["Succulents", "succulents"], ["Air Purifying Plants", "air-purifying-plants"], ["Low Light Plants", "low-light-plants"], ["Planters", "planters"], ["Plant Care Products", "plant-care"]];
// name, category, price, mrp, light, water, care, petFriendly, bestSeller
const items: [string, string, number, number, string, string, "easy" | "medium" | "expert", 0 | 1, 0 | 1][] = [
  ["Money Plant", "indoor-plants", 299, 399, "Low to bright indirect", "Weekly", "easy", 0, 1],
  ["Snake Plant", "low-light-plants", 499, 599, "Low light", "Every 2 weeks", "easy", 0, 1],
  ["Peace Lily", "air-purifying-plants", 399, 499, "Low to medium", "Weekly", "easy", 0, 1],
  ["Areca Palm", "indoor-plants", 799, 999, "Bright indirect", "Weekly", "medium", 1, 1],
  ["ZZ Plant", "low-light-plants", 599, 749, "Low light", "Every 2 weeks", "easy", 0, 1],
  ["Rubber Plant", "indoor-plants", 549, 699, "Bright indirect", "Weekly", "medium", 0, 0],
  ["Monstera", "indoor-plants", 899, 1099, "Bright indirect", "Weekly", "medium", 0, 0],
  ["Fiddle Leaf Fig", "indoor-plants", 1299, 1599, "Bright indirect", "Weekly", "expert", 0, 0],
  ["Aloe Vera", "succulents", 249, 299, "Bright light", "Every 2 weeks", "easy", 0, 0],
  ["Jade Plant", "succulents", 349, 399, "Bright light", "Every 2 weeks", "easy", 0, 0],
  ["Spider Plant", "air-purifying-plants", 279, 349, "Low to bright", "Weekly", "easy", 1, 0],
  ["Lucky Bamboo", "low-light-plants", 199, 249, "Low light", "Water-based", "easy", 0, 0],
  ["Rose Plant", "flowering-plants", 249, 299, "Full sun", "Daily", "medium", 1, 0],
  ["Jasmine", "flowering-plants", 299, 349, "Full sun", "Every 2 days", "medium", 1, 0],
  ["Hibiscus", "flowering-plants", 349, 399, "Full sun", "Daily", "medium", 1, 0],
  ["Bougainvillea", "outdoor-plants", 399, 499, "Full sun", "Weekly", "easy", 1, 0],
];

const posts = [
  ["How Often Should You Water Indoor Plants?", "Plant Care", "Water when the top inch of soil feels dry, not on a fixed schedule.", "There is no single schedule that suits every plant. Push a finger into the soil: if the top inch is dry, water thoroughly until it drains from the bottom, then empty the saucer.\n\n## Seasons matter\n\nPlants dry out faster in summer and slower in the monsoon, so check the soil more often in April and May and less often from July to September.\n\n## Signs of overwatering\n\nYellowing lower leaves and soil that stays wet for days are the usual signs. Let the soil dry out and water less often."],
  ["Best Indoor Plants for Low Light", "Indoor Plants", "Snake plant, ZZ plant, money plant and peace lily cope with dim rooms.", "Low light does not mean no light. These plants grow slowly in dim corners but still need a room with daylight, or a spot a few feet from a window.\n\n## Good choices\n\nSnake plant, ZZ plant, money plant, peace lily and lucky bamboo all tolerate low light.\n\n## Care tips\n\nWater less often than you would in bright light, because the soil dries more slowly. Wipe the leaves now and then so they can catch the light they get."],
  ["How to Keep Your Money Plant Healthy", "Indoor Plants", "Bright indirect light, water when the top soil dries, and trim regularly.", "Money plant is one of the easiest houseplants. It grows well in bright indirect light and tolerates lower light.\n\n## Water and soil\n\nWater when the top inch of soil is dry. It also grows in a jar of clean water; change the water every week or two.\n\n## Keep it bushy\n\nTrim long vines just above a leaf joint and the plant will branch out. Avoid strong afternoon sun, which scorches the leaves."],
  ["5 Easy Plants for Beginners", "Beginner Guide", "Money plant, snake plant, ZZ plant, spider plant and aloe vera forgive mistakes.", "These five plants cope with missed waterings and uneven light.\n\n## The five\n\nMoney plant, snake plant, ZZ plant, spider plant and aloe vera.\n\n## How to start\n\nPick one, put it where it gets bright indirect light, and water only when the soil is dry. Add a second plant once the first has settled in."],
] as const;

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  for (const [i, [name, slug]] of cats.entries()) await Category.updateOne({ slug }, { name, slug, order: i }, { upsert: true });
  const reset = process.argv.includes("--reset"); // wipes products and blog posts, then reloads the samples
  if (reset) await Product.deleteMany({});
  if (reset || !(await Product.exists({}))) await Product.insertMany(items.map(([name, category, price, compareAtPrice, light, water, care, pet, best], i) => ({
    name, slug: slugify(name), category, price, compareAtPrice, sku: `NYNI-${String(i + 1).padStart(3, "0")}`,
    stock: 20 + i, shortDescription: `Healthy ${name.toLowerCase()}, nursery-grown and ready to pot.`,
    description: `${name} grown at our nursery. Light: ${light}. Water: ${water}.`,
    lightRequirement: light, waterRequirement: water, careLevel: care, petFriendly: !!pet, isBestSeller: !!best, isFeatured: i < 8,
  })));
  if (process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL ?? "admin@nyninursery.com";
    await User.updateOne({ email }, { name: "NYNI Admin", email, role: "admin", passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) }, { upsert: true });
  } else console.warn("ADMIN_PASSWORD not set — admin user skipped");
  await Coupon.updateOne({ code: "WELCOME10" }, { code: "WELCOME10", type: "percent", value: 10, minOrder: 499, maxDiscount: 150, isActive: true }, { upsert: true });
  if (reset) await BlogPost.deleteMany({});
  if (reset || !(await BlogPost.exists({}))) await BlogPost.insertMany(posts.map(([title, category, excerpt, content]) => ({ title, slug: slugify(title), category, excerpt, content, isPublished: true, publishedAt: new Date() })));
  console.log(`Seeded ${cats.length} categories, ${items.length} products`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });