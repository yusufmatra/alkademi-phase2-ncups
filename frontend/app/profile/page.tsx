"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../../services/authService";
import { getTrips } from "../../services/tripService";
import type { User } from "../../types/user";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// type User = {
// id: number;
// name: string;
// email: string;
// };

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [userData, tripsData] = await Promise.all([
          getCurrentUser(),
          getTrips(),
        ]);

        setUser(userData);
        setTripCount(tripsData.length);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          (requestError.message.includes("401") ||
            requestError.message.includes("403") ||
            requestError.message === "Not authenticated")
        ) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        setError(
          requestError instanceof TypeError
            ? "Unable to reach the server. Make sure FastAPI is running on port 8000."
            : requestError instanceof Error
              ? requestError.message
              : "Something went wrong. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#c6fab4] px-6 py-6 text-[#111111] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
          <section className="w-full border-4 border-[#111111] bg-white p-6 shadow-[8px_8px_0_#111111] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              Loading profile...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#c6fab4] px-6 py-6 text-[#111111] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
          <section className="w-full border-4 border-[#111111] bg-white p-6 shadow-[8px_8px_0_#111111] sm:p-8">
            <div
              role="alert"
              className="border-4 border-[#111111] bg-[#f5d547] px-4 py-3 text-sm font-bold"
            >
              {error}
            </div>

            <button
              type="button"
              onClick={() => router.push("/trips")}
              className="trip-submit mt-6 w-full"
            >
              <span>Back to trips</span>
              <span className="text-xl">↗</span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fa8cef] px-6 py-6 text-[#111111] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
      <header className="flex items-center justify-between border-b-2 border-[#111111] pb-5">
        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-[-0.06em]"
        >
          kelana<span className="text-[#fa8cef]">.</span>
        </Link>

        <nav className="flex flex-wrap justify-end gap-3">
          <Link
            href="/"
            className="border-2 border-[#111111] bg-[#c6fab4] px-3 py-2 text-xs font-black uppercase text-[#111111] hover:bg-[#c6fab4] active:bg-[#7df752] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
          >
            ✈️ Plan a trip
          </Link>

          <Link
            href="/trips"
            className="border-2 border-[#111111] bg-[#fff59f] px-3 py-2 text-xs font-black uppercase text-[#111111] active:bg-yellow-400 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
          >
            ⏳ Trip history
          </Link>
        </nav>
      </header>
      <div className="mx-auto flex mt-12 max-w-md items-center justify-center">
        <section className="w-full border-4 border-[#111111] bg-white p-6 shadow-[8px_8px_0_#111111] sm:p-8">
          <div className="mb-8">
            <Link
              href="/"
              className="text-2xl font-black uppercase tracking-[-0.06em]"
            >
              kelana<span className="text-[#fa8cef]">.</span>
            </Link>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]">
              Your account
            </p>

            <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.06em]">
              Profile
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.15em]">
                Name
              </p>
              <p className="text-xl font-black">{user?.name}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.15em]">
                Email
              </p>
              <p className="text-xl font-black">{user?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.15em]">
                Total Trips Generated
              </p>
              <p className="text-4xl font-black">{tripCount}</p>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-[#111111]">
            <Link
              href="/trips"
              className="mt-6 flex w-full items-center justify-between border-4 border-[#111111] bg-[#a5b4fb] px-4 py-3 text-sm font-black uppercase text-[#111111] shadow-[4px_4px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Back to my trips
            </Link>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("access_token");
                router.push("/login");
              }}
              className="mt-6 font-black underline decoration-2 underline-offset-4 cursor-pointer hover hover:text-red-600 "
            >
              <span>Logout</span>
              <span className="text-xl">↗</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
