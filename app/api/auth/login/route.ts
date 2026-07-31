import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/services/auth-service";
import { createSession, setSession } from "@/lib/auth";
import { fail } from "@/lib/http";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`login:${request.headers.get("x-forwarded-for") || "local"}`, 8))
      return fail("Too many attempts. Please try again shortly.", 429);
    const input = loginSchema.parse(await request.json());
    const user = await authenticate(input.email, input.password);
    if (!user) return fail("Invalid email or password.", 401);
    const response = NextResponse.json({ data: { role: user.role } });
    setSession(
      response,
      await createSession({ userId: user.id, role: user.role, email: user.email, name: user.name }),
    );
    return response;
  } catch {
    return fail("Invalid email or password.", 401);
  }
}
