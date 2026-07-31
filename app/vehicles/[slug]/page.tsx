import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Car, MapPin, ShieldCheck, Users } from "lucide-react";
import { vehicleBySlug } from "@/services/vehicle-service";
import { formatLkr } from "@/lib/utils";
import { BookingForm } from "@/components/booking-form";

export const dynamic = "force-dynamic";
export default async function VehicleDetails({ params }: { params: Promise<{ slug: string }> }) {
  const vehicle = await vehicleBySlug((await params).slug);
  if (!vehicle || vehicle.status !== "PUBLISHED") notFound();
  const images = vehicle.images.length
    ? vehicle.images
    : [
        {
          id: "placeholder",
          url: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=85",
          alt: vehicle.title,
        },
      ];
  return (
    <main className="page-shell py-10">
      <div className="text-sm text-slate-500">
        <Link href="/vehicles">Vehicles</Link> / {vehicle.title}
      </div>
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.45fr_.8fr]">
        <section>
          <div className="grid h-[420px] grid-cols-2 gap-3 overflow-hidden rounded-2xl">
            {images.slice(0, 3).map((image, index) => (
              <div
                className={
                  index === 0
                    ? "relative col-span-2 h-64 sm:col-span-1 sm:row-span-2 sm:h-auto"
                    : "relative h-[160px] sm:h-auto"
                }
                key={image.id}
              >
                <Image
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={image.url}
                  alt={image.alt || vehicle.title}
                />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{vehicle.type.name}</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
                  {vehicle.title}
                </h1>
                <p className="mt-2 flex items-center gap-1 text-slate-600">
                  <MapPin size={16} />
                  {vehicle.pickupLocation}, {vehicle.city}, {vehicle.district}
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-navy">
                  {formatLkr(vehicle.dailyRate)}{" "}
                  <span className="text-sm font-normal text-slate-500">/ day</span>
                </p>
                {vehicle.weeklyRate && (
                  <p className="mt-1 text-sm text-slate-500">
                    {formatLkr(vehicle.weeklyRate)} / week
                  </p>
                )}
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={<Users size={18} />} label="Seats" value={`${vehicle.seats}`} />
              <Spec
                icon={<Car size={18} />}
                label="Transmission"
                value={vehicle.transmission.toLowerCase()}
              />
              <Spec
                icon={<ShieldCheck size={18} />}
                label="Fuel"
                value={vehicle.fuelType.toLowerCase()}
              />
              <Spec
                icon={<BadgeCheck size={18} />}
                label="Drive"
                value={vehicle.selfDrive ? "Self-drive" : "With driver"}
              />
            </div>
            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-navy">About this vehicle</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {vehicle.description}
              </p>
            </section>
            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-navy">Terms & conditions</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{vehicle.terms}</p>
            </section>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-24 rounded-2xl border bg-white p-5 shadow-lift">
            <h2 className="text-lg font-extrabold text-navy">Request to book</h2>
            <p className="mt-1 text-sm text-slate-600">The provider will confirm availability.</p>
            <div className="mt-5">
              <BookingForm vehicleId={vehicle.id} dailyRate={vehicle.dailyRate} />
            </div>
          </div>
          <Link
            href={`/companies/${vehicle.company.slug}`}
            className="block rounded-2xl border bg-white p-5 hover:shadow-md"
          >
            <p className="text-xs font-bold text-teal">RENTAL PROVIDER</p>
            <div className="mt-2 flex items-center gap-2">
              <h2 className="font-extrabold text-navy">{vehicle.company.name}</h2>
              {vehicle.company.status === "VERIFIED" && (
                <BadgeCheck size={18} className="text-teal" />
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {vehicle.company.city}, {vehicle.company.district}
            </p>
            <p className="mt-4 text-sm font-bold text-teal">View company profile →</p>
          </Link>
        </aside>
      </div>
    </main>
  );
}
function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3">
      <span className="text-teal">{icon}</span>
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold capitalize text-navy">{value}</p>
    </div>
  );
}
