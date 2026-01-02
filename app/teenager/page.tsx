"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchNews } from "../lib/api";
import type { NewsItem } from "../lib/types";

type Segment = "adult" | "teenager" | "children";

export default function TeenagerPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const pageSize = 9;

  useEffect(() => {
    const stored = window.localStorage.getItem("age_segment") as Segment | null;
    if (stored !== "teenager") {
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

    fetchNews("teenager", {
      page,
      limit: pageSize,
      q: debouncedSearch || undefined,
    })
      .then((data) => {
        if (!active) return;
        if (data.length === 0 && page > 1) {
          setLastPage(page - 1);
          setHasNext(false);
          setLoading(false);
          setPage((current) => Math.max(1, current - 1));
          return;
        }

        let nextLastPage = lastPage;
        if (data.length < pageSize) {
          nextLastPage = page;
          setLastPage(page);
        }

        setItems(data);
        setHasNext(
          nextLastPage ? page < nextLastPage : data.length === pageSize
        );
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
      setLastPage(null);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  if (allowed === false) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="font-teen relative min-h-dvh overflow-hidden bg-[#eef4ff] text-[#264b7a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[#d5e6ff] blur-3xl" />
        <div className="absolute top-16 right-10 h-56 w-56 rounded-full bg-[#b8dcff] blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-6rem] h-96 w-96 rounded-full bg-[#c8e3ff] blur-3xl" />
        <div className="absolute left-8 top-24 h-48 w-48 rounded-full bg-white/80 blur-2xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        <header
          className="
  sticky top-6 z-20 mx-auto flex h-24 w-full max-w-6xl
  items-center justify-between gap-4 rounded-full px-6
  bg-white/35
  backdrop-blur-2xl
  border border-white/40
  shadow-[0_12px_40px_rgba(31,66,114,0.25)]
"
        >
          {" "}
          <div className="flex items-center gap-4">
            <span className="h-3 w-3 rounded-full bg-[#264b7a]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#8aa0bf]">
                Portal Remaja
              </p>
              <p className="text-sm font-semibold text-[#264b7a]">
                Update cepet, gaya lo tetap on.
              </p>
            </div>
          </div>
          <div className="group hidden w-full max-w-[220px] items-center gap-2 rounded-full border border-[#d6e3f6] bg-white/80 px-3 py-2 transition focus-within:border-[#264b7a]/40 focus-within:shadow-[0_0_0_3px_rgba(38,75,122,0.15)] sm:flex sm:max-w-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8aa0bf] transition group-focus-within:scale-110 group-focus-within:text-[#264b7a]">
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul atau topik"
              className="w-full bg-transparent text-sm text-[#264b7a] outline-none placeholder:text-[#8aa0bf] transition"
            />
          </div>
        </header>

        <div
          className="
  rounded-[32px]
  bg-white/25
  backdrop-blur-2xl
  border border-white/40
  shadow-[0_20px_60px_rgba(31,66,114,0.18)]
  p-6 sm:p-8
"
        >
          <div className="mb-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8aa0bf]">
            <span className="rounded-full bg-[#f3f7ff] px-3 py-1">
              Hype Harian
            </span>
            <span className="rounded-full bg-[#f3f7ff] px-3 py-1">
              Komunitas
            </span>
            <span className="rounded-full bg-[#f3f7ff] px-3 py-1">
              Pop Culture
            </span>
            <span className="rounded-full bg-[#f3f7ff] px-3 py-1">
              Trending Now
            </span>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`teen-skeleton-${index}`}
                  className="
  h-[23rem]
  rounded-3xl
  bg-white/20
  shadow-md
  animate-pulse
"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-[#d6e3f6] bg-white/80 px-5 py-4 text-sm text-[#5b6f8a]">
              Tidak ada berita yang cocok dengan pencarianmu.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/teenager/${item.id}`}
                  className="
  group flex h-[23rem] flex-col overflow-hidden rounded-3xl
  bg-white/25
  backdrop-blur-xl
  border border-white/40
  shadow-[0_12px_30px_rgba(31,66,114,0.12)]
  transition
  hover:-translate-y-1
  hover:bg-white/35
  hover:shadow-[0_20px_50px_rgba(31,66,114,0.2)]
"
                >
                  <div className="h-40 w-full overflow-hidden bg-[#eef4ff]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#d5e6ff] via-[#eef4ff] to-white" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                      <span>Score {item.final_score.toFixed(2)}</span>
                      <span className="h-1 w-1 rounded-full bg-[#d6e3f6]" />
                      <span>
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="clamp-2 text-[15px] font-semibold leading-snug text-[#264b7a]">
                      {item.title}
                    </h2>
                    <p className="clamp-3 text-sm text-[#5b6f8a]">
                      {item.contentSnippet ??
                        "Lihat ringkasan cepatnya di sini."}
                    </p>
                    <div className="mt-auto text-[11px] font-semibold uppercase tracking-[0.2em] text-[#264b7a]">
                      Baca lengkap
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setPage((current) => Math.max(1, current - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="min-h-[44px] rounded-full border border-[#d6e3f6] bg-white/80 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Sebelumnya
            </button>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8aa0bf]">
              Halaman {page}
            </div>
            <button
              type="button"
              onClick={() => {
                setPage((current) => current + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={!hasNext}
              className="min-h-[44px] rounded-full border border-[#264b7a] bg-[#264b7a] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f3b63] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Lanjut
            </button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-4 z-30 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("age_segment");
            router.replace("/");
          }}
          aria-label="Ganti kategori"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#d6e3f6] bg-white/80 text-[#264b7a] shadow-[0_16px_40px_rgba(31,66,114,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
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
      </div>
    </main>
  );
}
