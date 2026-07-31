"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function MockCheckout({
  paymentId,
  amount,
  plan,
}: {
  paymentId: string;
  amount: number;
  plan: string;
}) {
  const [message, setMessage] = useState<string>();
  const [working, setWorking] = useState(false);
  async function pay(success: boolean) {
    setWorking(true);
    const response = await fetch("/api/payments/mock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentId, success }),
    });
    const data = await response.json();
    setWorking(false);
    if (!response.ok) return setMessage(data.error?.message || "Unable to complete test payment.");
    window.location.href = `/provider?payment=${success ? "success" : "failed"}`;
  }
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <p>
          <b>Plan:</b> {plan}
        </p>
        <p className="mt-2">
          <b>Amount:</b> LKR {amount.toLocaleString()}
        </p>
        <p className="mt-2 text-slate-600">
          This is a mock checkout. Do not enter real card details.
        </p>
      </div>
      <Button disabled={working} onClick={() => pay(true)} className="w-full bg-teal">
        {working ? "Processing…" : "Simulate successful payment"}
      </Button>
      <button
        disabled={working}
        onClick={() => pay(false)}
        className="w-full rounded-xl border px-5 py-3 text-sm font-bold text-slate-600"
      >
        Simulate failed payment
      </button>
      {message && (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
