"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AppNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isTripHistoryActive =
    pathname === "/trips" || pathname.startsWith("/trips/");

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative flex min-h-16 shrink-0 items-center border-b-2 border-[#111111]">
      {/* Navbar Top */}
      <div className="flex h-16 w-full items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-2xl font-black uppercase tracking-[-0.06em]"
        >
          kelana<span className="text-[#ff5c35]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden shrink-0 items-center justify-end gap-2 sm:flex sm:gap-3">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${
              pathname === "/"
                ? "shadow-[2px_2px_0_#111111]"
                : ""
            }`}
          >
            ✈️ Plan a trip
          </Link>

          <Link
            href="/trips"
            aria-current={
              isTripHistoryActive ? "page" : undefined
            }
            className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${
              isTripHistoryActive
                ? "shadow-[2px_2px_0_#111111]"
                : ""
            }`}
          >
            ⏳ Trip history
          </Link>

          <Link
            href="/assistant"
            aria-current={
              pathname === "/assistant" ? "page" : undefined
            }
            className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${
              pathname === "/assistant"
                ? "shadow-[2px_2px_0_#111111]"
                : ""
            }`}
          >
            ✦ AI assistant
          </Link>

          <Link
            href="/profile"
            aria-current={
              pathname === "/profile" ? "page" : undefined
            }
            className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${
              pathname === "/profile"
                ? "shadow-[2px_2px_0_#111111]"
                : ""
            }`}
          >
            👤 Profile
          </Link>
        </nav>

        {/* Mobile Burger Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="ml-auto flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-white text-xl font-black shadow-[3px_3px_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-full z-40 border-b-2 border-[#111111] bg-[#f1ede2] p-3 shadow-[4px_4px_0_#111111] sm:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={closeMenu}
              aria-current={pathname === "/" ? "page" : undefined}
              className={`border-2 border-[#111111] bg-white px-4 py-3 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] ${
                pathname === "/"
                  ? "bg-[#fa8cef] shadow-[2px_2px_0_#111111]"
                  : ""
              }`}
            >
              ✈️ Plan a trip
            </Link>

            <Link
              href="/trips"
              onClick={closeMenu}
              aria-current={
                isTripHistoryActive ? "page" : undefined
              }
              className={`border-2 border-[#111111] bg-white px-4 py-3 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] ${
                isTripHistoryActive
                  ? "bg-[#fa8cef] shadow-[2px_2px_0_#111111]"
                  : ""
              }`}
            >
              ⏳ Trip history
            </Link>

            <Link
              href="/assistant"
              onClick={closeMenu}
              aria-current={
                pathname === "/assistant" ? "page" : undefined
              }
              className={`border-2 border-[#111111] bg-white px-4 py-3 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] ${
                pathname === "/assistant"
                  ? "bg-[#fa8cef] shadow-[2px_2px_0_#111111]"
                  : ""
              }`}
            >
              ✦ AI assistant
            </Link>

            <Link
              href="/profile"
              onClick={closeMenu}
              aria-current={
                pathname === "/profile" ? "page" : undefined
              }
              className={`border-2 border-[#111111] bg-white px-4 py-3 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] ${
                pathname === "/profile"
                  ? "bg-[#fa8cef] shadow-[2px_2px_0_#111111]"
                  : ""
              }`}
            >
              👤 Profile
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AppNavbar() {
//   const pathname = usePathname();

//   return (
//     <header className="flex h-16 min-h-16 max-h-16 shrink-0 items-center gap-4 overflow-x-auto border-b-2 border-[#111111] pb-0">
//       <Link
//         href="/"
//         className="shrink-0 text-2xl font-black uppercase tracking-[-0.06em]"
//       >
//         kelana<span className="text-[#ff5c35]">.</span>
//       </Link>

//       <nav className="ml-auto flex shrink-0 flex-nowrap justify-end gap-2 sm:gap-3">
//         <Link
//           href="/"
//           aria-current={pathname === "/" ? "page" : undefined}
//           className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${pathname === "/" ? "shadow-[2px_2px_0_#111111]" : ""}`}
//         >
//           ✈️ Plan a trip
//         </Link>

//         <Link
//           href="/trips"
//           aria-current={pathname === "/trips" || pathname.startsWith("/trips/") ? "page" : undefined}
//           className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${pathname === "/trips" || pathname.startsWith("/trips/") ? "shadow-[2px_2px_0_#111111]" : ""}`}
//         >
//           ⏳ Trip history
//         </Link>

//         <Link
//           href="/assistant"
//           aria-current={pathname === "/assistant" ? "page" : undefined}
//           className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${pathname === "/assistant" ? "shadow-[2px_2px_0_#111111]" : ""}`}
//         >
//           ✦ AI assistant
//         </Link>

//         <Link
//           href="/profile"
//           aria-current={pathname === "/profile" ? "page" : undefined}
//           className={`border-2 border-[#111111] bg-white px-3 py-2 text-xs font-black uppercase text-[#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] sm:text-sm ${pathname === "/profile" ? "shadow-[2px_2px_0_#111111]" : ""}`}
//         >
//           👤 Profile
//         </Link>
//       </nav>
//     </header>
//   );
// }
