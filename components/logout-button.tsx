"use client";
export function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
      className="rounded-xl border px-4 py-2 text-sm font-bold text-navy"
    >
      Sign out
    </button>
  );
}
