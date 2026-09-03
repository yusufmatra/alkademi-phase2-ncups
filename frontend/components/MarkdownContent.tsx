"use client";

import ReactMarkdown from "react-markdown";
import { useState } from "react";

type MarkdownContentProps = {
  content: string;
};

const DAYS_PER_PAGE = 5;

export default function MarkdownContent({ content = "" }: MarkdownContentProps) {
  const contentWithoutTitle = content.replace(/^#\s+.*(?:\r?\n|$)/, "").trim();
  const sections = contentWithoutTitle.split(/(?=^##\s+Day\b)/gm);
  const firstSectionIsDay = /^##\s+Day\b/.test(sections[0]?.trim() ?? "");
  const introduction = firstSectionIsDay ? "" : sections[0]?.trim();
  const daySections = (firstSectionIsDay ? sections : sections.slice(1))
    .map((section) => section.trim())
    .filter(Boolean);
  const pages = Array.from(
    { length: Math.ceil(daySections.length / DAYS_PER_PAGE) },
    (_, pageIndex) =>
      daySections.slice(
        pageIndex * DAYS_PER_PAGE,
        (pageIndex + 1) * DAYS_PER_PAGE,
      ),
  );
  const [pageIndex, setPageIndex] = useState(0);

  if (daySections.length === 0) {
    return (
      <div className="space-y-6 text-sm font-medium leading-7 text-[#222222]">
        <MarkdownDocument content={contentWithoutTitle} />
      </div>
    );
  }

  const hasPagination = daySections.length > DAYS_PER_PAGE;
  const currentPageIndex = Math.min(pageIndex, pages.length - 1);
  const visibleDays = hasPagination ? pages[currentPageIndex] : daySections;

  return (
    <div className="space-y-6 text-base font-medium leading-7 text-[#222222]">
      {introduction && currentPageIndex === 0 && (
        <MarkdownDocument content={introduction} />
      )}
      {visibleDays.map((daySection, index) => (
        <section
          key={`${daySection.slice(0, 30)}-${index}`}
          className="border-4 border-[#111111] bg-[#f1ede2] p-6 shadow-[#111111] sm:p-8"
        >
          <MarkdownDocument content={daySection} />
        </section>
      ))}
      {hasPagination && (
        <nav
          aria-label="Itinerary pages"
          className="flex items-center justify-between gap-4 border-t-4 border-[#111111] pt-6"
        >
          <button
            type="button"
            onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
            disabled={currentPageIndex === 0}
            className="border-2 border-[#111111] bg-[#f5d547] px-4 py-3 text-xs font-black uppercase text-[#111111] shadow-[2px_2px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            ← Previous
          </button>
          <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
            Page {currentPageIndex + 1} / {pages.length}
          </p>
          <button
            type="button"
            onClick={() =>
              setPageIndex((current) => Math.min(pages.length - 1, current + 1))
            }
            disabled={currentPageIndex === pages.length - 1}
            className="border-2 border-[#111111] bg-[#ff5c35] px-4 py-3 text-xs font-black uppercase text-[#111111] shadow-[2px_2px_0_#111111] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}

function MarkdownDocument({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="border-l-8 border-[#ff5c35] bg-[#f5d547] px-3 py-2 text-2xl font-black uppercase tracking-[-0.04em] text-[#111111]">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="border-b-2 border-[#111111] pb-2 text-xl font-black uppercase tracking-[-0.03em] text-[#111111]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="border-l-4 border-[#ff5c35] pl-3 pt-2 font-black uppercase text-[#111111]">
            {children}
          </h3>
        ),
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc space-y-2 pl-5 marker:text-[#ff5c35]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-2 pl-5 marker:font-black marker:text-[#ff5c35]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-black text-[#111111]">{children}</strong>
        ),
        hr: () => <hr className="border-0 border-[#111111]" />,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-black text-[#e33f1e] underline decoration-2 underline-offset-2"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
