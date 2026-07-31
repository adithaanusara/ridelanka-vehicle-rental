import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { VehicleCreateForm } from "@/components/vehicle-create-form";
export const dynamic = "force-dynamic";
export default async function NewVehicle() {
  const session = await getSession();
  if (!session || session.role !== "PROVIDER") redirect("/login");
  const types = await db.vehicleType.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { displayOrder: "asc" },
  });
  return (
    <main className="page-shell py-10">
      <p className="eyebrow">Vehicle management</p>
      <h1 className="section-title">Add a vehicle</h1>
      <p className="mt-3 text-slate-600">
        New listings are submitted for administrator review before publication.
      </p>
      <section className="mt-7 rounded-2xl border bg-white p-6">
        <VehicleCreateForm types={types} />
      </section>
    </main>
  );
}
