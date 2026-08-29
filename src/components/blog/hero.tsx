"use client";

import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { formatDate, formatViews, type Post } from "@/lib/blog-types";
import { Clock, Eye, ArrowRight, Sparkles } from "lucide-react";

export function Hero({ featured }: { featured: Post[] }) {
  const openArticle = useBlogStore((s) => s.openArticle);
  const [main, ...rest] = featured;

  if (!main) return null;

  return (
    <section className="relative overflow-hidden" aria-label="Destaques">
      {/* decorative background */}
      <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-40 -left-40 size-80 rounded-full bg-chart-3/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-bold text-primary mb-5 shadow-sm">
            <Sparkles className="size-3.5" />
            Finanças descomplicadas, sem juridiquês
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08]">
            Seu dinheiro,{" "}
            <span className="relative inline-block text-primary">
              explicado
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 120 8"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6C30 2 60 2 118 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary/40"
                />
              </svg>
            </span>{" "}
            de forma simples e atual.
          </h1>
          <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
            Investimentos, crédito, dívidas e renda extra: guias práticos e diretos
            para você tomar decisões financeiras com confiança — do primeiro real
            guardado à independência financeira.
          </p>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-5 gap-5">
          {/* Main featured */}
          {main && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              onClick={() => openArticle(main.slug)}
              className="lg:col-span-3 group relative rounded-3xl overflow-hidden text-left shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[380px] md:min-h-[440px]"
              aria-label={`Ler destaque: ${main.title}`}
            >
              { }
              <img
                src={main.cover}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground uppercase tracking-wider">
                  Destaque da semana
                </span>
                <h2 className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-xl">
                  {main.title}
                </h2>
                <p className="mt-2 text-white/75 text-sm md:text-base line-clamp-2 max-w-xl">
                  {main.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-white/70 text-xs font-medium">
                  <span>{main.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {main.readTime} min de leitura
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" /> {formatViews(main.views)}
                  </span>
                </div>
              </div>
            </motion.button>
          )}

          {/* Secondary list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.slice(0, 2).map((post, i) => (
              <motion.button
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.12 }}
                onClick={() => openArticle(post.slug)}
                className="group flex-1 flex gap-4 rounded-3xl border bg-card p-4 text-left shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                aria-label={`Ler artigo: ${post.title}`}
              >
                <div className="relative size-24 md:size-28 rounded-2xl overflow-hidden shrink-0">
                  { }
                  <img
                    src={post.cover}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col min-w-0 py-0.5">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="mt-1 font-display font-bold text-[0.95rem] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <span className="mt-auto pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3" /> {post.readTime} min
                    <span>·</span>
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                window.scrollTo({ top: 620, behavior: "smooth" });
              }}
              className="hidden lg:flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
            >
              Explorar todos os artigos
              <ArrowRight className="size-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
