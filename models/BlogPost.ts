import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema({
  title: { type: String, required: true }, slug: { type: String, required: true, unique: true },
  featuredImage: String, excerpt: String, content: { type: String, required: true },
  author: { type: String, default: "NYNI Nursery" }, category: { type: String, required: true, index: true }, tags: [String],
  isPublished: { type: Boolean, default: false }, publishedAt: Date, seoTitle: String, seoDescription: String,
}, { timestamps: true });
BlogPostSchema.index({ publishedAt: -1 });

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
