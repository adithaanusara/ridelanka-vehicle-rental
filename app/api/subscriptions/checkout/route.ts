import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { fail, ok, apiError } from "@/lib/http";
import { createPendingSubscription } from "@/services/subscription-service";
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PROVIDER")
      return fail("Provider authentication is required.", 401);
    const body = (await request.json()) as { planId?: string };
    if (!body.planId) return fail("A plan is required.");
    return ok(await createPendingSubscription(session.userId, body.planId), 201);
  } catch (error) {
    return apiError(error);
  }
}
