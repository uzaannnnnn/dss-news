"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchNewsDetail } from "../../lib/api";
import type { NewsItem } from "../../lib/types";

type Segment = "adult" | "teenager" | "children";

type Params = {
  id: string;
};

export default function TeenagerDetailPage() {
  const router = useRouter();
  const params = useParams<Params>();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!allowed || !params?.id) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchNewsDetail("teenager", params.id)
      .then((data) => {
        if (!active) return;
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Unable to load news detail.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [allowed, params]);

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

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        {loading ? (
          <div className="h-80 animate-pulse rounded-3xl border border-white/40 bg-white/25 backdrop-blur-2xl shadow-[0_20px_60px_rgba(31,66,114,0.18)]" />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : item ? (
          <article className="fade-in rounded-[28px] border border-white/40 bg-white/25 p-6 shadow-[0_24px_60px_rgba(31,66,114,0.15)] backdrop-blur-2xl sm:p-8">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8aa0bf]">
                Portal Remaja
              </p>
              <h1 className="text-2xl font-semibold leading-snug text-[#264b7a] sm:text-3xl">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                <span>Score {item.final_score.toFixed(2)}</span>
                <span className="h-1 w-1 rounded-full bg-[#d6e3f6]" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {item.image_url ? (
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/40 bg-white/20">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8aa0bf]">
                Ringkasan
              </h2>
              <p className="text-sm leading-relaxed text-[#5b6f8a] sm:text-base">
                {item.contentSnippet ?? "Ringkasannya segera menyusul."}
              </p>
            </div>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#264b7a] bg-white/80 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Buka sumber
            </a>
          </article>
        ) : null}
      </section>

      <div className="fixed bottom-6 right-4 z-30 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
        <button
          type="button"
          onClick={() => router.replace("/teenager")}
          aria-label="Kembali ke daftar"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/40 bg-white/70 text-[#264b7a] shadow-[0_16px_40px_rgba(31,66,114,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
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
            <path d="M4 12h16" />
            <path d="M10 6l-6 6 6 6" />
          </svg>
        </button>
      </div>
    </main>
  );
}
