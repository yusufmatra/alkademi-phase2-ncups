"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import MarkdownContent from "../components/MarkdownContent";

type DestinationPhoto = {
  imageUrl: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  unsplashUrl: string;
};

type Trip = {
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation?: string | null;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export default function TripPage() {
  const storedTrip = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem("kelana-trip"),
    () => null,
  );
  const trip = storedTrip ? (JSON.parse(storedTrip) as Trip) : null;
  const destination = trip?.destination;
  const [photo, setPhoto] = useState<DestinationPhoto | null>(null);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (!destination) return;

    const loadPhoto = async () => {
      try {
        setPhotoError("");
        const response = await fetch(`/api/photos?query=${encodeURIComponent(destination)}`);
        if (!response.ok) throw new Error("Destination photo unavailable");
        setPhoto((await response.json()) as DestinationPhoto);
      } catch {
        setPhotoError("Destination photo is unavailable right now.");
      }
    };

    loadPhoto();
  }, [destination]);

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f0e8] px-6 text-center text-[#111111]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5c35]">
            No trip found
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em]">
            Create your route first.
          </h1>
          <Link
            href="/"
            className="mt-7 inline-flex border-4 border-[#111111] bg-[#f5d547] px-6 py-3 font-black uppercase shadow-[5px_5px_0_#111111]"
          >
            Back to planner
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] px-6 py-6 text-[#111111] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b-4 border-[#111111] pb-5">
          <Link
            href="/"
            className="text-2xl font-black uppercase tracking-[-0.06em] text-[#111111]"
          >
            kelana<span className="text-[#ff5c35]">.</span>
          </Link>
          <Link
            href="/"
            className="border-2 border-[#111111] bg-[#f5d547] px-3 py-2 text-sm font-black uppercase text-[#111111] transition hover:bg-[#ff5c35]"
          >
            ← Plan another trip
          </Link>
        </header>

        <section className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5c35]">
              Perjalanan adalah Penyembuhan - Trip To:
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.07em] text-[#111111] sm:text-8xl">
              {trip.destination}
            </h1>
          </div>
          <div className="border-4 border-[#111111] bg-[#ffffff] p-2 shadow-[4px_4px_0_#111111]">
            {photo ? (
              <>
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt}
                  width={1600}
                  height={900}
                  priority
                  unoptimized
                  className="aspect-video w-full border-4 border-[#111111] object-cover object-center"
                />
                <p className="px-2 py-3 text-xs font-black uppercase tracking-widest text-[#111111]">
                  Photo by <a href={photo.photographerUrl} target="_blank" rel="noreferrer" className="underline">{photo.photographerName}</a> on <a href={photo.unsplashUrl} target="_blank" rel="noreferrer" className="underline">Unsplash</a>
                </p>
              </>
            ) : (
              <div className="flex aspect-video items-center justify-center border-4 border-[#111111] bg-[#f5d547] p-4 text-center text-xs font-black uppercase tracking-widest">
                {photoError || "Loading destination photo..."}
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-4 border-[#111111] bg-[#ff5c35] p-6 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
                Budget
              </p>
              <p className="mt-4 text-xl font-black text-[#111111]">
                {formatCurrency(trip.budget)}
              </p>
            </div>
            <div className="border-4 border-[#111111] bg-[#f5d547] p-6 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
                Days
              </p>
              <p className="mt-4 text-xl font-black text-[#111111]">
                {trip.days} days
              </p>
            </div>
            <div className="border-4 border-[#111111] bg-[#f5d547] p-6 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
                Daily budget
              </p>
              <p className="mt-4 text-xl font-black text-[#111111]">
                {formatCurrency(trip.daily_budget)}
              </p>
            </div>
            <div className="border-4 border-[#111111] bg-[#ff5c35] p-6 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
                Trip style
              </p>
              <p className="mt-4 text-xl font-black text-[#111111]">
                {trip.category}
              </p>
            </div>
          </div>
          <article className="border-4 border-[#111111] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#111111] sm:p-8">
            <div className="mb-8 border-b-4 border-[#111111] pb-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5c35]">
                AI recommendation
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-[#111111]">
                Your {trip.destination} itinerary
              </h2>
            </div>
            <MarkdownContent
              content={
                trip.ai_recommendation ||
                "Your recommendation is being prepared."
              }
            />
          </article>
        </div>
      </div>
    </main>
  );
}
