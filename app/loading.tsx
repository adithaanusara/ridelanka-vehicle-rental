export default function Loading() {
  return (
    <main className="page-shell py-16">
      <div className="skeleton h-12 w-72" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="skeleton h-80" />
        <div className="skeleton h-80" />
        <div className="skeleton h-80" />
      </div>
    </main>
  );
}
