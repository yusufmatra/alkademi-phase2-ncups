"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TripCard from "./TripCard";
import type { Trip } from "../types/trip";

type SortMode = "latest" | "oldest" | "budget";

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "budget", label: "Highest budget" },
];

const ITEMS_PER_PAGE = 10;

type TripHistoryListProps = {
  trips: Trip[];
};

export default function TripHistoryList({ trips }: TripHistoryListProps) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const isSearchActive = normalizedQuery.length >= 2;
  const selectedSort = sortOptions.find((option) => option.value === sortMode);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortMode]);

  const visibleTrips = [...trips]
    .filter(
      (trip) =>
        !isSearchActive ||
        trip.destination.toLowerCase().includes(normalizedQuery) ||
        trip.category.toLowerCase().includes(normalizedQuery),
    )
    .sort((firstTrip, secondTrip) => {
      switch (sortMode) {
        case "oldest":
          return firstTrip.id - secondTrip.id;
        case "budget":
          return secondTrip.budget - firstTrip.budget;
        default:
          return secondTrip.id - firstTrip.id;
      }
    });

  const totalPages = Math.ceil(visibleTrips.length / ITEMS_PER_PAGE);

  const paginatedTrips = visibleTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (trips.length === 0) {
    return (
      <section className="border-4 border-[#111111] bg-[#fffdf8] p-8 text-center shadow-[6px_6px_0_#111111]">
        <h2 className="text-2xl font-black uppercase">No trips yet</h2>
        <p className="mt-3 font-medium">
          Create your first itinerary to see it here.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="border-2 border-[#111111] bg-[#fa8cef] px-5 py-3 text-sm font-black uppercase text-[#111111] shadow-[3px_3px_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Plan Your Trip
          </Link>
          <Link
            href="/assistant"
            className="border-2 border-[#111111] bg-[#79F7FF] px-5 py-3 text-sm font-black uppercase text-[#111111] shadow-[3px_3px_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Ask Assistant
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 grid gap-4 border-b-4 border-[#111111] pb-6 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search destination or travel style..."
            className="w-full border-4 border-[#111111] bg-[#fffdf8] px-4 py-3 font-bold outline-none placeholder:text-[#777777] focus:bg-[#ffffff]"
          />
          {normalizedQuery.length === 1 && (
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#555555]">
              Type at least 2 characters to search.
            </p>
          )}
        </label>
        <div ref={sortMenuRef} className="relative block sm:min-w-48">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsSortOpen(false);
              if (event.key === "ArrowDown") setIsSortOpen(true);
            }}
            className="flex w-full items-center justify-between border-4 border-[#111111] bg-[#f5d547] px-4 py-3 text-left font-black outline-none transition hover:bg-[#ff5c35] focus:bg-[#ff5c35] cursor-pointer "
          >
            <span>{selectedSort?.label}</span>
            <span aria-hidden="true" className="text-xl leading-none">
              {isSortOpen ? "↑" : "↓"}
            </span>
          </button>
          {isSortOpen && (
            <div
              role="listbox"
              aria-label="Sort trips"
              className="absolute z-10 mt-2 w-full border-4 border-[#111111] bg-[#fffdf8] p-1 shadow-[5px_5px_0_#111111]"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={sortMode === option.value}
                  onClick={() => {
                    setSortMode(option.value);
                    setIsSortOpen(false);
                  }}
                  className={`block w-full px-3 py-3 text-left text-sm font-black uppercase transition cursor-pointer hover:bg-[#111111] hover:text-white ${sortMode === option.value ? "bg-[#f5d547]" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {visibleTrips.length === 0 ? (
        <div className="border-4 border-[#111111] bg-[#fffdf8] p-8 text-center shadow-[6px_6px_0_#111111]">
          <h2 className="text-2xl font-black uppercase">No matching trips</h2>
          <p className="mt-3 font-medium">
            Try another destination or travel style.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {paginatedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t-4 border-[#111111] pt-5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="border-2 border-[#111111] bg-[#f5d547] px-4 py-3 text-xs font-black uppercase text-[#111111] shadow-[2px_2px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                ← Previous
              </button>

              <p className="text-sm font-black uppercase">
                Page {currentPage} of {totalPages}
              </p>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="border-2 border-[#111111] bg-[#ff5c35] px-4 py-3 text-xs font-black uppercase text-[#111111] shadow-[2px_2px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
