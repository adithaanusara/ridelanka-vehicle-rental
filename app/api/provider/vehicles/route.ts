import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, fail, ok } from "@/lib/http";
import { enforceListingLimit } from "@/services/vehicle-service";
import { z } from "zod";
const schema = z.object({
  title: z.string().min(3).max(120),
  typeId: z.string().cuid(),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 1),
  district: z.string().min(2),
  city: z.string().min(2),
  pickupLocation: z.string().min(2),
  dailyRate: z.coerce.number().int().positive(),
  weeklyRate: z.coerce.number().int().positive().optional(),
  seats: z.coerce.number().int().min(1).max(60),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]),
  selfDrive: z.boolean(),
  driverAvailable: z.boolean(),
  description: z.string().min(20),
  terms: z.string().min(10),
});
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PROVIDER")
      return fail("Provider authentication is required.", 401);
    const company = await db.rentalCompany.findUnique({ where: { ownerId: session.userId } });
    if (!company) return fail("Provider company not found.", 404);
    await enforceListingLimit(company.id);
    const value = schema.parse(await request.json());
    const slug = `${slugify(value.title)}-${crypto.randomUUID().slice(0, 6)}`;
    const vehicle = await db.vehicle.create({
      data: {
        ...value,
        slug,
        companyId: company.id,
        status: "PENDING_REVIEW",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=85",
              alt: value.title,
            },
          ],
        },
      },
    });
    return ok(vehicle, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "ACTIVE_SUBSCRIPTION_REQUIRED")
      return fail("An active subscription is required before adding a vehicle.", 403);
    if (error instanceof Error && error.message === "LISTING_LIMIT_REACHED")
      return fail("Your active plan's listing limit has been reached.", 403);
    return apiError(error);
  }
}
