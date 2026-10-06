import crypto from "node:crypto";

// Signed params for direct browser-to-Cloudinary uploads; the API secret never leaves the server.
export function signUpload() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloudName || !apiKey || !secret) throw new Error("Cloudinary is not configured. Set the CLOUDINARY_* variables.");
  const timestamp = Math.floor(Date.now() / 1000), folder = "nyni/products", allowed = "jpg,jpeg,png,webp";
  const signature = crypto.createHash("sha1").update(`allowed_formats=${allowed}&folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return { cloudName, apiKey, timestamp, folder, allowed, signature };
}
