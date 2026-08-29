export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; items: string[] }
  | { type: "highlight"; title: string; text: string };

export interface ArticleSeed {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  tags: string;
  author: string;
  readTime: number;
  views: number;
  featured: boolean;
  publishedAt: string;
  content: Block[];
}
