import { create } from "zustand";
import type { View, StaticPage } from "./blog-types";

interface BlogState {
  view: View;
  searchQuery: string;
  navigate: (view: View) => void;
  goHome: () => void;
  openArticle: (slug: string) => void;
  openCategory: (category: string) => void;
  openSearch: () => void;
  openPage: (page: StaticPage) => void;
  setSearchQuery: (q: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  view: { name: "home" },
  searchQuery: "",
  navigate: (view) => set({ view }),
  goHome: () => set({ view: { name: "home" } }),
  openArticle: (slug) => set({ view: { name: "article", slug } }),
  openCategory: (category) => set({ view: { name: "category", category } }),
  openSearch: () => set({ view: { name: "search" } }),
  openPage: (page) => set({ view: { name: "page", page } }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
