import { TechStackConfig, ThemeDefinition } from "@/types/profile";
import { generateShieldBadgeUrl, generateSkillIconsUrl } from "../badge-generator";

export function serializeTechStack(
  config: TechStackConfig,
  theme: ThemeDefinition
): string {
  if (!config.skills || config.skills.length === 0) return "";

  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  lines.push("## 🛠️ Languages & Tools");
  lines.push("");

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  if (config.viewMode === "icons") {
    // Generate clean skillicons.dev SVG
    const skillSlugs = config.skills.map((s) => s.slug.toLowerCase().trim());
    const isDark = theme.id !== "github-light";
    const skillIconsUrl = generateSkillIconsUrl(
      skillSlugs,
      config.perLine || 10,
      isDark ? "dark" : "light"
    );
    lines.push(`[![My Skills](${skillIconsUrl})](https://skillicons.dev)`);
  } else {
    // Badges mode: Shields.io badges
    const badges = config.skills.map((skill) => {
      const badgeUrl = generateShieldBadgeUrl({
        label: "",
        message: skill.name,
        color: theme.widgetTheme.bgColor,
        logo: skill.slug,
        style: theme.badgeStyle,
      });
      return `![${skill.name}](${badgeUrl})`;
    });
    lines.push(badges.join(" "));
  }

  lines.push("");

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}
