"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useBlogStore } from "@/lib/blog-store";
import { CATEGORIES } from "@/lib/blog-types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Home,
} from "lucide-react";

function Logo() {
  const { goHome } = useBlogStore();
  return (
    <button
      onClick={goHome}
      className="flex items-center gap-2.5 group shrink-0"
      aria-label="Educação Financeira SP — início"
    >
      <span className="relative grid place-items-center size-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        <TrendingUp className="size-5" strokeWidth={2.5} />
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-chart-2 border-2 border-background" />
      </span>
      <span className="font-display font-extrabold text-lg leading-[1.1] tracking-tight text-left">
        Educação
        <br />
        <span className="text-primary">Financeira SP</span>
      </span>
    </button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema claro/escuro"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full size-10"
    >
      <Sun className="size-[18px] hidden dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </Button>
  );
}

function SearchTrigger() {
  const openSearch = useBlogStore((s) => s.openSearch);
  return (
    <button
      onClick={() => openSearch()}
      className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full border bg-card/60 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-52 lg:w-60"
      aria-label="Buscar artigos"
    >
      <Search className="size-4" />
      Buscar artigos…
      <kbd className="ml-auto text-[10px] font-semibold bg-muted rounded px-1.5 py-0.5 border">
        /
      </kbd>
    </button>
  );
}

export function Header() {
  const view = useBlogStore((s) => s.view);
  const goHome = useBlogStore((s) => s.goHome);
  const openCategory = useBlogStore((s) => s.openCategory);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(tag)) {
        e.preventDefault();
        useBlogStore.getState().openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isHome = view.name === "home";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-[0_8px_30px_-12px_rgb(0_0_0/0.12)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-3">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            <Button
              variant="ghost"
              onClick={goHome}
              className={`rounded-full text-sm font-medium ${isHome ? "text-primary" : ""}`}
            >
              <Home className="size-4 mr-1.5" /> Início
            </Button>

            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <Button
                variant="ghost"
                onClick={() => setCatOpen((v) => !v)}
                className="rounded-full text-sm font-medium"
                aria-haspopup="true"
                aria-expanded={catOpen}
              >
                Categorias
                <ChevronDown
                  className={`size-4 ml-1 transition-transform ${catOpen ? "rotate-180" : ""}`}
                />
              </Button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-72"
                  >
                    <div className="rounded-2xl border bg-popover shadow-xl p-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => openCategory(cat)}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-primary" />
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              onClick={() => useBlogStore.getState().openPage("quem-somos")}
              className="rounded-full text-sm font-medium"
            >
              Quem somos
            </Button>
          </nav>

          <div className="flex items-center gap-1.5">
            <SearchTrigger />
            <ThemeToggle />

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full size-10 md:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="px-5 py-5 border-b">
                    <Logo />
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Menu mobile">
                    <button
                      onClick={() => {
                        goHome();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl font-semibold hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <Home className="size-4 text-primary" /> Início
                    </button>
                    <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Categorias
                    </p>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          openCategory(cat);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <span className="size-2 rounded-full bg-primary/70" />
                        {cat}
                      </button>
                    ))}
                    <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Institucional
                    </p>
                    {(
                      [
                        ["quem-somos", "Quem somos"],
                        ["isencao", "Isenção de responsabilidade"],
                        ["privacidade", "Política de privacidade"],
                        ["cookies", "Política de cookies"],
                        ["publicidade", "Política de publicidade"],
                        ["direitos", "Direitos autorais"],
                        ["contato", "Contato"],
                      ] as const
                    ).map(([page, label]) => (
                      <button
                        key={page}
                        onClick={() => {
                          useBlogStore.getState().openPage(page);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </nav>
                  <div className="p-4 border-t">
                    <div className="rounded-2xl bg-primary/10 p-4 flex gap-3 items-start">
                      <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Conteúdo educacional gratuito sobre finanças pessoais, feito em São
                        Paulo para todo o Brasil.
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
