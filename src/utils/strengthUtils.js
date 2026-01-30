export function getStrengthColor(key) {
  const domainColours = {
    achiever: "#6A1B9A", arranger: "#6A1B9A", belief: "#6A1B9A", consistency: "#6A1B9A", deliberative: "#6A1B9A", discipline: "#6A1B9A", focus: "#6A1B9A", responsibility: "#6A1B9A", restorative: "#6A1B9A",
    activator: "#EF6C00", command: "#EF6C00", communication: "#EF6C00", competition: "#EF6C00", maximizer: "#EF6C00", selfassurance: "#EF6C00", significance: "#EF6C00", woo: "#EF6C00",
    adaptability: "#1565C0", connectedness: "#1565C0", developer: "#1565C0", empathy: "#1565C0", harmony: "#1565C0", includer: "#1565C0", individualization: "#1565C0", positivity: "#1565C0", relator: "#1565C0",
    analytical: "#2E7D32", context: "#2E7D32", futuristic: "#2E7D32", ideation: "#2E7D32", input: "#2E7D32", intellection: "#2E7D32", learner: "#2E7D32", strategic: "#2E7D32"
  };
  return domainColours[key] || "#999";
}

export function getThemeColourClass(themeKey, domain) {
  // Map hex colors to Tailwind fill classes for SVG
  const executing = "#6A1B9A";
  const influencing = "#EF6C00";
  const relationship = "#1565C0";
  const strategic = "#2E7D32";

  const color = getStrengthColor(themeKey);
  
  if (color === executing) return "fill-purple-800";
  if (color === influencing) return "fill-orange-700";
  if (color === relationship) return "fill-blue-700";
  if (color === strategic) return "fill-green-700";
  
  return "fill-neutral-400";
}

export function clamp(v, min = 0, max = 100) {
  return Math.min(Math.max(v, min), max);
}

