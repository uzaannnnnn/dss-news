export type AgeClass = "ADULT" | "TEENAGER" | "CHILDREN";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  image_url: string;
  contentSnippet?: string;
  final_score: number;
  age_class: AgeClass;
  created_at: string;
};
