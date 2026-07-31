"use client";
import { useState } from "react";
export function AdminVehicleActions({ id, current }: { id: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [message, setMessage] = useState<string>();
  async function update(next: "PUBLISHED" | "REJECTED" | "SUSPENDED") {
    if (!window.confirm(`Change vehicle status to ${next.toLowerCase()}?`)) return;
    const response = await fetch(`/api/admin/vehicles/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (response.ok) {
      setStatus(next);
      setMessage("Saved.");
    } else setMessage("Could not save this change.");
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{status}</span>
      {status !== "PUBLISHED" && (
        <button className="text-xs font-bold text-teal" onClick={() => update("PUBLISHED")}>
          Approve
        </button>
      )}
      {status !== "REJECTED" && (
        <button className="text-xs font-bold text-amber-700" onClick={() => update("REJECTED")}>
          Reject
        </button>
      )}
      <button className="text-xs font-bold text-red-700" onClick={() => update("SUSPENDED")}>
        Suspend
      </button>
      {message && (
        <span role="status" className="text-xs text-teal">
          {message}
        </span>
      )}
    </div>
  );
}
