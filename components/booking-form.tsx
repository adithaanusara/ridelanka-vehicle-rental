"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function BookingForm({ vehicleId, dailyRate }: { vehicleId: string; dailyRate: number }) {
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(undefined);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form)),
      headers: { "content-type": "application/json" },
    });
    const payload = await response.json();
    setLoading(false);
    setMessage(
      response.ok
        ? `Booking request sent. Estimated rental total: LKR ${payload.data.estimatedTotal.toLocaleString()}.`
        : payload.error?.message || "Could not send request.",
    );
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">
          Pick-up date
          <input
            required
            name="pickupDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full"
          />
        </label>
        <label className="text-sm font-semibold">
          Return date
          <input
            required
            name="returnDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full"
          />
        </label>
      </div>
      <input required name="pickupLocation" placeholder="Pick-up location" />
      <input required name="customerName" placeholder="Your name" />
      <div className="grid grid-cols-2 gap-3">
        <input required name="phone" placeholder="Phone number" />
        <input required name="email" type="email" placeholder="Email address" />
      </div>
      <textarea name="message" placeholder="Anything the provider should know?" rows={3} />
      <p className="text-xs text-slate-500">
        Estimate uses the daily rate of LKR {dailyRate.toLocaleString()}. Final payment is arranged
        with the provider.
      </p>
      <Button disabled={loading} className="w-full">
        {loading ? "Sending request…" : "Send booking request"}
      </Button>
      {message && (
        <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm text-navy">
          {message}
        </p>
      )}
    </form>
  );
}
