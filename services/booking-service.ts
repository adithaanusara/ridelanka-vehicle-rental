import { BookingStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validation";

export async function createBooking(customerId: string, input: unknown) {
  const value = bookingSchema.parse(input);
  const vehicle = await db.vehicle.findFirst({
    where: { id: value.vehicleId, status: "PUBLISHED" },
  });
  if (!vehicle) throw new Error("VEHICLE_UNAVAILABLE");
  const overlapping = await db.booking.findFirst({
    where: {
      vehicleId: value.vehicleId,
      status: { in: [BookingStatus.ACCEPTED, BookingStatus.CONFIRMED] },
      pickupDate: { lt: value.returnDate },
      returnDate: { gt: value.pickupDate },
    },
  });
  if (overlapping) throw new Error("DATES_UNAVAILABLE");
  const days = Math.ceil((value.returnDate.getTime() - value.pickupDate.getTime()) / 86_400_000);
  return db.booking.create({
    data: { ...value, customerId, estimatedTotal: days * vehicle.dailyRate },
  });
}
export async function changeBookingStatus(
  providerId: string,
  bookingId: string,
  status: BookingStatus,
) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { vehicle: { include: { company: true } } },
  });
  if (!booking || booking.vehicle.company.ownerId !== providerId) throw new Error("FORBIDDEN");
  if (status === "ACCEPTED" || status === "CONFIRMED") {
    const overlap = await db.booking.findFirst({
      where: {
        id: { not: bookingId },
        vehicleId: booking.vehicleId,
        status: { in: ["ACCEPTED", "CONFIRMED"] },
        pickupDate: { lt: booking.returnDate },
        returnDate: { gt: booking.pickupDate },
      },
    });
    if (overlap) throw new Error("DATES_UNAVAILABLE");
  }
  return db.booking.update({ where: { id: bookingId }, data: { status } });
}
