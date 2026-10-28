import { SocialsConfig, ThemeDefinition } from "@/types/profile";
import { generateShieldBadgeUrl } from "../badge-generator";

const PLATFORM_ICONS: Record<string, { label: string; logo: string; color: string }> = {
  github: { label: "GitHub", logo: "github", color: "181717" },
  linkedin: { label: "LinkedIn", logo: "linkedin", color: "0A66C2" },
  x: { label: "X", logo: "x", color: "000000" },
  twitter: { label: "Twitter", logo: "twitter", color: "1DA1F2" },
  discord: { label: "Discord", logo: "discord", color: "5865F2" },
  youtube: { label: "YouTube", logo: "youtube", color: "FF0000" },
  portfolio: { label: "Portfolio", logo: "googlechrome", color: "4285F4" },
  email: { label: "Email", logo: "gmail", color: "EA4335" },
  twitch: { label: "Twitch", logo: "twitch", color: "9146FF" },
  instagram: { label: "Instagram", logo: "instagram", color: "E4405F" },
};

export function serializeSocials(
  config: SocialsConfig,
  theme: ThemeDefinition
): string {
  if (!config.links || config.links.length === 0) return "";

  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  lines.push("## 🌐 Connect with Me");
  lines.push("");

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  const badgeMarkdownArray = config.links.map((link) => {
    const meta = PLATFORM_ICONS[link.platform.toLowerCase()] || {
      label: link.label || link.platform,
      logo: link.platform.toLowerCase(),
      color: "333333",
    };

    const badgeUrl = generateShieldBadgeUrl({
      label: meta.label,
      message: link.username,
      color: link.badgeColor || meta.color,
      logo: meta.logo,
      style: link.style || theme.badgeStyle,
    });

    return `[![${meta.label}](${badgeUrl})](${link.url})`;
  });

  lines.push(badgeMarkdownArray.join(" "));
  lines.push("");

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}
