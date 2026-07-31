import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatLkr } from "@/lib/utils";

type VehicleCardProps = {
  vehicle: {
    id: string;
    slug: string;
    title: string;
    district: string;
    city: string;
    dailyRate: number;
    seats: number;
    transmission: string;
    isFeatured: boolean;
    type: { name: string };
    company: { name: string; status: string };
    images: { url: string }[];
    reviews: { rating: number }[];
  };
};
export function VehicleCard({ vehicle }: VehicleCardProps) {
  const average = vehicle.reviews.length
    ? (
        vehicle.reviews.reduce((sum, item) => sum + item.rating, 0) / vehicle.reviews.length
      ).toFixed(1)
    : "New";
  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-48 bg-slate-100">
        <Image
          fill
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          src={
            vehicle.images[0]?.url ||
            "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80"
          }
          alt={vehicle.title}
        />
        {vehicle.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-teal px-2.5 py-1 text-xs font-bold text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-teal">{vehicle.type.name}</p>
            <h3 className="mt-1 font-extrabold text-navy">{vehicle.title}</h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {average}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} />
          {vehicle.city}, {vehicle.district}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          {vehicle.seats} seats · {vehicle.transmission.toLowerCase()}
        </p>
        <div className="mt-4 border-t pt-4">
          <span className="text-lg font-extrabold text-navy">{formatLkr(vehicle.dailyRate)}</span>
          <span className="text-sm text-slate-500"> / day</span>
        </div>
      </div>
    </Link>
  );
}
