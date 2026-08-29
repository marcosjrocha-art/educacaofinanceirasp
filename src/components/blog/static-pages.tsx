"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import type { StaticPage } from "@/lib/blog-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Send, ShieldCheck, Mail, MapPin, Target, Eye, HeartHandshake } from "lucide-react";

const PAGE_META: Record<
  StaticPage,
  { title: string; subtitle: string; body: { h?: string; p: string[] }[] }
> = {
  "quem-somos": {
    title: "Quem somos",
    subtitle:
      "Um projeto independente de educação financeira feito em São Paulo para todo o Brasil.",
    body: [
      {
        p: [
          "O Educação Financeira SP nasceu de uma constatação simples e frustrante: o Brasil tem algumas das maiores taxas de juros do mundo, mas quase ninguém explica de forma clara como elas funcionam. Entre o juridiquês dos bancos e a promessa milagrosa dos influenciadores, ficou faltando o meio-termo — conteúdo honesto, prático e em linguagem de gente.",
          "Somos uma equipe de educadores, analistas e escritores apaixonados por traduzir a complexidade do sistema financeiro em guias que qualquer pessoa consegue aplicar na vida real. Não somos consultoria de investimentos e não vendemos produtos: nosso único produto é o conhecimento.",
        ],
      },
      {
        h: "Nossa missão",
        p: [
          "Democratizar o acesso a educação financeira de qualidade, ajudando brasileiros a sair das dívidas, investir com segurança e planejar o futuro com autonomia. Acreditamos que conhecimento financeiro não é privilégio — é direito de todos e ferramenta de transformação social.",
        ],
      },
    ],
  },
  privacidade: {
    title: "Política de Privacidade",
    subtitle: "Como coletamos, usamos e protegemos seus dados.",
    body: [
      {
        p: [
          "A sua privacidade é prioridade para nós. Esta política explica, de forma simples e transparente, quais dados pessoais coletamos quando você usa o blog, como os utilizamos e quais são os seus direitos conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
          "Coletamos apenas os dados que você fornece voluntariamente ao se inscrever em nossa newsletter (endereço de e-mail) ou ao entrar em contato pelo formulário (nome, e-mail e mensagem). Utilizamos essas informações exclusivamente para enviar conteúdo que você solicitou e responder às suas mensagens.",
        ],
      },
      {
        h: "Seus direitos",
        p: [
          "Você pode, a qualquer momento, solicitar acesso, correção ou exclusão dos seus dados, bem como revogar o consentimento para recebimento de comunicações. Basta entrar em contato pelos nossos canais oficiais. Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de Cookies",
    subtitle: "O que são cookies e como os utilizamos.",
    body: [
      {
        p: [
          "Cookies são pequenos arquivos armazenados no seu navegador quando você visita um site. Utilizamos cookies essenciais para o funcionamento do blog — como a memorização da sua preferência de tema claro ou escuro — e cookies de análise anônima para entender quais conteúdos são mais úteis aos leitores.",
          "Você pode bloquear ou apagar cookies a qualquer momento nas configurações do seu navegador. Ao fazer isso, recursos de personalização podem deixar de funcionar, mas todo o conteúdo do blog permanece acessível.",
        ],
      },
    ],
  },
  isencao: {
    title: "Isenção de Responsabilidade",
    subtitle: "Conteúdo educacional não constitui recomendação de investimento.",
    body: [
      {
        p: [
          "Todo o conteúdo publicado neste blog tem caráter exclusivamente educacional e informativo. Nenhum artigo, análise ou material aqui presente constitui recomendação de investimento, oferta de compra ou venda de valores mobiliários, nem substitui a consulta a profissionais habilitados como consultores de investimentos, planejadores financeiros, contadores ou advogados.",
          "Investimentos envolvem riscos, incluindo a possibilidade de perda do capital. Rentabilidade passada não garante resultados futuros. Decisões de investimento devem considerar o seu perfil de investidor, seus objetivos e sua tolerância a risco, preferencialmente com acompanhamento profissional certificado.",
        ],
      },
    ],
  },
  publicidade: {
    title: "Política de Publicidade",
    subtitle: "Transparência sobre anúncios e parcerias.",
    body: [
      {
        p: [
          "Para manter o blog gratuito e independente, podemos exibir publicidade e participar de programas de afiliados. Isso significa que, em alguns casos, podemos receber uma pequena comissão quando você contrata um serviço por meio de um link — sem custo adicional para você.",
          "A exibição de publicidade nunca influencia a opinião editorial dos nossos artigos. Recomendações de conteúdo são baseadas exclusivamente na nossa análise técnica e no que consideramos mais útil para o leitor.",
        ],
      },
    ],
  },
  direitos: {
    title: "Política de Direitos Autorais",
    subtitle: "Como usar e compartilhar nosso conteúdo.",
    body: [
      {
        p: [
          "Todo o conteúdo original publicado neste blog — textos, ilustrações, identidade visual e código — está protegido pela Lei de Direitos Autorais (Lei nº 9.610/1998). É permitido compartilhar nossos artigos citando a fonte e com link para a página original.",
          "A reprodução integral ou parcial do conteúdo para fins comerciais, sem autorização prévia por escrito, é proibida. Para solicitar permissão de uso ou denunciar uso indevido, entre em contato pelos nossos canais oficiais.",
        ],
      },
    ],
  },
  contato: {
    title: "Fale com a gente",
    subtitle:
      "Dúvidas, sugestões de temas ou parcerias — adoramos ouvir nossos leitores.",
    body: [],
  },
};

const VALUES = [
  {
    icon: Target,
    title: "Conteúdo prático",
    text: "Nada de teoria solta: cada guia termina com passos aplicáveis ainda esta semana.",
  },
  {
    icon: Eye,
    title: "Transparência radical",
    text: "Contamos como ganhamos dinheiro com o blog e nunca recomendação disfarçada de publicidade.",
  },
  {
    icon: HeartHandshake,
    title: "Linguagem de gente",
    text: "Se um adolescente não entende, reescrevemos. Simplicidade é respeito com o leitor.",
  },
];

export function StaticPageView({ page }: { page: StaticPage }) {
  const goHome = useBlogStore((s) => s.goHome);
  const meta = PAGE_META[page];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Button
        variant="ghost"
        onClick={goHome}
        className="rounded-full -ml-2 mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Início
      </Button>

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{meta.subtitle}</p>
      </motion.header>

      {page === "quem-somos" && <AboutContent />}

      <div className="article-body">
        {meta.body.map((section, i) => (
          <div key={i}>
            {section.h && <h2>{section.h}</h2>}
            {section.p.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        ))}
      </div>

      {page === "contato" && <ContactForm />}
    </div>
  );
}

function AboutContent() {
  return (
    <div className="mb-10 rounded-3xl overflow-hidden border shadow-lg aspect-[16/7] relative">
      { }
      <img src="/covers/quem-somos.jpg" alt="" className="absolute inset-0 size-full object-cover" />
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");
      setSent(true);
      toast({
        title: "Mensagem enviada!",
        description: "Responderemos em até 2 dias úteis.",
      });
    } catch (err) {
      toast({
        title: "Não foi possível enviar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-5 gap-6 mt-8">
      <div className="md:col-span-2 space-y-4">
        {[
          { icon: Mail, title: "E-mail", text: "contato@educacaofinanceirasp.com.br" },
          { icon: MapPin, title: "Base", text: "São Paulo — SP, Brasil" },
          {
            icon: ShieldCheck,
            title: "Privacidade",
            text: "Seus dados não são compartilhados com terceiros.",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-start rounded-2xl border bg-card p-4">
            <span className="grid place-items-center size-10 rounded-xl bg-primary/10 text-primary shrink-0">
              <item.icon className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="md:col-span-3 rounded-3xl border bg-card p-6 space-y-4 shadow-sm"
      >
        {sent ? (
          <div className="py-10 text-center">
            <ShieldCheck className="size-12 text-chart-2 mx-auto mb-3" />
            <p className="font-display font-bold text-xl">Mensagem enviada!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Obrigado pelo contato — responderemos em breve.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-full"
              onClick={() => {
                setSent(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
            >
              Enviar outra mensagem
            </Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-name">Nome</Label>
                <Input
                  id="c-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">E-mail</Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-msg">Mensagem</Label>
              <Textarea
                id="c-msg"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem (mínimo 10 caracteres)…"
                rows={5}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full font-bold h-11">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <>Enviar mensagem <Send className="size-4" /></>}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
