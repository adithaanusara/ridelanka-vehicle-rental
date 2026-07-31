import { NextRequest, NextResponse } from "next/server";
import { createSession, setSession } from "@/lib/auth";
import { apiError, fail } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { register } from "@/services/auth-service";
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`register:${request.headers.get("x-forwarded-for") || "local"}`, 5))
      return fail("Too many attempts. Please try again shortly.", 429);
    const user = await register(await request.json());
    const response = NextResponse.json({ data: { id: user.id, role: user.role } }, { status: 201 });
    setSession(
      response,
      await createSession({ userId: user.id, role: user.role, email: user.email, name: user.name }),
    );
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS")
      return fail("Unable to create the account with those details.", 409);
    return apiError(error);
  }
}
