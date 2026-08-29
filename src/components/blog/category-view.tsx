"use client";

import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { CATEGORY_META, type Post } from "@/lib/blog-types";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CategoryView({
  category,
  posts,
}: {
  category: string;
  posts: Post[];
}) {
  const goHome = useBlogStore((s) => s.goHome);
  const meta = CATEGORY_META[category];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button
        variant="ghost"
        onClick={goHome}
        className="rounded-full -ml-2 mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Início
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-4"
          style={{ backgroundColor: meta?.color ?? "#fe5301" }}
        >
          Categoria
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          {category}
        </h1>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          {posts.length === 0
            ? "Em breve, novos artigos por aqui."
            : `${posts.length} ${posts.length === 1 ? "guia completo" : "guias completos"} para você dominar o tema e tomar decisões melhores com o seu dinheiro.`}
        </p>
      </motion.div>

      {posts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
