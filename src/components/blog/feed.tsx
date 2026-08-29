"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, type Post } from "@/lib/blog-types";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { Newspaper, ChevronDown } from "lucide-react";

export function Feed({
  posts,
  activeCategory,
  onCategoryChange,
}: {
  posts: Post[];
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
}) {
  const [visible, setVisible] = useState(6);

  const list = useMemo(
    () =>
      activeCategory
        ? posts.filter((p) => p.category === activeCategory)
        : posts,
    [posts, activeCategory]
  );
  const filtered = list.slice(0, visible);
  const hasMore = list.length > visible;

  // reset pagination when switching category
  const key = activeCategory ?? "all";
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setVisible(6);
  }

  return (
    <section aria-label="Todos os artigos" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid place-items-center size-10 rounded-xl bg-primary/10 text-primary">
          <Newspaper className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
            Últimos artigos
          </h2>
          <p className="text-sm text-muted-foreground">
            Guias práticos publicados toda semana
          </p>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Pill active={!activeCategory} onClick={() => onCategoryChange(null)}>
          Todos
        </Pill>
        {CATEGORIES.map((cat) => (
          <Pill
            key={cat}
            active={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-12 text-center text-muted-foreground">
          Nenhum artigo nesta categoria ainda. Volte em breve!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full font-bold px-8"
            onClick={() => setVisible((v) => v + 6)}
          >
            Carregar mais artigos
            <ChevronDown className="size-4" />
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Mostrando {filtered.length} de {list.length} artigos
          </p>
        </div>
      )}
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      }`}
      aria-pressed={active}
    >
      {children}
    </motion.button>
  );
}
