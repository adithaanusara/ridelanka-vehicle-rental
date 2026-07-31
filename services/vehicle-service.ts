import { Prisma, VehicleStatus } from "@prisma/client";
import { db } from "@/lib/db";

export type VehicleFilters = {
  district?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuel?: string;
  seats?: number;
  selfDrive?: boolean;
  driver?: boolean;
  verified?: boolean;
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
};
export async function searchVehicles(filters: VehicleFilters) {
  const where: Prisma.VehicleWhereInput = {
    status: VehicleStatus.PUBLISHED,
    district: filters.district || undefined,
    type: filters.type ? { slug: filters.type } : undefined,
    dailyRate: { gte: filters.minPrice, lte: filters.maxPrice },
    transmission: (filters.transmission as never) || undefined,
    fuelType: (filters.fuel as never) || undefined,
    seats: filters.seats,
    selfDrive: filters.selfDrive,
    driverAvailable: filters.driver,
    isFeatured: filters.featured,
    company: filters.verified ? { status: "VERIFIED" } : undefined,
  };
  const page = Math.max(filters.page || 1, 1);
  const take = 12;
  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { dailyRate: "asc" }
      : filters.sort === "price_desc"
        ? { dailyRate: "desc" }
        : { createdAt: "desc" };
  const [items, total] = await db.$transaction([
    db.vehicle.findMany({
      where,
      include: {
        type: true,
        company: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip: (page - 1) * take,
      take,
    }),
    db.vehicle.count({ where }),
  ]);
  return { items, total, page, pages: Math.ceil(total / take) };
}
export async function vehicleBySlug(slug: string) {
  return db.vehicle.findUnique({
    where: { slug },
    include: {
      type: true,
      company: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
export async function enforceListingLimit(companyId: string) {
  const subscription = await db.subscription.findFirst({
    where: { companyId, status: "ACTIVE", expiresAt: { gt: new Date() } },
    include: { plan: true },
    orderBy: { expiresAt: "desc" },
  });
  if (!subscription) throw new Error("ACTIVE_SUBSCRIPTION_REQUIRED");
  const listings = await db.vehicle.count({
    where: { companyId, status: { in: ["PUBLISHED", "PENDING_REVIEW", "DRAFT"] } },
  });
  if (listings >= subscription.plan.listingLimit) throw new Error("LISTING_LIMIT_REACHED");
  return subscription;
}
