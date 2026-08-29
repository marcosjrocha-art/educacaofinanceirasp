import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Educação Financeira SP — Invista, poupe e planeje com clareza",
  description:
    "Guia moderno de finanças pessoais: investimentos, crédito, saída de dívidas, renda extra e economia explicados de forma simples, direta e sem juridiquês.",
  keywords: [
    "educação financeira",
    "investimentos",
    "renda fixa",
    "fundos imobiliários",
    "sair das dívidas",
    "renda extra",
    "score de crédito",
    "economia",
  ],
  authors: [{ name: "Educação Financeira SP" }],
  openGraph: {
    title: "Educação Financeira SP",
    description:
      "Finanças pessoais, investimentos e planejamento explicados de forma simples e direta.",
    siteName: "Educação Financeira SP",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
