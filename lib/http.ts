import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}
export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}
export function apiError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED")
    return fail("Authentication is required.", 401);
  if (error instanceof Error && error.message === "FORBIDDEN")
    return fail("You do not have permission for this action.", 403);
  return fail("We could not complete that request.", 500);
}
