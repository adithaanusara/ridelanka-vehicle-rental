import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "PROVIDER") redirect("/provider");
  if (session.role === "ADMIN") redirect("/admin");
  const [bookings, favorites] = await Promise.all([
    db.booking.findMany({
      where: { customerId: session.userId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    }),
    db.favorite.findMany({ where: { userId: session.userId }, include: { vehicle: true } }),
  ]);
  return (
    <main className="page-shell py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Customer dashboard</p>
          <h1 className="section-title">Hello, {session.name}</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Stat label="Booking requests" value={bookings.length} />
        <Stat label="Saved vehicles" value={favorites.length} />
        <Stat
          label="Completed journeys"
          value={bookings.filter((booking) => booking.status === "COMPLETED").length}
        />
      </div>
      <section className="mt-10 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-extrabold text-navy">Your booking requests</h2>
        {bookings.length ? (
          <div className="mt-4 divide-y">
            {bookings.map((booking) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 py-4"
                key={booking.id}
              >
                <div>
                  <p className="font-bold text-navy">{booking.vehicle.title}</p>
                  <p className="text-sm text-slate-600">
                    {booking.pickupDate.toLocaleDateString()} –{" "}
                    {booking.returnDate.toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-teal">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-600">
            You have no booking requests yet.{" "}
            <Link className="font-bold text-teal" href="/vehicles">
              Browse vehicles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-3xl font-extrabold text-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
