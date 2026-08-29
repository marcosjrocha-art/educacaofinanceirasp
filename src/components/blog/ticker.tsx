"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { label: "SELIC", value: "10,75% a.a.", dir: "down" },
  { label: "IPCA 12M", value: "3,91%", dir: "down" },
  { label: "CDI", value: "10,65% a.a.", dir: "down" },
  { label: "POUPANÇA", value: "0,63% a.m.", dir: "flat" },
  { label: "IBOVESPA", value: "148.250 pts", dir: "up" },
  { label: "DÓLAR", value: "R$ 5,32", dir: "down" },
  { label: "OURO", value: "US$ 2.410", dir: "up" },
  { label: "TESOURO IPCA+ 2029", value: "6,42% a.a.", dir: "flat" },
  { label: "FTSE NAREIT FII", value: "+8,3% 12M", dir: "up" },
  { label: "GASOLINA SP", value: "R$ 6,09/L", dir: "flat" },
];

export function Ticker() {
  const [paused, setPaused] = useState(false);

  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="border-y bg-secondary/60 backdrop-blur overflow-hidden"
      role="marquee"
      aria-label="Indicadores econômicos (dados ilustrativos)"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex">
        <div
          className="ticker-track flex shrink-0 items-center gap-8 py-2.5 px-4 whitespace-nowrap"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-semibold tracking-wide">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="tabular-nums">{item.value}</span>
              <span
                className={`text-[10px] ${
                  item.dir === "up"
                    ? "text-chart-2"
                    : item.dir === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {item.dir === "up" ? "▲" : item.dir === "down" ? "▼" : "■"}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
