import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();
  const isPlanTripPage = pathname === "/";
  const isAssistantPage = pathname === "/assistant";
  const isTripHistoryPage = pathname === "/trips" || pathname.startsWith("/trips/");
  const isProfilePage = pathname === "/profile";

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b-2 border-[#111111] pb-5">
      <Link
        href="/"
        className="text-2xl font-black uppercase tracking-[-0.06em]"
      >
        kelana<span className="text-[#ff5c35]">.</span>
      </Link>

      <nav className="flex flex-wrap justify-end gap-2 sm:gap-3">
        {!isPlanTripPage && (
          <Link
            href="/"
            className="border-2 border-[#111111] bg-[#c6fab4] px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm"
          >
            ✈️ Plan a trip
          </Link>
        )}

        {!isTripHistoryPage && (
          <Link
            href="/trips"
            className="border-2 border-[#111111] bg-[#fff59f] px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm"
          >
            ⏳ Trip history
          </Link>
        )}

        {!isProfilePage && (
          <Link
            href="/profile"
            className="border-2 border-[#111111] bg-[#A6FAFF] px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm"
          >
            👤 Profile
          </Link>
        )}

        {!isAssistantPage && (
          <Link
            href="/assistant"
            className="border-2 border-[#111111] bg-[#fa8cef] px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm"
          >
            ✦ AI assistant
          </Link>
        )}
      </nav>
    </header>
  );
}
