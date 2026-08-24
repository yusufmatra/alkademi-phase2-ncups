"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Trip = {
	id?: number;
	destination: string;
	days: number;
	budget: number;
	category: string;
	daily_budget: number;
	ai_recommendation?: string | null;
};

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
	travel_style: "Solo Traveling",
};

export default function Home() {
	const router = useRouter();
	const [form, setForm] = useState<TripForm>(initialForm);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const updateField = (field: keyof TripForm, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("http://localhost:8000/api/v1/trips", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					destination: form.destination.trim(),
					budget: Number(form.budget),
					days: Number(form.days),
					travel_style: form.travel_style.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("The trip could not be generated. Please try again.");
			}

			const generatedTrip = (await response.json()) as Trip;
			sessionStorage.setItem("kelana-trip", JSON.stringify(generatedTrip));
			router.push("/trip");
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
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#111111]">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b-4 border-[#111111] pb-5">
          <a
            href="#top"
            className="text-2xl font-black uppercase tracking-[-0.06em] text-[#111111]"
          >
            kelana<span className="text-[#ff5c35]">.</span>
          </a>
          <div className="hidden items-center gap-5 text-sm font-bold uppercase tracking-widest text-[#111111] sm:flex">
            <span>AI trip planner</span>
            <span className="border-2 border-[#111111] bg-[#f5d547] px-3 py-1.5">
              Beta
            </span>
          </div>
        </header>

        <section
          id="top"
          className="grid gap-12 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:py-20"
        >
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[#ff5c35]">
              <span className="h-1 w-8 bg-[#ff5c35]" />
              Your next chapter
            </p>
            <h1 className="max-w-xl text-5xl font-black tracking-[-0.07em] text-[#111111] sm:text-8xl">
              HATINYA PATAH
              <br />
              <span className="bg-[#ff5c35] px-2 text-[#111111]">
                WAKTUNYA MELANGKAH.
              </span>
            </h1>
            <p className="mt-8 max-w-md border-l-4 border-[#111111] pl-4 text-base font-medium leading-7 text-[#333333] sm:text-lg">
              Rencanain Perjalanannya, Sembuhin Lukanya.
              {/* Dia sudah punya tujuan hidup baru.
              Sekarang waktunya kamu punya tujuan perjalanan baru. */}
            </p>
            <div className="mt-10 flex gap-8 border-t-4 border-[#111111] pt-5 text-sm font-bold uppercase text-[#333333]">
              <span>
                <strong className="block text-2xl text-[#ff5c35]">01</strong>Set
                your trip
              </span>
              <span>
                <strong className="block text-2xl text-[#ff5c35]">02</strong>Get
                your route
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-20 w-20 border-4 border-[#111111] bg-[#f5d547]" />
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
                <span className="text-5xl font-black text-[#f5d547] [text-shadow:3px_3px_0_#111111]">
                  ✦
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                aria-busy={isLoading}
                className="space-y-6"
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
                    className="w-full border-4 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-lg font-bold text-[#111111] outline-none placeholder:text-[#743021] focus:bg-[#f5d547]"
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
                      className="w-full border-4 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-lg font-bold text-[#111111] outline-none focus:bg-[#f5d547]"
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
                      className="w-full border-4 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-lg font-bold text-[#111111] outline-none focus:bg-[#f5d547]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-[#111111]">
                    Travel style
                  </span>
                  <input
                    name="travel_style"
                    required
                    value={form.travel_style}
                    onChange={(event) =>
                      updateField("travel_style", event.target.value)
                    }
                    placeholder="e.g. Food & culture"
                    className="w-full border-4 border-[#111111] bg-[#f4f0e8] px-4 py-3 text-lg font-bold text-[#111111] outline-none placeholder:text-[#743021] focus:bg-[#f5d547]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full cursor-pointer items-center justify-between border-4 border-[#111111] bg-[#f5d547] px-6 py-4 text-left font-black uppercase text-[#111111] shadow-[4px_4px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-wait disabled:opacity-60"
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
