import Link from "next/link";
import type { NewsItem } from "../lib/types";

type Segment = "adult" | "teenager" | "children";

type NewsCardProps = {
  item: NewsItem;
  segment: Segment;
};

const estimateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return minutes;
};

const ageLabelMap: Record<NewsItem["age_class"], string> = {
  ADULT: "Dewasa",
  TEENAGER: "Remaja",
  CHILDREN: "Anak-anak",
};

export default function NewsCard({ item, segment }: NewsCardProps) {
  const isAdult = segment === "adult";
  const createdAt = new Date(item.created_at);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? ""
    : createdAt.toLocaleDateString();
  const readingSource = item.contentSnippet || item.title || "";
  const readingTime = readingSource ? estimateReadingTime(readingSource) : null;
  const ageLabel = ageLabelMap[item.age_class] ?? item.age_class;

  return (
    <Link
      href={`/${segment}/${item.id}`}
      className={`group flex h-[23rem] flex-col overflow-hidden rounded-3xl border text-left transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 ${
        isAdult
          ? "border-[var(--adult-border)] bg-[var(--adult-card)] shadow-[0_16px_38px_rgba(31,66,114,0.08)] hover:shadow-[0_24px_60px_rgba(31,66,114,0.16)] focus-visible:ring-[var(--adult-accent)]"
          : "border-white/10 bg-slate-900/70 hover:border-cyan-200/40 hover:bg-slate-900/90 hover:shadow-[0_20px_45px_rgba(15,23,42,0.45)] focus-visible:ring-cyan-300"
      } ${isAdult ? "hover:-translate-y-0.5" : "hover:-translate-y-1"}`}
    >
      {item.image_url ? (
        <div
          className={`w-full overflow-hidden ${
            isAdult ? "h-40" : "aspect-[16/10]"
          } ${isAdult ? "bg-[#eef4ff]" : "bg-slate-900"}`}
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          className={`w-full ${
            isAdult ? "h-40" : "aspect-[16/10]"
          } ${isAdult ? "bg-[var(--adult-bg)]" : "bg-slate-800"}`}
        />
      )}
      <div className="flex h-full flex-col gap-4 p-5">
        {isAdult && (
          <div className="flex flex-wrap items-center gap-2">
            {readingTime ? (
              <span className="rounded-full border border-[#d6e3f6] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5b6f8a]">
                {readingTime} menit baca
              </span>
            ) : null}
          </div>
        )}
        {isAdult ? (
          <div className="adult-card-meta flex flex-wrap items-center gap-2 uppercase tracking-[0.2em] text-[var(--adult-muted)]">
            <span>Score {item.final_score.toFixed(2)}</span>
            {formattedDate ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[var(--adult-border)]" />
                <span>{formattedDate}</span>
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 uppercase tracking-[0.2em] text-xs text-slate-400">
            <span>{item.age_class}</span>
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            <span>Score {item.final_score.toFixed(2)}</span>
            {formattedDate ? (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-500" />
                <span>{formattedDate}</span>
              </>
            ) : null}
          </div>
        )}
        <h3
          className={`clamp-3 font-semibold ${
            isAdult
              ? "adult-card-title text-[var(--adult-ink)]"
              : "text-sm text-slate-50 sm:text-base"
          }`}
        >
          {item.title}
        </h3>
        <div
          className={`mt-auto ${
            isAdult
              ? "adult-card-cta text-[var(--adult-muted)]"
              : "text-xs text-slate-400"
          }`}
        >
          Baca selengkapnya
        </div>
      </div>
    </Link>
  );
}
