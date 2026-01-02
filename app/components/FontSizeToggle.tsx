"use client";

import { useEffect, useState } from "react";

type FontSizeOption = "small" | "default" | "large";

type FontSizeToggleProps = {
  orientation?: "horizontal" | "vertical";
  tone?: "default" | "adult";
  className?: string;
};

const options: Array<{ label: string; value: FontSizeOption }> = [
  { label: "A-", value: "small" },
  { label: "A", value: "default" },
  { label: "A+", value: "large" },
];

const STORAGE_KEY = "adult_font_size";

export default function FontSizeToggle({
  orientation = "horizontal",
  tone = "default",
  className,
}: FontSizeToggleProps) {
  const [size, setSize] = useState<FontSizeOption>("default");
  const isVertical = orientation === "vertical";
  const isAdult = tone === "adult";

  useEffect(() => {
    const stored = window.localStorage.getItem(
      STORAGE_KEY
    ) as FontSizeOption | null;
    if (stored) {
      setSize(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-adult-scope]");
    if (root) {
      root.dataset.fontSize = size;
    }
    window.localStorage.setItem(STORAGE_KEY, size);
  }, [size]);

  return (
    <div
      className={`flex flex-col gap-2 ${isVertical ? "items-center" : ""} ${
        className ?? ""
      }`}
    >
      <div className="relative">
        <div
          role="group"
          aria-label="Font size"
          className={`flex ${
            isVertical ? "flex-col" : ""
          } rounded-3xl border p-1 ${
            isAdult
              ? "border-[#d6e3f6] bg-white/95 shadow-[0_16px_40px_rgba(31,66,114,0.12)]"
              : "border-slate-200 bg-white"
          }`}
        >
          {options.map((option) => {
            const isActive = size === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSize(option.value)}
                aria-pressed={isActive}
                className={`min-h-[44px] ${
                  isVertical ? "min-w-[44px]" : "px-4"
                } rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${
                  isAdult
                    ? "focus-visible:ring-[#264b7a]"
                    : "focus-visible:ring-amber-300"
                } ${
                  isActive
                    ? isAdult
                      ? "bg-[#264b7a] text-white shadow"
                      : "bg-slate-900 text-white shadow"
                    : isAdult
                    ? "text-[#264b7a] hover:bg-[#f1f6ff]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
