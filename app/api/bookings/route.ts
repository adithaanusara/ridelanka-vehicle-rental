import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, fail, ok } from "@/lib/http";
import { createBooking } from "@/services/booking-service";
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return fail("Please log in before submitting a booking request.", 401);
    if (session.role !== "CUSTOMER")
      return fail("Only customer accounts can submit booking requests.", 403);
    return ok(await createBooking(session.userId, await request.json()), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "DATES_UNAVAILABLE")
      return fail("Those dates are no longer available for this vehicle.", 409);
    if (error instanceof Error && error.message === "VEHICLE_UNAVAILABLE")
      return fail("This vehicle is not available.", 404);
    return apiError(error);
  }
}
