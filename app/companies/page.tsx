import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
type CompanyWithVehicles = Prisma.RentalCompanyGetPayload<{
  include: { vehicles: { select: { id: true } } };
}>;
export default async function Companies() {
  let companies: CompanyWithVehicles[] = [];
  try {
    companies = await db.rentalCompany.findMany({
      where: { status: "VERIFIED" },
      include: { vehicles: { where: { status: "PUBLISHED" }, select: { id: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {}
  return (
    <main className="page-shell py-12">
      <p className="eyebrow">Trusted local partners</p>
      <h1 className="section-title">Rental companies</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Browse businesses verified by RentHub LK and see their available vehicles.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 text-xl font-extrabold text-teal">
                {company.name[0]}
              </div>
              <BadgeCheck className="text-teal" />
            </div>
            <h2 className="mt-5 text-lg font-extrabold text-navy">{company.name}</h2>
            <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
              <MapPin size={15} />
              {company.city}, {company.district}
            </p>
            <p className="mt-5 text-sm font-bold text-teal">
              {company.vehicles.length} active vehicles →
            </p>
          </Link>
        ))}
      </div>
      {!companies.length && (
        <div className="mt-8 rounded-2xl border border-dashed bg-white p-12 text-center text-slate-600">
          Verified companies will appear here after seed data is loaded.
        </div>
      )}
    </main>
  );
}
