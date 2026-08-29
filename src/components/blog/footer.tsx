"use client";

import { useBlogStore } from "@/lib/blog-store";
import { CATEGORIES } from "@/lib/blog-types";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, TrendingUp } from "lucide-react";

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "X / Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const PAGE_LINKS: { page: "quem-somos" | "privacidade" | "cookies" | "isencao" | "publicidade" | "direitos" | "contato"; label: string }[] = [
  { page: "quem-somos", label: "Quem Somos" },
  { page: "isencao", label: "Isenção de Responsabilidade" },
  { page: "privacidade", label: "Política de Privacidade" },
  { page: "cookies", label: "Política de Cookies" },
  { page: "publicidade", label: "Política de Publicidade" },
  { page: "direitos", label: "Política de Direitos Autorais" },
  { page: "contato", label: "Contato" },
];

export function Footer() {
  const goHome = useBlogStore((s) => s.goHome);
  const openCategory = useBlogStore((s) => s.openCategory);
  const openPage = useBlogStore((s) => s.openPage);

  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 max-w-sm">
            <button onClick={goHome} className="flex items-center gap-2.5 group" aria-label="Voltar ao início">
              <span className="grid place-items-center size-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:rotate-6">
                <TrendingUp className="size-5" strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-lg leading-[1.1]">
                Educação
                <br />
                <span className="text-primary">Financeira SP</span>
              </span>
            </button>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Guia moderno de finanças pessoais: investimentos, crédito, dívidas e
              renda extra explicados de forma simples, honesta e sem juridiquês.
              Conteúdo educacional — não é recomendação de investimento.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  onClick={(e) => e.preventDefault()}
                  className="grid place-items-center size-10 rounded-xl border bg-background text-muted-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <social.icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <nav aria-label="Categorias no rodapé">
            <p className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground/80">
              Categorias
            </p>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => openCategory(cat)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Institutional */}
          <nav aria-label="Links institucionais no rodapé">
            <p className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-foreground/80">
              Institucional
            </p>
            <ul className="space-y-2.5">
              {PAGE_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => openPage(link.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Educação Financeira SP — Todos os direitos
            reservados.
          </p>
          <p>
            Feito com <span className="text-primary">♥</span> em São Paulo, para todo o
            Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
