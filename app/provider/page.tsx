import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";
export const dynamic = "force-dynamic";
export default async function ProviderDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PROVIDER") redirect("/dashboard");
  const company = await db.rentalCompany.findUnique({
    where: { ownerId: session.userId },
    include: {
      vehicles: true,
      subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!company) redirect("/register?role=PROVIDER");
  const subscription = company.subscriptions[0];
  const bookingCount = await db.booking.count({
    where: { vehicle: { companyId: company.id }, status: "PENDING" },
  });
  return (
    <main className="page-shell py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Provider dashboard</p>
          <h1 className="section-title">{company.name}</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <Stat
          label="Active vehicles"
          value={company.vehicles.filter((item) => item.status === "PUBLISHED").length}
        />
        <Stat
          label="Pending review"
          value={company.vehicles.filter((item) => item.status === "PENDING_REVIEW").length}
        />
        <Stat label="Booking requests" value={bookingCount} />
        <Stat
          label="Listing usage"
          value={`${company.vehicles.length}/${subscription?.plan.listingLimit || 0}`}
        />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">Subscription</h2>
          {subscription?.status === "ACTIVE" ? (
            <>
              <p className="mt-3 font-bold text-teal">Active · {subscription.plan.name}</p>
              <p className="mt-1 text-sm text-slate-600">
                Expires {subscription.expiresAt?.toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-slate-600">
                You need an active subscription before publishing vehicles.
              </p>
              <Link
                href="/provider/subscription"
                className="mt-5 inline-block rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white"
              >
                Choose a plan
              </Link>
            </>
          )}
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">Quick actions</h2>
          <div className="mt-4 grid gap-3">
            <Link
              className="rounded-xl bg-sky-50 p-3 text-sm font-bold text-navy"
              href="/provider/vehicles/new"
            >
              Add a vehicle
            </Link>
            <Link
              className="rounded-xl bg-sky-50 p-3 text-sm font-bold text-navy"
              href="/provider/subscription"
            >
              Manage subscription
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
function Stat({ label, value }: { label: string | number; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-2xl font-extrabold text-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
