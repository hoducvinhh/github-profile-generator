import {
  GitHubStatsConfig,
  StreakStatsConfig,
  ThemeDefinition,
  TopLangsConfig,
} from "@/types/profile";
import {
  generateStatsCardUrl,
  generateStreakCardUrl,
  generateTopLangsUrl,
} from "../badge-generator";

export function serializeGitHubStats(
  config: GitHubStatsConfig,
  theme: ThemeDefinition
): string {
  if (!config.username?.trim()) return "";

  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  lines.push("## 📊 GitHub Statistics");
  lines.push("");

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  const statsUrl = generateStatsCardUrl({
    username: config.username.trim(),
    theme,
    showIcons: config.showIcons,
    hideBorder: config.hideBorder,
    includeAllCommits: config.includeAllCommits,
    countPrivate: config.countPrivate,
  });

  lines.push(`![GitHub Stats](${statsUrl})`);
  lines.push("");

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}

export function serializeStreakStats(
  config: StreakStatsConfig,
  theme: ThemeDefinition
): string {
  if (!config.username?.trim()) return "";

  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  const streakUrl = generateStreakCardUrl({
    username: config.username.trim(),
    theme,
    hideBorder: config.hideBorder,
  });

  lines.push(`![GitHub Streak](${streakUrl})`);
  lines.push("");

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}

export function serializeTopLangs(
  config: TopLangsConfig,
  theme: ThemeDefinition
): string {
  if (!config.username?.trim()) return "";

  const lines: string[] = [];
  const isCenter = config.alignment === "center";

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push("");
  }

  const langsUrl = generateTopLangsUrl({
    username: config.username.trim(),
    theme,
    layout: config.layout,
    hideBorder: config.hideBorder,
    langsCount: config.langsCount,
  });

  lines.push(`![Top Languages](${langsUrl})`);
  lines.push("");

  if (isCenter) {
    lines.push("</div>");
    lines.push("");
  }

  return lines.join("\n");
}
