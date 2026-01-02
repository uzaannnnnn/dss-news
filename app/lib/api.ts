import type { NewsItem } from "./types";

type Segment = "adult" | "teenager" | "children";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type NewsQuery = {
  page?: number;
  limit?: number;
  q?: string;
};

export async function fetchNews(
  segment: Segment,
  query: NewsQuery = {}
): Promise<NewsItem[]> {
  const params = new URLSearchParams();
  if (query.page) {
    params.set("page", String(query.page));
  }
  if (query.limit) {
    params.set("limit", String(query.limit));
  }
  if (query.q) {
    params.set("q", query.q);
  }
  const queryString = params.toString();
  const response = await fetch(
    `${BASE_URL}/api/news/${segment}${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = (await response.json()) as NewsItem[];
  return data;
}

export async function fetchNewsDetail(
  segment: Segment,
  id: string
): Promise<NewsItem> {
  const response = await fetch(`${BASE_URL}/api/news/${segment}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch news detail");
  }

  const data = (await response.json()) as NewsItem;
  return data;
}
