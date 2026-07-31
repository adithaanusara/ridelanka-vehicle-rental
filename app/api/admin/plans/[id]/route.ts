import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, fail, ok } from "@/lib/http";
import { z } from "zod";
const schema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(500),
  price: z.number().int().positive(),
  durationMonths: z.number().int().positive().max(24),
  listingLimit: z.number().int().positive(),
  featuredListingLimit: z.number().int().min(0),
  active: z.boolean(),
  recommended: z.boolean(),
  displayOrder: z.number().int().min(0),
  features: z.array(z.string().min(1)).max(15),
});
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN")
      return fail("Administrator authentication is required.", 401);
    const value = schema.parse(await request.json());
    const plan = await db.$transaction(async (tx) => {
      const updated = await tx.subscriptionPlan.update({
        where: { id: (await params).id },
        data: value,
      });
      await tx.adminAuditLog.create({
        data: {
          adminId: session.userId,
          action: "PLAN_UPDATED",
          entityType: "SubscriptionPlan",
          entityId: updated.id,
        },
      });
      return updated;
    });
    return ok(plan);
  } catch (error) {
    return apiError(error);
  }
}
