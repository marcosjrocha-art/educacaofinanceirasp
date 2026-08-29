"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MailOpen, BadgeCheck, TrendingUp, Users, FileText, BookOpen } from "lucide-react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export function StatsBand({ totalViews, totalPosts }: { totalViews: number; totalPosts: number }) {
  const stats = [
    { icon: FileText, value: totalPosts, suffix: "", label: "guias completos publicados" },
    { icon: TrendingUp, value: totalViews, suffix: "+", label: "leituras acumuladas" },
    { icon: Users, value: 12800, suffix: "+", label: "leitores por mês" },
    { icon: BookOpen, value: 96, suffix: "%", label: "dos leitores recomendam" },
  ];

  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background my-16"
      aria-label="Estatísticas do blog"
    >
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="absolute -top-24 right-10 size-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center lg:text-left"
          >
            <stat.icon className="size-6 text-primary mb-3 mx-auto lg:mx-0" />
            <p className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm opacity-60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setDone(true);
      toast({ title: "Inscrição confirmada!", description: "Bem-vindo(a) à comunidade." });
    } catch (err) {
      toast({
        title: "Ops, algo deu errado",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-[#c2410c] text-primary-foreground my-16"
      aria-label="Assine a newsletter"
    >
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative max-w-3xl mx-auto px-6 py-14 text-center">
        <span className="grid place-items-center size-14 rounded-2xl bg-white/15 backdrop-blur mx-auto mb-5">
          <MailOpen className="size-7" />
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
          Um e-mail por semana. Zero enrolação.
        </h2>
        <p className="mt-3 text-white/85 max-w-xl mx-auto leading-relaxed">
          Os melhores guias, dicas práticas e análises da semana direto na sua caixa
          de entrada. Junte-se a milhares de leitores que já organizaram suas finanças
          com a gente.
        </p>
        {done ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur px-6 py-3.5 font-semibold">
            <BadgeCheck className="size-5" /> Tudo certo! Confira seu e-mail.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu melhor e-mail"
              className="h-12 flex-1 rounded-2xl bg-white/95 border-transparent text-foreground placeholder:text-muted-foreground"
              aria-label="E-mail para newsletter"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl bg-black/25 hover:bg-black/35 text-white font-bold px-7"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Assinar grátis"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-xs text-white/60">
          Ao assinar, você concorda com nossa política de privacidade. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}

export function HomeBands({ totalViews, totalPosts }: { totalViews: number; totalPosts: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <StatsBand totalViews={totalViews} totalPosts={totalPosts} />
      <NewsletterBand />
    </div>
  );
}
