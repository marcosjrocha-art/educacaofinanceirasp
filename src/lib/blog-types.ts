export interface Block {
  type: "p" | "h2" | "h3" | "quote" | "list" | "highlight";
  text?: string;
  items?: string[];
  title?: string;
  author?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  tags: string;
  author: string;
  readTime: number;
  views: number;
  featured: boolean;
  publishedAt: string;
}

export type StaticPage =
  | "quem-somos"
  | "privacidade"
  | "cookies"
  | "isencao"
  | "publicidade"
  | "direitos"
  | "contato";

export type View =
  | { name: "home" }
  | { name: "article"; slug: string }
  | { name: "category"; category: string }
  | { name: "search" }
  | { name: "page"; page: StaticPage };

export const CATEGORIES = [
  "Investimentos",
  "Crédito e Bancos",
  "Dívidas e Negativação",
  "Renda Extra",
  "Planejamento Financeiro",
  "Economia",
] as const;

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Investimentos: { icon: "TrendingUp", color: "#fe5301" },
  "Crédito e Bancos": { icon: "CreditCard", color: "#e0457b" },
  "Dívidas e Negativação": { icon: "AlertCircle", color: "#d93636" },
  "Renda Extra": { icon: "Rocket", color: "#0e9f6e" },
  "Planejamento Financeiro": { icon: "Calculator", color: "#8b5cf6" },
  Economia: { icon: "Globe2", color: "#0891b2" },
};

export function parseContent(post: Post): Block[] {
  try {
    return JSON.parse(post.content) as Block[];
  } catch {
    return [];
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + (dateStr.includes("T") ? "" : "T12:00:00")).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "long", year: "numeric" }
  );
}

export function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1).replace(".", ",")} mil`;
  return String(views);
}
