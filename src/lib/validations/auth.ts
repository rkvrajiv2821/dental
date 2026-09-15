import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.input<typeof loginSchema>;

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["SUPER_ADMIN", "CONTENT_MANAGER", "RECEPTION", "SEO_MANAGER"]),
  isActive: z.boolean().default(true),
});

export type UserInput = z.input<typeof userSchema>;
