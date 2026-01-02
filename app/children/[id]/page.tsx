"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchNewsDetail } from "../../lib/api";
import type { NewsItem } from "../../lib/types";

type Segment = "adult" | "teenager" | "children";

type Params = {
  id: string;
};

export default function ChildrenDetailPage() {
  const router = useRouter();
  const params = useParams<Params>();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

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
    if (!allowed || !params?.id) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchNewsDetail("children", params.id)
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
    if (!isZoomed) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  if (allowed === false) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="font-child relative min-h-dvh overflow-hidden bg-[#eef4ff] text-[#264b7a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[#d5e6ff] blur-3xl" />
        <div className="absolute top-12 right-10 h-60 w-60 rounded-full bg-[#ffd6a5]/70 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-6rem] h-96 w-96 rounded-full bg-[#caffbf]/70 blur-3xl" />
        <div className="absolute left-10 top-28 h-44 w-44 rounded-full bg-white/80 blur-2xl" />
        <div className="kid-float absolute right-20 top-16 h-10 w-10 rounded-2xl border-2 border-dashed border-[#8ecae6]/60" />
        <div className="kid-spin absolute left-20 bottom-20 h-12 w-12 rounded-full border-2 border-[#ffadad]/70" />
        <div className="kid-bounce absolute right-32 bottom-28 h-8 w-16 rounded-full bg-[#ffd6a5]/70" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12">
        {loading ? (
          <div className="h-80 animate-pulse rounded-3xl border border-white/50 bg-white/70 backdrop-blur-xl" />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : item ? (
          <article className="fade-in relative overflow-hidden rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_24px_60px_rgba(31,66,114,0.15)] backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-0">
              <div className="kid-wiggle absolute left-6 top-6 h-8 w-8 rounded-full bg-[#ffd6a5]" />
              <div className="kid-float-slow absolute right-10 top-10 h-10 w-10 rounded-2xl bg-[#bde0fe]" />
              <div className="kid-bounce absolute left-125 bottom-2 h-6 w-16 rounded-full bg-[#caffbf]" />
            </div>

            <div className="relative space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8aa0bf]">
                Kids News Club
              </p>
              <h1 className="text-2xl font-bold leading-snug text-[#264b7a] sm:text-3xl">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8aa0bf]">
                <span className="rounded-full bg-[#fff3e0] px-3 py-1">
                  Aman untuk anak
                </span>
                <span className="h-1 w-1 rounded-full bg-[#d6e3f6]" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {item.image_url ? (
              <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/60 bg-white/80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,165,0.35),_transparent_65%)] opacity-80" />
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="group relative cursor-zoom-in block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
                  aria-label="Perbesar gambar"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-64 w-full object-contain transition duration-300 ease-out group-hover:scale-[1.02] sm:h-72"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#264b7a] shadow">
                    Zoom
                  </span>
                </button>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8aa0bf]">
                Ringkasan
              </h2>
              <p className="text-sm leading-relaxed text-[#5b6f8a] font-medium sm:text-base">
                {item.contentSnippet ?? "Ringkasannya segera menyusul."}
              </p>
            </div>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#264b7a] bg-white/80 px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a]"
            >
              Baca sumber asli
            </a>
          </article>
        ) : null}
      </section>

      <div className="fixed bottom-6 right-4 z-30 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
        <button
          type="button"
          onClick={() => router.replace("/children")}
          aria-label="Kembali ke daftar"
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
            <path d="M4 12h16" />
            <path d="M10 6l-6 6 6 6" />
          </svg>
        </button>
      </div>
      {isZoomed && item?.image_url ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="max-h-[80vh] w-auto max-w-[90vw] rounded-3xl border border-white/60 object-contain shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </main>
  );
}
