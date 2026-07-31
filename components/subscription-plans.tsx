"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  listingLimit: number;
  recommended: boolean;
  features: unknown;
};
export function SubscriptionPlans({ plans }: { plans: Plan[] }) {
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState<string>();
  async function select(planId: string) {
    setLoading(planId);
    const response = await fetch("/api/subscriptions/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await response.json();
    setLoading(undefined);
    if (!response.ok) return setMessage(data.error?.message || "Could not start checkout.");
    window.location.assign(`/provider/checkout/${data.data.payment.id}`);
  }
  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            className={`relative rounded-2xl border bg-white p-6 ${plan.recommended ? "border-teal shadow-lift" : ""}`}
            key={plan.id}
          >
            {plan.recommended && (
              <span className="absolute -top-3 rounded-full bg-teal px-3 py-1 text-xs font-bold text-white">
                Recommended
              </span>
            )}
            <p className="text-sm font-bold text-teal">{plan.name}</p>
            <p className="mt-3 text-3xl font-extrabold text-navy">
              LKR {plan.price.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {plan.durationMonths} month{plan.durationMonths > 1 ? "s" : ""} · {plan.listingLimit}{" "}
              listings
            </p>
            <p className="mt-4 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              {Array.isArray(plan.features) &&
                plan.features.map((feature) => <li key={String(feature)}>✓ {String(feature)}</li>)}
            </ul>
            <Button
              onClick={() => select(plan.id)}
              disabled={loading === plan.id}
              className="mt-6 w-full"
            >
              {loading === plan.id ? "Creating checkout…" : "Select plan"}
            </Button>
          </article>
        ))}
      </div>
      {message && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {message}
        </p>
      )}
    </>
  );
}
