import Link from "next/link";
import type { Trip } from "../types/trip";

type TripCardProps = {
  trip: Trip;
};

const destinationFlags: Record<string, string> = {
  japan: "🇯🇵",
  indonesia: "🇮🇩",
  jerman: "🇩🇪",
  germany: "🇩🇪",
  india: "🇮🇳",
  "saudi arabia": "🇸🇦",
  inggris: "🇬🇧",
  england: "🇬🇧",
};

const getDestinationFlag = (destination: string) =>
  destinationFlags[destination.trim().toLowerCase()] ?? "✈️";

const formatCurrency = (amount: number) =>
  `USD ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount)}`;

const categoryStyles: Record<string, string> = {
  Backpacker: "bg-[#c6fab4]",
  Standard: "bg-[#f5d547]",
  Luxury: "bg-[#ff5c35]",
};

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block border-4 border-[#111111] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#111111] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#111111]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-block border-2 border-[#111111] px-3 py-1 text-xs font-black uppercase ${
              categoryStyles[trip.category] ?? "bg-white"
            }`}
          >
            {trip.category}
          </span>

          {trip.travel_style && (
            <span className="ml-2 inline-block border-2 border-[#111111] bg-[#79F7FF] px-3 py-1 text-xs font-black uppercase">
              {trip.travel_style}
            </span>
          )}

          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.06em]">
            {getDestinationFlag(trip.destination)} {trip.destination}
          </h2>
        </div>
        <span className="border-2 border-[#111111] bg-[#f5d547] px-2 py-1 text-xs font-black">
          #{trip.id}
        </span>
      </div>
      <p className="mt-6 border-t-2 border-[#111111] pt-4 text-sm font-bold uppercase tracking-wide">
        {trip.days} days <span className="mx-2 text-[#ff5c35]">•</span>{" "}
        {formatCurrency(trip.budget)}
      </p>
      <p className="mt-5 text-sm font-black uppercase underline decoration-2 underline-offset-4 group-hover:text-[#e33f1e]">
        View details →
      </p>
    </Link>
  );
}
