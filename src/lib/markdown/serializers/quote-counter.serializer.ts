import { QuoteCounterConfig, ThemeDefinition } from "@/types/profile";

export function serializeQuoteCounter(
  config: QuoteCounterConfig,
  theme: ThemeDefinition
): string {
  const parts: string[] = [];
  const isCenter = config.alignment === "center";

  if (isCenter) {
    parts.push('<div align="center">');
    parts.push("");
  }

  // Random dev quotes card
  if (config.showQuote) {
    const qTheme = config.quoteTheme || "radical";
    parts.push(
      `[![Quotes](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${qTheme})](https://github.com/piyushsuthar/quotes-github-readme)`
    );
    parts.push("");
  }

  // Visitor badge counter
  if (config.showVisitorCounter && config.counterUsername?.trim()) {
    const user = config.counterUsername.trim();
    const cTheme = config.counterTheme || "rule_your_face";
    parts.push(
      `![Visitor Counter](https://komarev.com/ghpvc/?username=${user}&style=${theme.badgeStyle}&color=blue)`
    );
    parts.push("");
  }

  if (isCenter) {
    parts.push("</div>");
    parts.push("");
  }

  return parts.length > 0 ? parts.join("\n") : "";
}
