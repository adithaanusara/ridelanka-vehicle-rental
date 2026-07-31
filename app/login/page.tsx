import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Sign in" };
export default function Login() {
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-12">
      <section className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-lift">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">Sign in to RentHub LK</h1>
        <p className="mt-3 text-sm text-slate-600">
          Manage your rentals, bookings and saved vehicles.
        </p>
        <div className="mt-7">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
