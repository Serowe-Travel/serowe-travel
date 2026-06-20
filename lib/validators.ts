import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().max(160).optional().or(z.literal("")),
  package: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(10, "Please tell us a little more").max(4000),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const packageSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(160),
  type: z.enum(["luxury", "family", "health", "adventure", "custom"]),
  destination: z.string().max(160).optional().or(z.literal("")),
  duration: z.string().max(80).optional().or(z.literal("")),
  price: z.coerce.number().nonnegative().optional().or(z.nan()),
  price_currency: z.string().max(8).default("BWP"),
  description: z.string().max(8000).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
});
