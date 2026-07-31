import { addMonths } from "@/services/time";
import { db } from "@/lib/db";

export async function createPendingSubscription(userId: string, planId: string) {
  const company = await db.rentalCompany.findUnique({ where: { ownerId: userId } });
  const plan = await db.subscriptionPlan.findFirst({ where: { id: planId, active: true } });
  if (!company || !plan) throw new Error("INVALID_SUBSCRIPTION_REQUEST");
  const reference = `RHLK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  return db.$transaction(async (tx) => {
    const subscription = await tx.subscription.create({
      data: {
        companyId: company.id,
        planId: plan.id,
        amountPaid: plan.price,
        currency: plan.currency,
        planSnapshot: {
          name: plan.name,
          code: plan.code,
          durationMonths: plan.durationMonths,
          listingLimit: plan.listingLimit,
          featuredListingLimit: plan.featuredListingLimit,
          features: plan.features,
        },
      },
    });
    const payment = await tx.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        reference,
        provider: process.env.PAYMENT_PROVIDER || "mock",
        amount: plan.price,
        currency: plan.currency,
        idempotencyKey: crypto.randomUUID(),
      },
    });
    return { subscription, payment };
  });
}
export async function completeMockPayment(userId: string, paymentId: string, success: boolean) {
  const payment = await db.payment.findFirst({
    where: { id: paymentId, userId },
    include: { subscription: { include: { plan: true } } },
  });
  if (!payment || payment.status !== "PENDING") throw new Error("INVALID_PAYMENT");
  if (!success)
    return db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", providerReference: `mock_failed_${payment.id}` },
    });
  const startsAt = new Date();
  const expiresAt = addMonths(startsAt, payment.subscription.plan.durationMonths);
  return db.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { id: payment.subscriptionId },
      data: { status: "ACTIVE", startsAt, expiresAt },
    });
    return tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED", providerReference: `mock_${payment.id}` },
    });
  });
}
export async function expireSubscriptions() {
  const expired = await db.subscription.findMany({
    where: { status: "ACTIVE", expiresAt: { lte: new Date() } },
    select: { id: true, companyId: true },
  });
  if (!expired.length) return 0;
  await db.$transaction(async (tx) => {
    for (const item of expired) {
      await tx.subscription.update({ where: { id: item.id }, data: { status: "EXPIRED" } });
      await tx.vehicle.updateMany({
        where: { companyId: item.companyId, status: "PUBLISHED" },
        data: { status: "SUSPENDED" },
      });
    }
  });
  return expired.length;
}
