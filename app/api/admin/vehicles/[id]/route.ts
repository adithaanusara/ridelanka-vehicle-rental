import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, fail, ok } from "@/lib/http";
import { z } from "zod";
const schema = z.object({
  status: z.enum(["PUBLISHED", "REJECTED", "SUSPENDED"]),
  isFeatured: z.boolean().optional(),
  reason: z.string().max(500).optional(),
});
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN")
      return fail("Administrator authentication is required.", 401);
    const value = schema.parse(await request.json());
    const vehicle = await db.$transaction(async (tx) => {
      const updated = await tx.vehicle.update({
        where: { id: (await params).id },
        data: { status: value.status, isFeatured: value.isFeatured },
      });
      await tx.adminAuditLog.create({
        data: {
          adminId: session.userId,
          action: `VEHICLE_${value.status}`,
          entityType: "Vehicle",
          entityId: updated.id,
          metadata: { reason: value.reason },
        },
      });
      return updated;
    });
    return ok(vehicle);
  } catch (error) {
    return apiError(error);
  }
}
