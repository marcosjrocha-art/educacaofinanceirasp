"use client";

import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { formatDate, formatViews, type Post } from "@/lib/blog-types";
import { Clock, Eye, ArrowUpRight } from "lucide-react";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const openArticle = useBlogStore((s) => s.openArticle);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group"
    >
      <button
        onClick={() => openArticle(post.slug)}
        className="w-full text-left rounded-3xl overflow-hidden bg-card border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
        aria-label={`Ler artigo: ${post.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          { }
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-bold tracking-wide text-primary">
            {post.category}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-2.5">
          <h3 className="font-display font-bold text-[1.05rem] leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground border-t">
            <span className="font-medium text-foreground/70">{post.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> {post.readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" /> {formatViews(post.views)}
            </span>
            <ArrowUpRight className="ml-auto size-4 text-primary opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
          </div>
        </div>
      </button>
    </motion.article>
  );
}

export function PostCardHorizontal({ post, rank }: { post: Post; rank?: number }) {
  const openArticle = useBlogStore((s) => s.openArticle);
  return (
    <button
      onClick={() => openArticle(post.slug)}
      className="group flex gap-4 w-full text-left items-start rounded-2xl p-2 -m-2 hover:bg-accent/50 transition-colors"
      aria-label={`Ler artigo: ${post.title}`}
    >
      {typeof rank === "number" && (
        <span className="font-display text-2xl font-extrabold text-primary/30 group-hover:text-primary transition-colors leading-none pt-1 w-7 shrink-0 text-center">
          {rank}
        </span>
      )}
      <div className="relative size-20 rounded-2xl overflow-hidden shrink-0">
        { }
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-primary mb-1">{post.category}</p>
        <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
          <Clock className="size-3" /> {post.readTime} min
          <span>·</span>
          <Eye className="size-3" /> {formatViews(post.views)}
        </p>
      </div>
    </button>
  );
}
