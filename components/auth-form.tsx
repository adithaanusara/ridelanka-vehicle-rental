"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { districts } from "@/lib/catalog";
export function AuthForm({
  mode,
  defaultRole = "CUSTOMER",
}: {
  mode: "login" | "register";
  defaultRole?: "CUSTOMER" | "PROVIDER";
}) {
  const [role, setRole] = useState(defaultRole);
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form);
    const payload =
      mode === "login"
        ? data
        : {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role,
            company:
              role === "PROVIDER"
                ? {
                    name: data.companyName,
                    district: data.district,
                    city: data.city,
                    address: data.address,
                    whatsapp: data.whatsapp,
                    description: data.description,
                  }
                : undefined,
          };
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(result.error?.message || "Unable to continue.");
    window.location.href =
      mode === "login"
        ? result.data.role === "ADMIN"
          ? "/admin"
          : result.data.role === "PROVIDER"
            ? "/provider"
            : "/dashboard"
        : role === "PROVIDER"
          ? "/provider"
          : "/dashboard";
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`rounded-xl border p-3 text-sm font-bold ${role === "CUSTOMER" ? "border-teal bg-sky-50 text-navy" : "text-slate-600"}`}
            >
              I need a vehicle
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`rounded-xl border p-3 text-sm font-bold ${role === "PROVIDER" ? "border-teal bg-sky-50 text-navy" : "text-slate-600"}`}
            >
              I rent vehicles
            </button>
          </div>
          <input required name="name" placeholder="Full name" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required name="email" type="email" placeholder="Email address" />
            <input required name="phone" placeholder="Phone number" />
          </div>
        </>
      )}
      {mode === "login" && (
        <input required name="email" type="email" placeholder="Email address" className="w-full" />
      )}
      <input
        required
        name="password"
        type="password"
        placeholder="Password"
        minLength={mode === "register" ? 10 : 1}
      />
      {role === "PROVIDER" && mode === "register" && (
        <fieldset className="space-y-3 rounded-xl bg-slate-50 p-4">
          <legend className="px-1 text-sm font-bold text-navy">Rental business details</legend>
          <input required name="companyName" placeholder="Company name" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select required name="district">
              <option value="">District</option>
              {districts.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input required name="city" placeholder="City" />
          </div>
          <input required name="address" placeholder="Business address" />
          <input required name="whatsapp" placeholder="WhatsApp number" />
          <textarea name="description" placeholder="Short company description" rows={3} />
        </fieldset>
      )}
      <Button className="w-full" disabled={loading}>
        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>
      {message && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {message}
        </p>
      )}
      <p className="text-center text-sm text-slate-600">
        {mode === "login" ? (
          <>
            New to RentHub LK?{" "}
            <Link href="/register" className="font-bold text-teal">
              Create account
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/login" className="font-bold text-teal">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
