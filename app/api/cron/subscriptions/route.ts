import { NextRequest } from "next/server";
import { fail, ok, apiError } from "@/lib/http";
import { expireSubscriptions } from "@/services/subscription-service";
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET)
      return fail("Unauthorized.", 401);
    return ok({ expiredSubscriptions: await expireSubscriptions() });
  } catch (error) {
    return apiError(error);
  }
}
