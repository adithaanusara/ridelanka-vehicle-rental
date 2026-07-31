import { describe, expect, it } from "vitest";
import { bookingSchema, registrationSchema } from "@/lib/validation";
import { addMonths } from "@/services/time";
describe("booking validation", () => {
  it("rejects an invalid rental date range", () => {
    expect(() =>
      bookingSchema.parse({
        vehicleId: "ck123456789012345678901234",
        pickupDate: "2026-08-10",
        returnDate: "2026-08-10",
        pickupLocation: "Colombo",
        customerName: "Test User",
        phone: "+94770000000",
        email: "test@example.com",
      }),
    ).toThrow();
  });
  it("accepts a valid booking request", () => {
    expect(
      bookingSchema.safeParse({
        vehicleId: "ck123456789012345678901234",
        pickupDate: "2026-08-10",
        returnDate: "2026-08-12",
        pickupLocation: "Colombo",
        customerName: "Test User",
        phone: "+94770000000",
        email: "test@example.com",
      }).success,
    ).toBe(true);
  });
});
describe("provider registration", () => {
  it("requires provider company details", () => {
    expect(
      registrationSchema.safeParse({
        name: "Provider",
        email: "provider@example.com",
        phone: "+94770000000",
        password: "LongPassword123",
        role: "PROVIDER",
      }).success,
    ).toBe(false);
  });
});
describe("subscription timing", () => {
  it("adds subscription months", () => {
    expect(addMonths(new Date("2026-01-15"), 6).toISOString().slice(0, 10)).toBe("2026-07-15");
  });
});
