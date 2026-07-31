import Link from "next/link";
import { CarFront, Plus } from "lucide-react";
import { getSession } from "@/lib/auth";
import { brand } from "@/lib/brand";

export async function Header() {
  const session = await getSession();
  const dashboard =
    session?.role === "ADMIN"
      ? "/admin"
      : session?.role === "PROVIDER"
        ? "/provider"
        : "/dashboard";
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy"
          href="/"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-sky-500 text-white">
            <CarFront size={20} />
          </span>
          {brand.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/vehicles">Browse vehicles</Link>
          <Link href="/companies">Rental companies</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <Link
              href={dashboard}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-navy"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-bold text-navy sm:block">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/register?role=PROVIDER"
            className="hidden items-center gap-1 rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white lg:flex"
          >
            <Plus size={16} />
            List your vehicle
          </Link>
        </div>
      </div>
    </header>
  );
}
