import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscriptionPlans } from "@/components/subscription-plans";
export const dynamic = "force-dynamic";
export default async function SubscriptionPage() {
  const session = await getSession();
  if (!session || session.role !== "PROVIDER") redirect("/login");
  const plans = await db.subscriptionPlan.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });
  return (
    <main className="page-shell py-10">
      <p className="eyebrow">Provider subscriptions</p>
      <h1 className="section-title">Choose a plan to publish vehicles</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Development checkout uses the mock payment provider. No card details are collected or
        stored.
      </p>
      <div className="mt-8">
        <SubscriptionPlans plans={plans} />
      </div>
    </main>
  );
}
