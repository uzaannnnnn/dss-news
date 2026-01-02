"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import FontSizeToggle from "../../components/FontSizeToggle";
import { fetchNewsDetail } from "../../lib/api";
import type { NewsItem } from "../../lib/types";

type Segment = "adult" | "teenager" | "children";

type Params = {
  id: string;
};

export default function AdultDetailPage() {
  const router = useRouter();
  const params = useParams<Params>();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (!allowed || !params?.id) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchNewsDetail("adult", params.id)
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

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        {loading ? (
          <div className="h-80 animate-pulse rounded-3xl border border-[#d6e3f6] bg-white/90" />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : item ? (
          <article className="fade-in rounded-[28px] border border-[#d6e3f6] bg-white/90 p-6 shadow-[0_24px_60px_rgba(31,66,114,0.15)] backdrop-blur sm:p-8">
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold leading-snug text-[#264b7a] sm:text-3xl">
                {item.title}
              </h1>
              <div className="adult-card-meta flex flex-wrap items-center gap-2 uppercase tracking-[0.2em] text-[var(--adult-muted)]">
                <span>Score {item.final_score.toFixed(2)}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--adult-border)]" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {item.image_url ? (
              <div className="mt-6 overflow-hidden rounded-3xl border border-[#d6e3f6] bg-white">
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
              <p className="adult-body text-[var(--adult-ink)]">
                {item.contentSnippet}
              </p>
            </div>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#264b7a] bg-[#264b7a] px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f3b63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Buka sumber
            </a>
          </article>
        ) : null}
      </section>

      <div
        className={`fixed bottom-6 right-4 z-30 flex flex-col items-center gap-3 transition sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 ${
          isScrolling ? "scale-90 opacity-85" : "scale-100 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => router.replace("/adult")}
          aria-label="Kembali ke daftar"
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
            <path d="M4 12h16" />
            <path d="M10 6l-6 6 6 6" />
          </svg>
        </button>
        <FontSizeToggle orientation="vertical" tone="adult" />
      </div>
    </main>
  );
}
