export type SectionType =
  | "header"
  | "about"
  | "socials"
  | "tech-stack"
  | "github-stats"
  | "streak-stats"
  | "top-langs"
  | "projects"
  | "current-status"
  | "quote-counter";

export type ThemeId =
  | "github-dark"
  | "github-light"
  | "dracula"
  | "nord"
  | "tokyo-night"
  | "catppuccin";

export type TemplateId =
  | "minimal"
  | "professional"
  | "modern"
  | "terminal"
  | "creative";

export interface HeaderConfig {
  name: string;
  title: string;
  greeting?: string;
  avatarUrl?: string;
  avatarStyle?: "circle" | "square" | "none";
  alignment: "center" | "left";
  typingTexts?: string[];
  bannerUrl?: string;
}

export interface AboutConfig {
  bio: string;
  currentWork?: string;
  collaborateOn?: string;
  askMeAbout?: string;
  reachMeAt?: string;
  funFact?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string; // "github" | "linkedin" | "x" | "discord" | "youtube" | "portfolio" | "email" | "twitch" etc.
  username: string;
  url: string;
  style: "flat" | "flat-square" | "for-the-badge" | "plastic";
  badgeColor?: string;
  label?: string;
}

export interface SocialsConfig {
  alignment: "center" | "left";
  links: SocialLinkItem[];
}

export interface TechItem {
  id: string;
  name: string;
  slug: string; // for skillicons or shields: e.g. "react", "ts", "python"
  category: "languages" | "frameworks" | "databases" | "tools" | "cloud";
}

export interface TechStackConfig {
  alignment: "center" | "left";
  viewMode: "icons" | "badges"; // "icons" -> skillicons, "badges" -> shields.io
  perLine: number;
  skills: TechItem[];
}

export interface GitHubStatsConfig {
  username: string;
  showIcons: boolean;
  hideBorder: boolean;
  includeAllCommits: boolean;
  countPrivate: boolean;
  alignment: "center" | "left";
  cardTheme?: string;
}

export interface StreakStatsConfig {
  username: string;
  hideBorder: boolean;
  alignment: "center" | "left";
  cardTheme?: string;
}

export interface TopLangsConfig {
  username: string;
  layout: "compact" | "normal";
  hideBorder: boolean;
  langsCount: number;
  alignment: "center" | "left";
  cardTheme?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  techs?: string[];
  starsBadge?: boolean;
}

export interface ProjectsConfig {
  alignment: "center" | "left";
  projects: ProjectItem[];
}

export interface CurrentStatusConfig {
  alignment: "center" | "left";
  workingOnText?: string;
  workingOnLink?: string;
  learningText?: string;
  collaboratingText?: string;
  collaboratingLink?: string;
  pronouns?: string;
}

export interface QuoteCounterConfig {
  showQuote: boolean;
  quoteTheme?: string;
  showVisitorCounter: boolean;
  counterUsername?: string;
  counterTheme?: string;
  alignment: "center" | "left";
}

export type SectionConfig =
  | HeaderConfig
  | AboutConfig
  | SocialsConfig
  | TechStackConfig
  | GitHubStatsConfig
  | StreakStatsConfig
  | TopLangsConfig
  | ProjectsConfig
  | CurrentStatusConfig
  | QuoteCounterConfig;

export interface SectionItem {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  config: SectionConfig;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
  previewText: string;
  // External SVG widget query parameters
  widgetTheme: {
    titleColor: string;
    textColor: string;
    iconColor: string;
    bgColor: string;
    borderColor: string;
  };
  badgeStyle: "flat" | "flat-square" | "for-the-badge";
}

export interface ProfileConfig {
  version: number;
  templateId: TemplateId;
  themeId: ThemeId;
  githubUsername?: string;
  sections: SectionItem[];
}
