import { z } from "zod";
import { districts } from "@/lib/catalog";

const password = z.string().min(10, "Password must be at least 10 characters.").max(100);
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const registrationSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(7).max(25),
    password,
    role: z.enum(["CUSTOMER", "PROVIDER"]),
    company: z
      .object({
        name: z.string().min(2).max(120),
        registrationNumber: z.string().max(50).optional(),
        district: z.enum(districts),
        city: z.string().min(2).max(80),
        address: z.string().min(5).max(300),
        whatsapp: z.string().min(7).max(25),
        description: z.string().max(600).optional(),
      })
      .optional(),
  })
  .superRefine((value, context) => {
    if (value.role === "PROVIDER" && !value.company)
      context.addIssue({
        code: "custom",
        path: ["company"],
        message: "Provider details are required.",
      });
  });
export const bookingSchema = z
  .object({
    vehicleId: z.string().cuid(),
    pickupDate: z.coerce.date(),
    returnDate: z.coerce.date(),
    pickupLocation: z.string().min(3).max(150),
    customerName: z.string().min(2).max(80),
    phone: z.string().min(7).max(25),
    email: z.string().email(),
    message: z.string().max(500).optional(),
  })
  .refine((data) => data.returnDate > data.pickupDate, {
    path: ["returnDate"],
    message: "Return date must be after pickup date.",
  });
