import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Create account" };
export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const provider = (await searchParams).role === "PROVIDER";
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-12">
      <section className="w-full max-w-xl rounded-2xl border bg-white p-7 shadow-lift">
        <p className="eyebrow">Join RentHub LK</p>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">Create your account</h1>
        <p className="mt-3 text-sm text-slate-600">
          {provider
            ? "Create your provider profile. You can choose a subscription when you are ready to publish."
            : "Search, save and request your next rental vehicle."}
        </p>
        <div className="mt-7">
          <AuthForm mode="register" defaultRole={provider ? "PROVIDER" : "CUSTOMER"} />
        </div>
      </section>
    </main>
  );
}
