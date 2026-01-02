"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import FontSizeToggle from "../components/FontSizeToggle";
import NewsCard from "../components/NewsCard";
import { fetchNews } from "../lib/api";
import type { NewsItem } from "../lib/types";

type Segment = "adult" | "teenager" | "children";

export default function AdultPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [hasNext, setHasNext] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  const handleBackToPopup = () => {
    window.localStorage.removeItem("age_segment");
    router.replace("/");
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("age_segment") as Segment | null;
    if (stored !== "adult") {
      router.replace("/");
      setAllowed(false);
      return;
    }
    setAllowed(true);
  }, [router]);

  useEffect(() => {
    if (!allowed) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchNews("adult", {
      page,
      limit: pageSize,
      q: debouncedSearch || undefined,
    })
      .then((data) => {
        if (!active) return;
        setItems(data);
        setHasNext(data.length === pageSize);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Unable to load news right now.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [allowed, debouncedSearch, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = search.trim();
      setDebouncedSearch(nextSearch);
      setPage(1);
      setHasNext(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  if (allowed === false) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main
      className="adult-body adult-theme relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fbff,_#eef4ff_55%,_#dbe9ff_100%)] text-[#264b7a]"
      style={
        {
          "--adult-bg": "#eef4ff",
          "--adult-ink": "#264b7a",
          "--adult-muted": "#5b6f8a",
          "--adult-card": "rgba(255,255,255,0.95)",
          "--adult-border": "rgba(38,75,122,0.12)",
          "--adult-accent": "#264b7a",
          "--adult-accent-soft": "rgba(38,75,122,0.14)",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#d5e6ff] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-[#c8e3ff] blur-3xl" />
        <div className="absolute left-8 top-24 h-44 w-44 rounded-full bg-white/80 blur-2xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        <header className="fade-in sticky top-6 z-20 mx-auto flex h-24 w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-[#d6e3f6] bg-white/95 px-4 shadow-[0_20px_60px_rgba(31,66,114,0.18)] backdrop-blur sm:px-6">
          <div className="flex items-center gap-4">
            <span className="h-3 w-3 rounded-full bg-[#264b7a]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#8aa0bf]">
                Portal Dewasa
              </p>
              <p className="text-sm font-semibold text-[#264b7a]">
                Ringkas, relevan, tanpa drama.
              </p>
            </div>
          </div>

          <div className="group flex w-full max-w-[220px] items-center gap-2 rounded-full border border-[#d6e3f6] bg-[#f8fbff] px-3 py-2 transition focus-within:border-[#264b7a]/40 focus-within:shadow-[0_0_0_3px_rgba(38,75,122,0.15)] sm:max-w-md sm:gap-3 sm:px-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8aa0bf] transition group-focus-within:-translate-x-0.5 group-focus-within:text-[#264b7a] sm:h-8 sm:w-8">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Cari judul atau topik"
              className="w-full bg-transparent text-sm text-[#264b7a] outline-none placeholder:text-[#8aa0bf]"
            />
          </div>
        </header>

        <div className="relative overflow-hidden rounded-[28px] bg-white/90 p-5 shadow-[0_24px_60px_rgba(31,66,114,0.15)] backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="adult-grid-glow" />
          </div>
          <div className="pointer-events-none absolute inset-0">
            <div className="deco-float-slow absolute right-10 top-8 h-12 w-12 rounded-full border border-[#d7e6fb]" />
            <div className="deco-bob absolute bottom-10 left-8 h-8 w-24 rounded-full bg-[#eef4ff]" />
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={`adult-skeleton-${index}`}
                  className="h-96 animate-pulse rounded-3xl border border-[#d6e3f6] bg-white/90"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-[#d6e3f6] bg-[#f8fbff] px-5 py-4 text-sm text-[#5b6f8a]">
              Tidak ada berita yang cocok dengan pencarianmu.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="fade-in z-10"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <NewsCard item={item} segment="adult" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="min-h-[44px] z-10 rounded-full border border-[#d6e3f6] bg-white px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Sebelumnya
            </button>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8aa0bf]">
              Halaman {page}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!hasNext}
              className="min-h-[44px] rounded-full border border-[#264b7a] bg-[#264b7a] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f3b63] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Lanjut
            </button>
          </div>
        </div>
      </section>

      <div
        className={`fixed bottom-6 right-4 z-30 flex flex-col items-center gap-3 transition sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 ${
          isScrolling ? "scale-90 opacity-85" : "scale-100 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={handleBackToPopup}
          aria-label="Ganti kategori"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#264b7a] text-white shadow-[0_16px_40px_rgba(31,66,114,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1f3b63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h14" />
            <path d="M14 3l4 4-4 4" />
            <path d="M20 17H6" />
            <path d="M10 21l-4-4 4-4" />
          </svg>
        </button>
        <FontSizeToggle orientation="vertical" tone="adult" />
      </div>
    </main>
  );
}
