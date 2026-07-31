import { notFound } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, MapPin, Phone, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { VehicleCard } from "@/components/vehicle-card";
export const dynamic = "force-dynamic";
export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const company = await db.rentalCompany.findUnique({
    where: { slug: (await params).slug },
    include: {
      vehicles: {
        where: { status: "PUBLISHED" },
        include: { type: true, company: true, images: { take: 1 }, reviews: true },
      },
    },
  });
  if (!company) notFound();
  return (
    <main>
      <section className="relative h-64 bg-navy">
        {company.coverUrl && (
          <Image src={company.coverUrl} alt="" fill className="object-cover opacity-60" />
        )}
        <div className="page-shell relative flex h-full items-end pb-9">
          <div className="text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold">{company.name}</h1>
              {company.status === "VERIFIED" && <BadgeCheck className="text-sky-300" />}
            </div>
            <p className="mt-2 flex items-center gap-1 text-slate-200">
              <MapPin size={16} />
              {company.city}, {company.district}
            </p>
          </div>
        </div>
      </section>
      <div className="page-shell grid gap-8 py-10 lg:grid-cols-[1.4fr_.6fr]">
        <section>
          <h2 className="text-2xl font-extrabold text-navy">Available vehicles</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {company.vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
        <aside className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">About {company.name}</h2>
          <p className="mt-3 leading-7 text-slate-600">
            {company.description || "This local provider has not added a description yet."}
          </p>
          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <p className="flex gap-2">
              <Phone size={16} className="text-teal" />
              {company.telephone || company.whatsapp}
            </p>
            <a
              className="flex gap-2 font-bold text-teal"
              href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
            >
              <MessageCircle size={16} />
              WhatsApp this provider
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
