import { Search } from "lucide-react";
import { districts, vehicleTypeNames } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export function SearchForm() {
  return (
    <form action="/vehicles" method="GET"
      className="grid gap-3 rounded-2xl bg-white p-3 shadow-lift md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr_1fr_auto]"
    >
      <label className="sr-only" htmlFor="district">
        District
      </label>
      <select id="district" name="district">
        <option value="">All districts</option>
        {districts.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="type">
        Vehicle type
      </label>
      <select id="type" name="type">
        <option value="">All vehicle types</option>
        {vehicleTypeNames.map((item) => (
          <option key={item} value={item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            {item}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="pickup">
        Pickup date
      </label>
      <input
        id="pickup"
        type="date"
        min={new Date().toISOString().slice(0, 10)}
        name="pickup"
      />
      <label className="sr-only" htmlFor="return">
        Return date
      </label>
      <input
        id="return"
        type="date"
        name="return"
        min={new Date().toISOString().slice(0, 10)}
      />
      <Button type="submit" className="gap-2 bg-teal hover:bg-cyan-600">
        <Search size={17} />
        Search
      </Button>
    </form>
  );
}
