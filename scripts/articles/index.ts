import type { ArticleSeed } from "./types";
import { part1 } from "./part1";
import { part2 } from "./part2";
import { part3 } from "./part3";

export const allArticles: ArticleSeed[] = [...part1, ...part2, ...part3];
export type { ArticleSeed, Block } from "./types";
