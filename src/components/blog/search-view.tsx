"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { CATEGORIES, type Post } from "@/lib/blog-types";
import { PostCardHorizontal } from "./post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

export function SearchView({ allPosts }: { allPosts: Post[] }) {
  const goHome = useBlogStore((s) => s.goHome);
  const searchQuery = useBlogStore((s) => s.searchQuery);
  const setSearchQuery = useBlogStore((s) => s.setSearchQuery);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    // brief loading state so skeleton is perceivable and UX feels responsive
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allPosts, searchQuery]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Button
        variant="ghost"
        onClick={goHome}
        className="rounded-full -ml-2 mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Início
      </Button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
          Buscar artigos
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ex.: tesouro direto, score, sair das dívidas…"
            className="h-14 rounded-2xl pl-12 text-base shadow-sm"
            aria-label="Termo de busca"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : searchQuery.trim() === "" ? (
          <div className="mt-10">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Buscas populares
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "tesouro direto",
                "score de crédito",
                "sair das dívidas",
                "fundos imobiliários",
                "renda extra",
                "pix",
              ].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>

            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Ou navegue por categoria
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  className="rounded-full"
                  onClick={() => useBlogStore.getState().openCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed p-10 text-center">
            <Search className="size-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-display font-bold text-lg">Nenhum resultado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tente outro termo — por exemplo “investimentos” ou “dívidas”.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} {results.length === 1 ? "resultado" : "resultados"} para{" "}
              <strong className="text-foreground">“{searchQuery}”</strong>
            </p>
            <div className="space-y-3">
              {results.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border bg-card p-3 shadow-sm"
                >
                  <PostCardHorizontal post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
