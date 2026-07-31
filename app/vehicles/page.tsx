import Link from "next/link";
import { searchVehicles } from "@/services/vehicle-service";
import { VehicleCard } from "@/components/vehicle-card";
import { districts, vehicleTypeNames } from "@/lib/catalog";

export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const value = (input: string | string[] | undefined) =>
  typeof input === "string" ? input : undefined;
export default async function VehiclesPage({ searchParams }: Props) {
  const params = await searchParams;
  const district = value(params.district);
  const type = value(params.type);
  const page = Number(value(params.page) || 1);
  let result;
  try {
    result = await searchVehicles({
      district,
      type,
      minPrice: Number(value(params.minPrice)) || undefined,
      maxPrice: Number(value(params.maxPrice)) || undefined,
      sort: value(params.sort) as "newest" | "price_asc" | "price_desc" | undefined,
      page,
    });
  } catch {
    result = { items: [], total: 0, page: 1, pages: 0 };
  }
  return (
    <main className="page-shell py-12">
      <p className="eyebrow">Browse rentals</p>
      <h1 className="section-title">Find a vehicle for your journey</h1>
      <form className="mt-8 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-5">
        <select name="district" defaultValue={district}>
          <option value="">All districts</option>
          {districts.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select name="type" defaultValue={type}>
          <option value="">All types</option>
          {vehicleTypeNames.map((item) => (
            <option value={item.toLowerCase().replace(/[^a-z0-9]+/g, "-")} key={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          name="minPrice"
          type="number"
          min="0"
          placeholder="Min daily price"
          defaultValue={value(params.minPrice)}
        />
        <input
          name="maxPrice"
          type="number"
          min="0"
          placeholder="Max daily price"
          defaultValue={value(params.maxPrice)}
        />
        <button className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white">
          Apply filters
        </button>
      </form>
      <div className="mt-9 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {result.total} vehicle{result.total === 1 ? "" : "s"} found
        </p>
        <form>
          <input type="hidden" name="district" value={district || ""} />
          <input type="hidden" name="type" value={type || ""} />
          <select
            name="sort"
            defaultValue={value(params.sort) || "newest"}
            className="py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Lowest price</option>
            <option value="price_desc">Highest price</option>
          </select>
          <button className="ml-2 text-sm font-bold text-teal">Sort</button>
        </form>
      </div>
      {result.items.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed bg-white p-12 text-center">
          <h2 className="font-bold text-navy">No vehicles match those filters</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try changing your district, type or price range.
          </p>
          <Link className="mt-5 inline-block font-bold text-teal" href="/vehicles">
            Clear all filters
          </Link>
        </div>
      )}
      {result.pages > 1 && (
        <nav className="mt-10 flex justify-center gap-3" aria-label="Pagination">
          {page > 1 && (
            <Link
              className="rounded-lg border px-3 py-2 text-sm"
              href={`/vehicles?${new URLSearchParams({ ...(district ? { district } : {}), ...(type ? { type } : {}), page: String(page - 1) })}`}
            >
              Previous
            </Link>
          )}
          {page < result.pages && (
            <Link
              className="rounded-lg border px-3 py-2 text-sm"
              href={`/vehicles?${new URLSearchParams({ ...(district ? { district } : {}), ...(type ? { type } : {}), page: String(page + 1) })}`}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
