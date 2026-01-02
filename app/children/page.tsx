"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchNews } from "../lib/api";
import type { NewsItem } from "../lib/types";

type Segment = "adult" | "teenager" | "children";

export default function ChildrenPage() {
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
  const moods = useMemo(
    () => [
      "Petualangan seru di dunia sains!",
      "Hewan lucu & fakta unik hari ini.",
      "Kisah baik yang bikin senyum.",
      "Eksperimen kecil, hasil besar!",
      "Planet kita, rahasia baru!",
      "Cerita hangat dari teman-teman.",
      "Warna-warni ide kreatif.",
      "Teka-teki ringan buat otak cerdas!",
    ],
    []
  );
  const [mood, setMood] = useState(moods[0]);

  useEffect(() => {
    const stored = window.localStorage.getItem("age_segment") as Segment | null;
    if (stored !== "children") {
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

    fetchNews("children", {
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

  useEffect(() => {
    const next = moods[Math.floor(Math.random() * moods.length)];
    setMood(next);
  }, [moods]);

  if (allowed === false) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="font-child relative min-h-dvh overflow-hidden bg-[#eef4ff] text-[#264b7a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[#d5e6ff] blur-3xl" />
        <div className="absolute top-10 right-10 h-60 w-60 rounded-full bg-[#ffd6a5]/70 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-6rem] h-96 w-96 rounded-full bg-[#caffbf]/70 blur-3xl" />
        <div className="absolute left-10 top-28 h-44 w-44 rounded-full bg-white/80 blur-2xl" />
        <div className="kid-float absolute right-20 top-16 h-10 w-10 rounded-2xl border-2 border-dashed border-[#8ecae6]/60" />
        <div className="kid-spin absolute left-20 bottom-20 h-12 w-12 rounded-full border-2 border-[#ffadad]/70" />
        <div className="kid-bounce absolute right-32 bottom-28 h-8 w-16 rounded-full bg-[#ffd6a5]/70" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        <header className="fade-in relative overflow-hidden rounded-[32px] border border-white/50 bg-white/85 p-6 shadow-[0_28px_70px_rgba(31,66,114,0.18)] backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="kid-float absolute left-6 top-6 h-8 w-8 rounded-full bg-[#ffd6a5]" />
            <div className="kid-wiggle absolute right-10 top-8 h-10 w-10 rounded-2xl bg-[#bde0fe]" />
            <div className="kid-bounce absolute left-12 bottom-8 h-6 w-14 rounded-full bg-[#caffbf]" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8aa0bf]">
                Kids News Club
              </p>
              <h1 className="text-3xl font-bold text-[#264b7a] sm:text-4xl">
                Cerita seru, fakta lucu, dan kabar cerah.
              </h1>
              <p className="text-sm text-[#5b6f8a] sm:text-base">
                Ringkas, ramah anak, dan penuh rasa ingin tahu. Biar belajar
                sambil senang-senang.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                <span className="rounded-full bg-[#fff3e0] px-3 py-1">
                  Fun Facts
                </span>
                <span className="rounded-full bg-[#e7f5ff] px-3 py-1">
                  Sains Seru
                </span>
                <span className="rounded-full bg-[#ecfdf3] px-3 py-1">
                  Dunia Hewan
                </span>
                <span className="rounded-full bg-[#f3e8ff] px-3 py-1">
                  Cerita Baik
                </span>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <div className="group  shadow-md flex w-full items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-2 transition focus-within:border-[#264b7a]/40 focus-within:shadow-[0_0_0_3px_rgba(38,75,122,0.15)]">
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
                  placeholder="Cari cerita atau topik"
                  className="w-full bg-transparent text-sm text-[#264b7a] outline-none placeholder:text-[#8aa0bf] transition"
                />
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                  Mood hari ini
                </p>
                <p className="text-sm font-bold text-[#264b7a]">{mood}</p>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`kids-skeleton-${index}`}
                className="h-72 animate-pulse rounded-3xl border border-white/50 bg-white/70 backdrop-blur-xl"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-sm text-[#5b6f8a]">
            Tidak ada cerita yang cocok dengan pencarianmu.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/children/${item.id}`}
                className="group flex h-[22rem] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_16px_38px_rgba(31,66,114,0.12)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(31,66,114,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
              >
                <div className="relative h-36 w-full overflow-hidden bg-[#eef4ff]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,165,0.45),_transparent_65%)] opacity-80" />
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#d5e6ff] via-[#eef4ff] to-white" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                    <span className="rounded-full bg-[#fff3e0] px-3 py-1 transition group-hover:-rotate-1 group-hover:scale-105">
                      Aman untuk anak
                    </span>
                  </div>
                  <h2 className="clamp-2 text-[15px] font-bold leading-snug text-[#264b7a] transition group-hover:text-[#1f4f7a]">
                    {item.title}
                  </h2>
                  <p className="clamp-3 text-sm text-[#5b6f8a]">
                    {item.contentSnippet ?? "Yuk baca cerita serunya di sini!"}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#264b7a] transition group-hover:translate-x-0.5">
                    Baca serunya
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffadad] transition group-hover:scale-125" />
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
            className="min-h-[44px] rounded-full border border-white/60 bg-white/85 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
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
      </section>

      <div className="fixed bottom-6 right-4 z-30 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("age_segment");
            router.replace("/");
          }}
          aria-label="Ganti kategori"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#264b7a] shadow-[0_16px_40px_rgba(31,66,114,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
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
