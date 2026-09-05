"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setIsLoading(true);
setError("");

try {
  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
    }),
  });

  if (!res.ok) {
    if (res.status === 500) {
      throw new Error("Email Anda sudah digunakan, silakan login.");
    }

    const data = await res.json().catch(() => null);

    throw new Error(
      data?.detail || "Registration failed. Please try again.",
    );
  }

  router.push("/login");
} catch (requestError) {
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

return (
<main className="min-h-screen bg-[#c6fab4] px-6 py-6 text-[#111111] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
<div className="mx-auto grid min-h-screen w-full max-w-[1280px] grid-cols-12 items-center gap-x-6 px-4 py-10 sm:gap-x-8 sm:px-8 lg:gap-x-10 lg:px-12">
<section className="col-span-12 w-full justify-self-center border-4 border-[#111111] bg-white p-6 shadow-[8px_8px_0_#111111] sm:col-start-3 sm:col-span-8 sm:p-8 lg:col-start-5 lg:col-span-4">
<div className="mb-8">
<Link href="/" className="text-2xl font-black uppercase tracking-[-0.06em]" >
kelana<span className="text-[#fa8cef]">.</span>
</Link>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]">
          Start your journey
        </p>

        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.06em]">
          Register
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-busy={isLoading}
        className="space-y-6"
      >
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em]">
            Name
          </span>

          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alice"
            className="trip-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em]">
            Email
          </span>

          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alice@email.com"
            className="trip-input"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em]">
            Password
          </span>

          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="trip-input"
          />
        </label>

        {error && (
          <div
            role="alert"
            className="border-4 border-[#111111] bg-[#f5d547] px-4 py-3 text-sm font-bold"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="trip-submit"
        >
          <span>
            {isLoading ? "Registering..." : "Register"}
          </span>

          <span className="text-xl">↗</span>
        </button>
      </form>

      <p className="mt-8 border-t-2 border-[#111111] pt-5 text-sm font-bold">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-black underline decoration-2 underline-offset-4"
        >
          Login
        </Link>
      </p>
    </section>
  </div>
</main>

);
}