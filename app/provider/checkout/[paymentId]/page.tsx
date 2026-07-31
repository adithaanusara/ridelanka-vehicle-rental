import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MockCheckout } from "@/components/mock-checkout";
export const dynamic = "force-dynamic";
export default async function Checkout({ params }: { params: Promise<{ paymentId: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "PROVIDER") redirect("/login");
  const payment = await db.payment.findFirst({
    where: { id: (await params).paymentId, userId: session.userId },
    include: { subscription: { include: { plan: true } } },
  });
  if (!payment || payment.status !== "PENDING") notFound();
  return (
    <main className="page-shell grid min-h-[65vh] place-items-center py-10">
      <section className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-lift">
        <p className="eyebrow">Mock payment</p>
        <h1 className="mt-2 text-2xl font-extrabold text-navy">Complete test checkout</h1>
        <div className="mt-6">
          <MockCheckout
            paymentId={payment.id}
            amount={payment.amount}
            plan={payment.subscription.plan.name}
          />
        </div>
      </section>
    </main>
  );
}
