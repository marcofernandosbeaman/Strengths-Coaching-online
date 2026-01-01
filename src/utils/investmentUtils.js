import { STRENGTHS } from "../data/strengths";
import { INVESTMENT_GUIDES } from "../data/investmentGuides";

export function generateCombinedInvestment(selectedKeys) {
  const lines = [];
  selectedKeys.forEach((k) => {
    const tips = INVESTMENT_GUIDES[k];
    if (tips) {
      const name = STRENGTHS.find((s) => s.key === k)?.name ?? k;
      lines.push(`• ${name}: ${tips[0]}`);
    }
  });
  return lines.join("\n");
}

