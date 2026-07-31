import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";
import { AdminVehicleActions } from "@/components/admin-vehicle-actions";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");
  const [users, providers, vehicles, bookings, payments, plans] = await Promise.all([
    db.user.count(),
    db.rentalCompany.count({ where: { status: "VERIFIED" } }),
    db.vehicle.count(),
    db.booking.count(),
    db.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    db.subscriptionPlan.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);
  const pending = await db.vehicle.findMany({
    where: { status: "PENDING_REVIEW" },
    take: 10,
    orderBy: { createdAt: "asc" },
    include: { company: true },
  });
  return (
    <main className="page-shell py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Administrator dashboard</p>
          <h1 className="section-title">Marketplace operations</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Users" value={users} />
        <Stat label="Verified providers" value={providers} />
        <Stat label="Vehicles" value={vehicles} />
        <Stat label="Bookings" value={bookings} />
        <Stat label="Payment total" value={`LKR ${(payments._sum.amount || 0).toLocaleString()}`} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">Vehicle moderation</h2>
          {pending.length ? (
            <div className="mt-4 space-y-4">
              {pending.map((vehicle) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                  key={vehicle.id}
                >
                  <div>
                    <p className="font-bold text-navy">{vehicle.title}</p>
                    <p className="text-xs text-slate-500">{vehicle.company.name}</p>
                  </div>
                  <AdminVehicleActions id={vehicle.id} current={vehicle.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No listings awaiting review.</p>
          )}
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">Subscription plans</h2>
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <div className="rounded-xl bg-slate-50 p-3" key={plan.id}>
                <p className="font-bold text-navy">
                  {plan.name} · LKR {plan.price.toLocaleString()}
                </p>
                <p className="text-xs text-slate-600">
                  {plan.durationMonths} month(s), {plan.listingLimit} listings ·{" "}
                  {plan.active ? "Active" : "Hidden"}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Plan changes use the protected admin API and preserve historical subscription price
            snapshots.
          </p>
        </section>
      </div>
    </main>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <p className="text-xl font-extrabold text-navy">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{label}</p>
    </div>
  );
}
