"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTrips } from "../../services/tripService";
import TripHistoryList from "../../components/TripHistoryList";
import type { Trip } from "../../types/trip";
import { getCurrentUser } from "../../services/authService";

export default function TripsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const returnTo = searchParams.get("returnTo");
  const returnTripId = Number(returnTo);

  const backToTripId = trips.some((trip) => trip.id === returnTripId)
    ? returnTripId
    : undefined;

useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    router.replace("/login");
    return;
  }

  async function loadTrips() {
    try {
      const [data, user] = await Promise.all([
        getTrips(),
        getCurrentUser(),
      ]);

      setTrips(data);
      setUserName(user.name);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load trips.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  loadTrips();
}, [router]);

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
            <Link
              href="/profile"
              className="border-2 border-[#111111] bg-[#A6FAFF] px-3 py-2 text-xs font-black uppercase text-[#111111] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
            >
              👤 Profile
            </Link>
          </nav>
        </header>

        <section className="py-12 sm:py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#111111] font-black uppercase">
            👋 Welcome back, {userName}. This is your
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

        {isLoading ? (
          <div className="border-4 border-[#111111] bg-[#fffdf8] p-8 text-center shadow-[6px_6px_0_#111111]">
            <p className="font-black uppercase">Loading trips...</p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="border-4 border-[#111111] bg-[#f5d547] p-8 shadow-[6px_6px_0_#111111]"
          >
            <p className="font-black">{error}</p>
          </div>
        ) : (
          <TripHistoryList trips={trips} />
        )}
      </div>
    </main>
  );
}
