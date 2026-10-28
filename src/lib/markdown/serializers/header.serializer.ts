import { HeaderConfig, ThemeDefinition } from "@/types/profile";
import { generateTypingHeaderUrl } from "../badge-generator";

export function serializeHeader(
  config: HeaderConfig,
  theme: ThemeDefinition
): string {
  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  // Banner image if configured
  if (config.bannerUrl?.trim()) {
    lines.push(`![Header Banner](${config.bannerUrl.trim()})`);
    lines.push("");
  }

  // Avatar if configured
  if (config.avatarUrl?.trim() && config.avatarStyle !== "none") {
    const radius = config.avatarStyle === "circle" ? "50%" : "8px";
    lines.push(
      `<img src="${config.avatarUrl.trim()}" alt="${config.name}" width="120" height="120" style="border-radius: ${radius}; max-width: 100%;" />`
    );
    lines.push("");
  }

  // Greeting & Name
  const greetingPart = config.greeting ? `${config.greeting} ` : "";
  lines.push(`# ${greetingPart}${config.name}`);
  lines.push("");

  // Title / Subtitle
  if (config.title?.trim()) {
    lines.push(`### ${config.title.trim()}`);
    lines.push("");
  }

  // Typing SVG
  if (config.typingTexts && config.typingTexts.length > 0) {
    const validTyping = config.typingTexts.filter((t) => t.trim().length > 0);
    if (validTyping.length > 0) {
      const typingUrl = generateTypingHeaderUrl({
        lines: validTyping,
        theme,
        center: isCenter,
      });
      lines.push(`[![Typing SVG](${typingUrl})](https://git.io/typing-svg)`);
      lines.push("");
    }
  }

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}
