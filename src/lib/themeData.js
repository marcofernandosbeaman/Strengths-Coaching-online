import { STRENGTHS } from "@/data/strengths";
import { THEME_TO_DOMAIN, DOMAIN_COLORS } from "@/data/themeDomains";

export const MAX_THEMES = 10;
// Supported selections: a single theme, or five to ten themes.
export const validCount = (n) => n === 1 || (n >= 5 && n <= MAX_THEMES);

const BY_KEY = Object.fromEntries(
  STRENGTHS.map((s) => {
    const domain = THEME_TO_DOMAIN[s.key];
    return [s.key, { ...s, domain, colour: DOMAIN_COLORS[domain] }];
  })
);

export const getTheme = (key) => BY_KEY[key];

export const listJoin = (arr) =>
  arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr.at(-1)}`;
