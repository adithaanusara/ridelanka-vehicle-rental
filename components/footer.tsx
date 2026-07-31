import Link from "next/link";
import { brand } from "@/lib/brand";
export function Footer() {
  return (
    <footer id="contact" className="bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold text-white">{brand.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-6">
            A safer, simpler way to discover trusted vehicle rentals across Sri Lanka.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 text-sm">
          <Link href="/vehicles">Browse vehicles</Link>
          <Link href="/companies">Rental companies</Link>
          <Link href="/register?role=PROVIDER">List your vehicles</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <div className="text-sm">
          <p>{brand.supportEmail}</p>
          <p className="mt-2">{brand.supportPhone}</p>
        </div>
      </div>
      <div className="border-t border-slate-700 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
