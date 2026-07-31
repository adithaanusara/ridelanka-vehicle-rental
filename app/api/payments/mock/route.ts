import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { fail, ok, apiError } from "@/lib/http";
import { completeMockPayment } from "@/services/subscription-service";
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PROVIDER")
      return fail("Provider authentication is required.", 401);
    const body = (await request.json()) as { paymentId?: string; success?: boolean };
    if (!body.paymentId || typeof body.success !== "boolean")
      return fail("Invalid mock payment request.");
    return ok(await completeMockPayment(session.userId, body.paymentId, body.success));
  } catch (error) {
    return apiError(error);
  }
}
