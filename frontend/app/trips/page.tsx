import Link from "next/link";
import { getTrips } from "../../services/tripService";
import TripHistoryList from "../../components/TripHistoryList";

export const dynamic = "force-dynamic";

type TripsPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const trips = await getTrips();
  const { returnTo } = await searchParams;
  const returnTripId = Number(returnTo);
  const backToTripId = trips.some((trip) => trip.id === returnTripId)
    ? returnTripId
    : undefined;

  return (
    <main className="min-h-screen bg-[#a5b4fb] px-6 py-6 text-[#111111] sm:px-8 lg:px-12 bg-[radial-gradient(#06060610_1px,transparent_1px)] bg-[size:16px_16px]">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b-2 border-[#111111] pb-5">
          <Link
            href="/"
            className="text-2xl font-black uppercase tracking-[-0.06em] text-[#111111]"
          >
            kelana<span className="text-[#ff5c35]">.</span>
          </Link>
          <nav className="flex flex-wrap justify-end gap-3">
            <Link
              href="/"
              className="border-2 border-[#111111] bg-[#c6fab4] px-3 py-2 text-xs font-black uppercase text-[#111111] hover:bg-[#c6fab4] active:bg-[#7df752] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
            >
              ✈️ Plan a trip
            </Link>
            {backToTripId && (
              <Link
                href={`/trips/${backToTripId}`}
                className="border-2 border-[#111111] bg-[#A6FAFF] px-3 py-2 text-xs font-black uppercase text-[#111111] active:bg-[#53f2fc] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
              >
                ← Back to itinerary
              </Link>
            )}
          </nav>
        </header>

        <section className="py-12 sm:py-">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#111111]">
            My trips
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b-0 border-[#111111] pb-6">
            <h1 className="text-5xl font-black uppercase tracking-[-0.07em] sm:text-7xl">
              Trip history
            </h1>
            <p className="text-sm font-black uppercase tracking-widest">
              {trips.length} saved itineraries
            </p>
          </div>
        </section>

        <TripHistoryList trips={trips} />
      </div>
    </main>
  );
}
