"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTrip } from "../services/tripService";

type TripForm = {
  destination: string;
  budget: string;
  days: string;
  travel_style: string;
};

const initialForm: TripForm = {
  destination: "Japan",
  budget: "2000",
  days: "5",
  travel_style: "Solo",
};

const travelStyleOptions = [
  { value: "Family", label: "Family" },
  { value: "Solo", label: "Solo" },
  { value: "Couple", label: "Couple" },
];

export default function Home() {
  const router = useRouter();

  const [form, setForm] = useState<TripForm>(initialForm);
  const [isTravelStyleOpen, setIsTravelStyleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    router.replace("/login");
  }
}, [router]);

  const travelStyleMenuRef = useRef<HTMLDivElement>(null);

  const selectedTravelStyle = travelStyleOptions.find(
    (option) => option.value === form.travel_style,
  );

  const updateField = (field: keyof TripForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!travelStyleMenuRef.current?.contains(event.target as Node)) {
        setIsTravelStyleOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const generatedTrip = await generateTrip({
        destination: form.destination.trim(),
        budget: Number(form.budget),
        days: Number(form.days),
        travel_style: form.travel_style.trim(),
      });
      router.push(`/trips/${generatedTrip.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Unable to reach the travel engine. Make sure FastAPI is running on port 8000."
          : requestError instanceof Error
            ? requestError.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#c6fab4] text-[#111111] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b-2 border-[#111111] pb-5">
          <a
            href="#top"
            className="text-2xl font-black uppercase tracking-[-0.06em] text-[#111111]"
          >
            kelana<span className="text-[#fa8cef]">.</span>
          </a>
          <div className="flex items-center gap-3">
            <Link
              href="/trips"
              className="border-2 border-[#111111] bg-[#fff59f] px-3 py-2 text-xs font-black uppercase text-[#111111] active:bg-yellow-400 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
            >
              ⏳ Trip history
            </Link>
          </div>
        </header>

        <section
          id="top"
          className="grid gap-12 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:py-20"
        >
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[#111111]">
              <span className="h-1 w-8 bg-[#111111]" />
              Your next chapter
            </p>
            <h1 className="max-w-xl text-5xl font-black tracking-[-0.07em] text-[#111111] sm:text-8xl">
              HATINYA PATAH
              <br />
              <span className="bg-[#fa8cef] px-2 text-[#111111]">
                WAKTUNYA MELANGKAH.
              </span>
            </h1>
            <p className="mt-8 max-w-md border-l-4 border-[#111111] pl-4 text-base font-medium leading-7 text-[#111111] sm:text-lg">
              Rencanain Perjalanannya, Sembuhin Lukanya.
            </p>
            <div className="mt-10 flex gap-8 border-t-2 border-[#111111] pt-5 text-sm font-bold uppercase text-[#111111]">
              <span>
                <strong className="block text-2xl text-[#111111]">01</strong>Set
                your trip
              </span>
              <span>
                <strong className="block text-2xl text-[#111111]">02</strong>Get
                your route
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-20 w-20 border-4 border-[#111111] bg-[#79F7FF]" />
            <div className="relative border-4 border-[#111111] bg-white p-6 shadow-[8px_8px_0_#111111] sm:p-8">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#111111]">
                    Build your trip
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-[#111111]">
                    Where will you go?
                  </h2>
                </div>
                <span className="text-5xl font-black text-[#79F7FF] [text-shadow:3px_3px_0_#111111]">
                  ✈️
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                aria-busy={isLoading}
                className="trip-form space-y-6"
              >
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-[#111111]">
                    Destination
                  </span>
                  <input
                    name="destination"
                    required
                    value={form.destination}
                    onChange={(event) =>
                      updateField("destination", event.target.value)
                    }
                    placeholder="e.g. Kyoto, Japan"
                    className="trip-input"
                  />
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-[#111111]">
                      Budget (USD)
                    </span>
                    <input
                      name="budget"
                      required
                      min="1"
                      type="number"
                      value={form.budget}
                      onChange={(event) =>
                        updateField("budget", event.target.value)
                      }
                      className="trip-input"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-[#111111]">
                      Days
                    </span>
                    <input
                      name="days"
                      required
                      min="1"
                      type="number"
                      value={form.days}
                      onChange={(event) =>
                        updateField("days", event.target.value)
                      }
                      className="trip-input"
                    />
                  </label>
                </div>

                <div ref={travelStyleMenuRef} className="relative block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-[#111111]">
                    Travel style
                  </span>

                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isTravelStyleOpen}
                    onClick={() => setIsTravelStyleOpen((open) => !open)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setIsTravelStyleOpen(false);
                      }

                      if (event.key === "ArrowDown") {
                        setIsTravelStyleOpen(true);
                      }
                    }}
                    className="flex w-full items-center justify-between cursor-pointer border-4 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-left font-black outline-none transition hover:bg-[#ffffff] focus:bg-[#f4f0e8] text-lg"
                  >
                    <span>{selectedTravelStyle?.label}</span>

                    <span aria-hidden="true" className="text-xl leading-none">
                      {isTravelStyleOpen ? "↑" : "↓"}
                    </span>
                  </button>

                  {isTravelStyleOpen && (
                    <div
                      role="listbox"
                      aria-label="Travel style"
                      className="absolute z-10 mt-2 w-full border-4 border-[#111111] bg-[#fffdf8] p-1 shadow-[5px_5px_0_#111111]"
                    >
                      {travelStyleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={form.travel_style === option.value}
                          onClick={() => {
                            updateField("travel_style", option.value);
                            setIsTravelStyleOpen(false);
                          }}
                          className={`block w-full px-3 py-3 text-left text-sm font-black uppercase transition hover:bg-[#111111] hover:text-white ${
                            form.travel_style === option.value
                              ? "bg-[#fa8cef]"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="trip-submit"
                >
                  <span className="flex items-center gap-3">
                    {isLoading && (
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-[#111111] border-t-transparent"
                        aria-hidden="true"
                      />
                    )}
                    {isLoading ? "Crafting your route..." : "Generate AI Trip"}
                  </span>
                  <span className="text-xl">↗</span>
                </button>
                {isLoading && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="border-2 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#111111]"
                  >
                    AI is mapping your route. This may take a moment.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mx-auto mb-10 flex max-w-2xl items-center justify-between gap-6 border-4 border-[#111111] bg-[#f5d547] px-5 py-4"
          >
            <p className="text-sm font-bold text-[#111111]">{error}</p>

            <button
              type="button"
              onClick={() => {
                const formElement = document.querySelector("form");

                if (formElement) {
                  formElement.requestSubmit();
                }
              }}
              className="shrink-0 border-4 border-[#111111] bg-white px-5 py-2 font-black uppercase text-[#111111] shadow-[3px_3px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
