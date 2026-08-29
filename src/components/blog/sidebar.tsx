"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import { formatViews, type Post } from "@/lib/blog-types";
import { PostCardHorizontal } from "./post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Flame, Mail, Send, UserRound, Loader2, BadgeCheck } from "lucide-react";

export function Sidebar({ popular }: { popular: Post[] }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24" aria-label="Barra lateral">
      {/* Popular */}
      <div className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="grid place-items-center size-9 rounded-xl bg-primary/10 text-primary">
            <Flame className="size-4.5" />
          </span>
          <h3 className="font-display font-extrabold text-lg">Mais lidos da semana</h3>
        </div>
        <div className="space-y-4">
          {popular.slice(0, 5).map((post, i) => (
            <PostCardHorizontal key={post.id} post={post} rank={i + 1} />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterWidget />

      {/* About */}
      <div className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="grid place-items-center size-9 rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-4.5" />
          </span>
          <h3 className="font-display font-extrabold text-lg">Sobre o blog</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          O <strong className="text-foreground">Educação Financeira SP</strong> nasceu
          com uma missão simples: tornar o conhecimento financeiro acessível a todos.
          Traduzimos juros, índices e burocracia em linguagem de gente.
        </p>
        <Button
          variant="outline"
          className="w-full rounded-full font-semibold"
          onClick={() => useBlogStore.getState().openPage("quem-somos")}
        >
          Conheça nossa história
        </Button>
      </div>
    </aside>
  );
}

function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  async function subscribe(e: React.FormEvent) {
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
      setEmail("");
      toast({
        title: "Inscrição confirmada!",
        description: "Você receberá as novidades no seu e-mail.",
      });
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#c2410c] p-6 text-primary-foreground shadow-xl shadow-primary/20"
    >
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-14 -left-8 size-36 rounded-full bg-black/10 blur-2xl" />
      <div className="relative">
        <span className="grid place-items-center size-11 rounded-2xl bg-white/15 backdrop-blur mb-4">
          <Mail className="size-5" />
        </span>
        <h3 className="font-display font-extrabold text-xl leading-tight">
          Newsletter semanal
        </h3>
        <p className="mt-2 text-sm text-white/80 leading-relaxed">
          Receba as novidades e os melhores guias diretamente no seu e-mail. Sem
          spam, cancele quando quiser.
        </p>
        {done ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur px-4 py-3 text-sm font-semibold">
            <BadgeCheck className="size-5" /> Inscrição feita com sucesso!
          </div>
        ) : (
          <form onSubmit={subscribe} className="mt-4 space-y-2.5">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-11 rounded-2xl bg-white/95 border-transparent text-foreground placeholder:text-muted-foreground"
              aria-label="Seu e-mail"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl bg-black/25 hover:bg-black/35 text-white font-bold backdrop-blur"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Inscrever gratuitamente <Send className="size-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
