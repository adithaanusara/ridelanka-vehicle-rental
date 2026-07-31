import { Role } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "renthub_session";
type Session = { userId: string; role: Role; email: string; name: string };
function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export async function createSession(user: Session) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    return (await jwtVerify(token, secret())).payload as unknown as Session;
  } catch {
    return null;
  }
}
export function setSession(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Error("UNAUTHORIZED");
  return session;
}
