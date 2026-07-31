"use client";
import { FormEvent, useState } from "react";
import { districts } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
export function VehicleCreateForm({ types }: { types: { id: string; name: string }[] }) {
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(form),
      year: Number(form.get("year")),
      dailyRate: Number(form.get("dailyRate")),
      weeklyRate: form.get("weeklyRate") ? Number(form.get("weeklyRate")) : undefined,
      seats: Number(form.get("seats")),
      selfDrive: form.get("selfDrive") === "on",
      driverAvailable: form.get("driverAvailable") === "on",
    };
    setLoading(true);
    const response = await fetch("/api/provider/vehicles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error?.message || "Could not create listing.");
    setMessage("Vehicle submitted for admin review.");
    event.currentTarget.reset();
  }
  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <input required name="title" placeholder="Listing title" />
      <select required name="typeId">
        <option value="">Vehicle type</option>
        {types.map((type) => (
          <option value={type.id} key={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <input required name="brand" placeholder="Brand" />
      <input required name="model" placeholder="Model" />
      <input required name="year" type="number" min="1950" placeholder="Year" />
      <input required name="seats" type="number" min="1" placeholder="Seats" />
      <select required name="district">
        <option value="">District</option>
        {districts.map((district) => (
          <option key={district}>{district}</option>
        ))}
      </select>
      <input required name="city" placeholder="City" />
      <input required name="pickupLocation" placeholder="Pickup location" />
      <input required name="dailyRate" type="number" min="1" placeholder="Daily rate (LKR)" />
      <input name="weeklyRate" type="number" min="1" placeholder="Weekly rate (optional)" />
      <div className="grid grid-cols-2 gap-3">
        <select required name="transmission">
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>
        <select required name="fuelType">
          <option value="PETROL">Petrol</option>
          <option value="DIESEL">Diesel</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ELECTRIC">Electric</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input defaultChecked name="selfDrive" type="checkbox" />
        Self-drive available
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="driverAvailable" type="checkbox" />
        Driver available
      </label>
      <textarea
        required
        name="description"
        rows={4}
        className="md:col-span-2"
        placeholder="Describe the vehicle (minimum 20 characters)"
      />
      <textarea
        required
        name="terms"
        rows={3}
        className="md:col-span-2"
        placeholder="Rental terms and conditions"
      />
      <div className="md:col-span-2">
        <Button disabled={loading}>{loading ? "Submitting…" : "Submit for review"}</Button>
        {message && (
          <p role="status" className="mt-3 text-sm text-teal">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
