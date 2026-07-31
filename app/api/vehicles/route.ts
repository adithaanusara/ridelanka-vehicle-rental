import { NextRequest } from "next/server";
import { ok, apiError } from "@/lib/http";
import { searchVehicles } from "@/services/vehicle-service";
export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    return ok(
      await searchVehicles({
        district: p.get("district") || undefined,
        type: p.get("type") || undefined,
        minPrice: Number(p.get("minPrice")) || undefined,
        maxPrice: Number(p.get("maxPrice")) || undefined,
        sort: p.get("sort") as "newest" | "price_asc" | "price_desc" | undefined,
        page: Number(p.get("page")) || 1,
      }),
    );
  } catch (error) {
    return apiError(error);
  }
}
