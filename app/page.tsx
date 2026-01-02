"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Segment = "adult" | "teenager" | "children";

type Option = {
  label: string;
  value: Segment;
  route: string;
  range: string;
  description: string;
  fontClass: string;
  imageSrc: string;
};

const options: Option[] = [
  {
    label: "Anak - Anak",
    value: "children",
    route: "/children",
    range: "7 - 12 tahun",
    description: "Berita ringan, fakta seru, dan bahasa sederhana.",
    fontClass: "font-child",
    imageSrc: "/age/child.png",
  },
  {
    label: "Remaja",
    value: "teenager",
    route: "/teenager",
    range: "13 - 20 tahun",
    description: "Tren, komunitas, dan cerita yang relate.",
    fontClass: "font-teen",
    imageSrc: "/age/teen.png",
  },
  {
    label: "Dewasa",
    value: "adult",
    route: "/adult",
    range: "21+ tahun",
    description: "Analisis mendalam, bisnis, dan isu global.",
    fontClass: "font-adult",
    imageSrc: "/age/adult.png",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const routeBySegment = useMemo(() => {
    return {
      adult: "/adult",
      teenager: "/teenager",
      children: "/children",
    } as const;
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("age_segment") as Segment | null;
    if (stored && routeBySegment[stored]) {
      router.replace(routeBySegment[stored]);
      return;
    }
    setReady(true);
  }, [router, routeBySegment]);

  const handleSelect = (value: Segment) => {
    if (isNavigating) {
      return;
    }
    setSelectedSegment(value);
    setIsNavigating(true);
    window.localStorage.setItem("age_segment", value);
    router.replace(routeBySegment[value]);
  };

  if (!ready) {
    return <div className="min-h-dvh" />;
  }

  const selectedOption = selectedSegment
    ? options.find((item) => item.value === selectedSegment)
    : null;

  const toneClass =
    selectedSegment === "children"
      ? "text-[#f59e0b]"
      : selectedSegment === "teenager"
        ? "text-[#7c3aed]"
        : selectedSegment === "adult"
          ? "text-[#1f3b63]"
          : "text-[#264b7a]";

  const barClass =
    selectedSegment === "children"
      ? "bg-[#f59e0b]"
      : selectedSegment === "teenager"
        ? "bg-[#7c3aed]"
        : selectedSegment === "adult"
          ? "bg-[#1f3b63]"
          : "bg-[#264b7a]";

  const renderIllustration = (src: string, label: string) => {
    return (
      <Image
        src={src}
        alt={`Ilustrasi ${label}`}
        fill
        sizes="(max-width: 640px) 224px, 224px"
        className="object-contain"
      />
    );
  };

  const renderDecorations = (segment: Segment) => {
    if (segment === "children") {
      return (
        <div className="pointer-events-none absolute inset-0">
          <div className="deco-float absolute left-3 top-3 h-7 w-7 rounded-full bg-[#ffd166]/90" />
          <div className="deco-bob absolute right-5 top-6 h-4 w-4 rounded-sm bg-[#06d6a0]/90" />
          <div className="deco-float-slow absolute bottom-6 left-6 h-6 w-6 rounded-full bg-[#a0c4ff]/90" />
          <div className="deco-spin absolute bottom-5 right-6 h-10 w-10 rounded-2xl border-2 border-dashed border-[#ff9f1c]/70" />
        </div>
      );
    }

    if (segment === "teenager") {
      return (
        <div className="pointer-events-none absolute inset-0">
          <div className="deco-float absolute left-4 top-6 h-2 w-12 -rotate-6 rounded-full bg-[#3b82f6]/70" />
          <div className="deco-bob absolute right-6 top-8 h-10 w-10 rounded-2xl bg-[conic-gradient(from_120deg,#22d3ee,#a855f7,#60a5fa)] opacity-70" />
          <div className="deco-float-slow absolute bottom-6 left-6 h-12 w-2 rotate-12 rounded-full bg-[#f97316]/60" />
          <div className="deco-pulse absolute bottom-6 right-6 h-6 w-6 rounded-full border border-[#38bdf8]/80" />
        </div>
      );
    }

    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="deco-float-slow absolute left-6 top-6 h-12 w-12 rounded-full border border-[#1f3b63]/15" />
        <div className="deco-spin absolute right-7 top-5 h-10 w-10 rounded-lg border border-[#1f3b63]/20" />
        <div className="deco-pulse absolute bottom-6 left-5 h-8 w-20 rounded-full bg-[#1f3b63]/5" />
        <div className="deco-bob absolute bottom-6 right-5 h-6 w-6 rounded-full bg-[#1f3b63]/10" />
      </div>
    );
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#eef4ff]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#d5e6ff] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-[#c8e3ff] blur-3xl" />
        <div className="absolute left-8 top-24 h-44 w-44 rounded-full bg-white/80 blur-2xl" />
      </div>

      <div className="fixed inset-0 z-10 flex items-center justify-center px-5 py-10">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
          className="fade-in w-full max-w-5xl rounded-[32px] bg-white/95 p-6 shadow-[0_28px_70px_rgba(31,66,114,0.18)] backdrop-blur sm:p-10"
        >
          {isNavigating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[32px] bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-[#264b7a]">
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#c8d9f2] border-t-[#264b7a]" />
                <p className="text-sm font-medium">
                  Membuka{" "}
                  <span className={`font-semibold ${toneClass}`}>
                    {selectedOption?.label ?? "konten"}
                  </span>
                  ...
                </p>
                <div className="h-2 w-56 overflow-hidden rounded-full bg-[#dbe6f7]">
                  <div className={`progress-bar h-full w-2/3 ${barClass}`} />
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3 text-center">
            <h1
              id="age-title"
              className="text-3xl font-semibold text-[#264b7a] sm:text-4xl"
            >
              Pilih Kategori Konten yang Sesuai Usia
            </h1>
            <p className="text-sm text-[#5b6f8a] sm:text-base">
              Kami akan menyesuaikan berita berdasarkan pilihan Anda.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={isNavigating}
                aria-busy={isNavigating}
                className={`group cursor-pointer flex h-full flex-col rounded-3xl bg-[radial-gradient(circle_at_top,rgba(58,110,165,0.18),transparent_70%)] p-5 text-left shadow-lg transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(28,57,96,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#264b7a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${option.fontClass}`}
                aria-label={`Kategori ${option.label}`}
              >
                <div className="text-center mb-3">
                  <p className="text-2xl font-bold text-[#264b7a]">
                    {option.label}
                  </p>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8aa0bf]">
                    {option.range}
                  </p>
                </div>

                <div className="relative mx-auto flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl">
                  <div className="absolute inset-0" />
                  {renderDecorations(option.value)}
                  {renderIllustration(option.imageSrc, option.label)}
                </div>

              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
