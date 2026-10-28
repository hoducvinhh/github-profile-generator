import { ThemeDefinition } from "@/types/profile";

/**
 * Generates Shields.io badge URLs with deterministic styling and query parameters
 */
export function generateShieldBadgeUrl(params: {
  label: string;
  message: string;
  color: string;
  logo?: string;
  logoColor?: string;
  style?: "flat" | "flat-square" | "for-the-badge" | "plastic";
}): string {
  const { label, message, color, logo, logoColor = "white", style = "for-the-badge" } = params;
  const cleanLabel = encodeURIComponent(label);
  const cleanMessage = encodeURIComponent(message);
  const cleanColor = color.replace("#", "");

  let url = `https://img.shields.io/badge/${cleanLabel}-${cleanMessage}-${cleanColor}?style=${style}`;
  if (logo) {
    url += `&logo=${encodeURIComponent(logo)}&logoColor=${encodeURIComponent(logoColor)}`;
  }
  return url;
}

/**
 * Builds SkillIcons URL (e.g. https://skillicons.dev/icons?i=ts,react,nextjs,tailwind&theme=dark)
 */
export function generateSkillIconsUrl(
  skills: string[],
  perLine = 10,
  theme: "dark" | "light" = "dark"
): string {
  if (skills.length === 0) return "";
  const joined = skills.join(",");
  return `https://skillicons.dev/icons?i=${joined}&perline=${perLine}&theme=${theme}`;
}

/**
 * Builds GitHub Readme Stats Card URL with theme injection
 */
export function generateStatsCardUrl(params: {
  username: string;
  theme: ThemeDefinition;
  showIcons?: boolean;
  hideBorder?: boolean;
  includeAllCommits?: boolean;
  countPrivate?: boolean;
}): string {
  const { username, theme, showIcons = true, hideBorder = false, includeAllCommits = true, countPrivate = true } = params;
  const wt = theme.widgetTheme;

  const query = new URLSearchParams({
    username,
    show_icons: showIcons ? "true" : "false",
    hide_border: hideBorder ? "true" : "false",
    include_all_commits: includeAllCommits ? "true" : "false",
    count_private: countPrivate ? "true" : "false",
    title_color: wt.titleColor,
    text_color: wt.textColor,
    icon_color: wt.iconColor,
    bg_color: wt.bgColor,
    border_color: wt.borderColor,
  });

  return `https://github-readme-stats.vercel.app/api?${query.toString()}`;
}

/**
 * Builds Streak Stats URL with theme injection
 */
export function generateStreakCardUrl(params: {
  username: string;
  theme: ThemeDefinition;
  hideBorder?: boolean;
}): string {
  const { username, theme, hideBorder = false } = params;
  const wt = theme.widgetTheme;

  const query = new URLSearchParams({
    user: username,
    hide_border: hideBorder ? "true" : "false",
    stroke: wt.borderColor,
    background: wt.bgColor,
    ring: wt.iconColor,
    fire: wt.iconColor,
    currStreakNum: wt.titleColor,
    sideNums: wt.textColor,
    currStreakLabel: wt.iconColor,
    sideLabels: wt.textColor,
    dates: wt.textColor,
  });

  return `https://streak-stats.demolab.com?${query.toString()}`;
}

/**
 * Builds Top Languages URL with theme injection
 */
export function generateTopLangsUrl(params: {
  username: string;
  theme: ThemeDefinition;
  layout?: "compact" | "normal";
  hideBorder?: boolean;
  langsCount?: number;
}): string {
  const { username, theme, layout = "compact", hideBorder = false, langsCount = 6 } = params;
  const wt = theme.widgetTheme;

  const query = new URLSearchParams({
    username,
    layout: layout,
    hide_border: hideBorder ? "true" : "false",
    langs_count: String(langsCount),
    title_color: wt.titleColor,
    text_color: wt.textColor,
    icon_color: wt.iconColor,
    bg_color: wt.bgColor,
    border_color: wt.borderColor,
  });

  return `https://github-readme-stats.vercel.app/api/top-langs/?${query.toString()}`;
}

/**
 * Builds animated typing SVG header URL (via readme-typing-svg)
 */
export function generateTypingHeaderUrl(params: {
  lines: string[];
  theme: ThemeDefinition;
  font?: string;
  size?: number;
  center?: boolean;
}): string {
  const { lines, theme, font = "Fira+Code", size = 20, center = true } = params;
  const wt = theme.widgetTheme;

  const query = new URLSearchParams({
    font,
    size: String(size),
    pause: "1000",
    color: wt.titleColor,
    center: center ? "true" : "false",
    vCenter: "true",
    width: "480",
    lines: lines.join(";"),
  });

  return `https://readme-typing-svg.demolab.com?${query.toString()}`;
}
