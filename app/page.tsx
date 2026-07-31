import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { VehicleCard } from "@/components/vehicle-card";
import { db } from "@/lib/db";
import { districts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
async function homeData() {
  try {
    const [vehicles, types, plans] = await Promise.all([
      db.vehicle.findMany({
        where: { status: "PUBLISHED" },
        take: 4,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        include: { type: true, company: true, images: { take: 1 }, reviews: true },
      }),
      db.vehicleType.findMany({
        where: { active: true },
        take: 6,
        orderBy: { displayOrder: "asc" },
      }),
      db.subscriptionPlan.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    ]);
    return { vehicles, types, plans };
  } catch {
    return { vehicles: [], types: [], plans: [] };
  }
}
export default async function Home() {
  const { vehicles, types, plans } = await homeData();
  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-navy via-[#0b3154] to-teal">
        <div className="page-shell grid min-h-[570px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10">
            <p className="eyebrow text-sky-300">Sri Lanka’s rental marketplace</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              The right ride for <span className="text-sky-300">every road.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Find trusted rental cars, vans, SUVs and more from verified local providers in the
              district you need.
            </p>
            <div className="mt-9">
              <SearchForm />
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-sky-300" />
                Verified providers
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays size={18} className="text-sky-300" />
                Simple booking requests
              </span>
            </div>
          </div>
          <div className="relative h-[390px] lg:h-[480px]">
            <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-sky-400/30 blur-3xl" />
            <Image
              priority
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="rounded-[2rem] object-cover shadow-2xl"
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
              alt="A rental vehicle on an open road"
            />
            <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white px-5 py-4 shadow-lift">
              <p className="text-2xl font-extrabold text-navy">4.9/5</p>
              <p className="text-xs font-semibold text-slate-500">Trusted by local travellers</p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-20">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Find your fit</p>
            <h2 className="section-title">Popular vehicle categories</h2>
          </div>
          <Link className="hidden items-center gap-2 font-bold text-teal sm:flex" href="/vehicles">
            Browse all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {types.length ? (
            types.map((type) => (
              <Link
                key={type.id}
                href={`/vehicles?type=${type.slug}`}
                className="rounded-2xl border bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-lift"
              >
                <p className="text-2xl">
                  {type.name === "Motorcycle"
                    ? "🏍️"
                    : type.name === "Van"
                      ? "🚐"
                      : type.name === "SUV"
                        ? "🚙"
                        : "🚗"}
                </p>
                <p className="mt-3 font-bold text-navy">{type.name}</p>
              </Link>
            ))
          ) : (
            <p className="col-span-full muted">
              Vehicle categories appear here after database seeding.
            </p>
          )}
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="page-shell">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Ready to go</p>
              <h2 className="section-title">Featured vehicles</h2>
            </div>
            <Link className="font-bold text-teal" href="/vehicles">
              View all vehicles →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          {!vehicles.length && (
            <div className="mt-8 rounded-2xl border border-dashed p-10 text-center muted">
              No published vehicles yet. Run the seed command to load the development marketplace.
            </div>
          )}
        </div>
      </section>
      <section id="about" className="page-shell grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Why RentHub LK</p>
          <h2 className="section-title">A better way to rent, without the uncertainty.</h2>
          <p className="mt-5 max-w-xl leading-7 muted">
            Every listing is tied to a real rental provider. Compare options, ask questions and book
            with a clearer view of who you are renting from.
          </p>
          <Link
            href="/companies"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white"
          >
            Meet rental companies <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-sky-50 p-6">
            <BadgeCheck className="text-teal" />
            <h3 className="mt-4 font-bold text-navy">Verified profiles</h3>
            <p className="mt-2 text-sm leading-6 muted">
              Providers are reviewed before they earn their badge.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-6">
            <MapPin className="text-teal" />
            <h3 className="mt-4 font-bold text-navy">Local discovery</h3>
            <p className="mt-2 text-sm leading-6 muted">
              Search exactly where your journey starts.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-6">
            <CalendarDays className="text-teal" />
            <h3 className="mt-4 font-bold text-navy">Clear requests</h3>
            <p className="mt-2 text-sm leading-6 muted">
              Send dates and details directly to your provider.
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-6">
            <ShieldCheck className="text-teal" />
            <h3 className="mt-4 font-bold text-navy">Built for trust</h3>
            <p className="mt-2 text-sm leading-6 muted">
              Account and booking workflows designed for safety.
            </p>
          </div>
        </div>
      </section>
      <section id="pricing" className="bg-navy py-20">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-sky-300">For rental providers</p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
              Grow your rental business with us.
            </h2>
            <p className="mt-4 text-slate-300">
              A subscription is needed only when you are ready to publish vehicles.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative rounded-2xl p-7 ${plan.recommended ? "bg-white shadow-lift" : "border border-slate-700 bg-white/5 text-white"}`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 rounded-full bg-teal px-3 py-1 text-xs font-bold text-white">
                    Recommended
                  </span>
                )}
                <p
                  className={`text-sm font-bold ${plan.recommended ? "text-teal" : "text-sky-300"}`}
                >
                  {plan.name}
                </p>
                <p
                  className={`mt-4 text-3xl font-extrabold ${plan.recommended ? "text-navy" : "text-white"}`}
                >
                  LKR {plan.price.toLocaleString()}
                </p>
                <p
                  className={`mt-1 text-sm ${plan.recommended ? "text-slate-500" : "text-slate-300"}`}
                >
                  per {plan.durationMonths} month{plan.durationMonths > 1 ? "s" : ""}
                </p>
                <p
                  className={`mt-5 text-sm ${plan.recommended ? "text-slate-600" : "text-slate-300"}`}
                >
                  {plan.description}
                </p>
                <Link
                  href="/register?role=PROVIDER"
                  className={`mt-7 block rounded-xl px-4 py-3 text-center text-sm font-bold ${plan.recommended ? "bg-navy text-white" : "bg-white text-navy"}`}
                >
                  Choose plan
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell py-20">
        <p className="eyebrow">Everywhere you need us</p>
        <h2 className="section-title">Popular rental districts</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {districts.slice(0, 12).map((district) => (
            <Link
              className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal"
              href={`/vehicles?district=${district}`}
              key={district}
            >
              {district}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
