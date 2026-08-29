"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { formatDate, formatViews, parseContent, type Post } from "@/lib/blog-types";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Eye,
  CalendarDays,
  ListChecks,
  Lightbulb,
  Quote,
  Link2,
  Check,
  Share2,
  MessageCircle,
} from "lucide-react";

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

export function ArticleView({ post, allPosts }: { post: Post; allPosts: Post[] }) {
  const goHome = useBlogStore((s) => s.goHome);
  const progress = useReadingProgress();
  const [copied, setCopied] = useState(false);
  const countedRef = useRef(false);

  const blocks = parseContent(post);
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .concat(allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3);

  // count a view once per mount
  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;
    fetch(`/api/posts/${post.slug}/view`, { method: "POST" }).catch(() => {});
  }, [post.slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`${post.title} — Educação Financeira SP`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="pb-16">
      {/* reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary to-[#f97316] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={goHome}
          className="rounded-full -ml-2 mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar para o início
        </Button>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            {post.category}
          </span>
          <h1 className="font-display text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-[1.12]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <span className="grid place-items-center size-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {post.author.charAt(0)}
              </span>
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> {post.readTime} min de leitura
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-4" /> {formatViews(post.views)} leituras
            </span>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 relative rounded-3xl overflow-hidden aspect-[16/8] shadow-2xl"
        >
          { }
          <img src={post.cover} alt="" className="absolute inset-0 size-full object-cover" />
        </motion.div>

        {/* share bar */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
            <Share2 className="size-4" /> Compartilhar:
          </span>
          <a
            href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-4 py-1.5 text-xs font-bold hover:bg-accent transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-4 py-1.5 text-xs font-bold hover:bg-accent transition-colors"
          >
            Telegram
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-4 py-1.5 text-xs font-bold hover:bg-accent transition-colors"
          >
            Facebook
          </a>
          <button
            onClick={copyLink}
            className="rounded-full border px-4 py-1.5 text-xs font-bold hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-chart-2" /> Link copiado!
              </>
            ) : (
              <>
                <Link2 className="size-3.5" /> Copiar link
              </>
            )}
          </button>
        </div>

        <Separator className="my-8" />

        {/* body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="article-body"
        >
          {blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return <h2 key={i}>{block.text}</h2>;
              case "h3":
                return <h3 key={i}>{block.text}</h3>;
              case "p":
                return <p key={i}>{block.text}</p>;
              case "list":
                return (
                  <ul key={i}>
                    {block.items?.map((item, j) => (
                      <li key={j}>
                        <span className="mt-[9px] size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote
                    key={i}
                    className="relative my-8 rounded-3xl border-l-4 border-primary bg-primary/5 px-6 py-5 pl-8"
                  >
                    <Quote className="absolute -top-3 left-5 size-7 text-primary bg-background rounded-full p-1" />
                    <p className="font-display text-lg font-semibold leading-relaxed mb-0!">
                      “{block.text}”
                    </p>
                    {block.author && (
                      <cite className="block mt-2 text-sm text-muted-foreground not-italic">
                        — {block.author}
                      </cite>
                    )}
                  </blockquote>
                );
              case "highlight":
                return (
                  <div
                    key={i}
                    className="my-8 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-primary/5 p-6"
                  >
                    <p className="flex items-center gap-2 font-display font-bold text-primary mb-2!">
                      <Lightbulb className="size-5" /> {block.title}
                    </p>
                    <p className="mb-0! text-[0.98rem]">{block.text}</p>
                  </div>
                );
              default:
                return null;
            }
          })}
        </motion.div>

        {/* tags */}
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>

        <Separator className="my-10" />

        {/* related */}
        <section aria-label="Leia também">
          <h2 className="font-display text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
            <ListChecks className="size-5 text-primary" /> Leia também
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-3xl bg-secondary/60 border p-6 flex flex-col sm:flex-row items-center gap-4">
          <MessageCircle className="size-8 text-primary shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display font-bold">Ficou com alguma dúvida?</p>
            <p className="text-sm text-muted-foreground">
              Fale com a gente — adoramos receber sugestões de temas para os próximos
              guias.
            </p>
          </div>
          <Button
            className="rounded-full font-bold"
            onClick={() => useBlogStore.getState().openPage("contato")}
          >
            Entrar em contato
          </Button>
        </div>
      </div>
    </div>
  );
}
