import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page-shell grid min-h-[55vh] place-items-center py-16 text-center">
      <div>
        <p className="eyebrow">Not found</p>
        <h1 className="mt-2 text-4xl font-extrabold text-navy">That road leads nowhere.</h1>
        <p className="mt-3 text-slate-600">
          The page or listing may have moved, expired, or be unavailable.
        </p>
        <Link
          href="/vehicles"
          className="mt-6 inline-block rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white"
        >
          Browse vehicles
        </Link>
      </div>
    </main>
  );
}
