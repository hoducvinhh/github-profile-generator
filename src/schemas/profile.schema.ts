import { z } from "zod";

export const SectionTypeSchema = z.enum([
  "header",
  "about",
  "socials",
  "tech-stack",
  "github-stats",
  "streak-stats",
  "top-langs",
  "projects",
  "current-status",
  "quote-counter",
]);

export const ThemeIdSchema = z.enum([
  "github-dark",
  "github-light",
  "dracula",
  "nord",
  "tokyo-night",
  "catppuccin",
]);

export const TemplateIdSchema = z.enum([
  "minimal",
  "professional",
  "modern",
  "terminal",
  "creative",
]);

export const HeaderConfigSchema = z.object({
  name: z.string().default("Your Name"),
  title: z.string().default("Full Stack Developer"),
  greeting: z.string().optional().default("Hi there, I'm"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  avatarStyle: z.enum(["circle", "square", "none"]).default("circle"),
  alignment: z.enum(["center", "left"]).default("center"),
  typingTexts: z.array(z.string()).default([]),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

export const AboutConfigSchema = z.object({
  bio: z.string().default("Passionate developer crafting clean, accessible software."),
  currentWork: z.string().optional().default(""),
  collaborateOn: z.string().optional().default(""),
  askMeAbout: z.string().optional().default(""),
  reachMeAt: z.string().optional().default(""),
  funFact: z.string().optional().default(""),
});

export const SocialLinkItemSchema = z.object({
  id: z.string(),
  platform: z.string(),
  username: z.string(),
  url: z.string(),
  style: z.enum(["flat", "flat-square", "for-the-badge", "plastic"]).default("for-the-badge"),
  badgeColor: z.string().optional(),
  label: z.string().optional(),
});

export const SocialsConfigSchema = z.object({
  alignment: z.enum(["center", "left"]).default("center"),
  links: z.array(SocialLinkItemSchema).default([]),
});

export const TechItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.enum(["languages", "frameworks", "databases", "tools", "cloud"]),
});

export const TechStackConfigSchema = z.object({
  alignment: z.enum(["center", "left"]).default("center"),
  viewMode: z.enum(["icons", "badges"]).default("icons"),
  perLine: z.number().int().min(4).max(16).default(10),
  skills: z.array(TechItemSchema).default([]),
});

export const GitHubStatsConfigSchema = z.object({
  username: z.string().default(""),
  showIcons: z.boolean().default(true),
  hideBorder: z.boolean().default(false),
  includeAllCommits: z.boolean().default(true),
  countPrivate: z.boolean().default(true),
  alignment: z.enum(["center", "left"]).default("center"),
  cardTheme: z.string().optional(),
});

export const StreakStatsConfigSchema = z.object({
  username: z.string().default(""),
  hideBorder: z.boolean().default(false),
  alignment: z.enum(["center", "left"]).default("center"),
  cardTheme: z.string().optional(),
});

export const TopLangsConfigSchema = z.object({
  username: z.string().default(""),
  layout: z.enum(["compact", "normal"]).default("compact"),
  hideBorder: z.boolean().default(false),
  langsCount: z.number().int().min(1).max(10).default(6),
  alignment: z.enum(["center", "left"]).default("center"),
  cardTheme: z.string().optional(),
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  repoUrl: z.string(),
  demoUrl: z.string().optional(),
  techs: z.array(z.string()).default([]),
  starsBadge: z.boolean().default(true),
});

export const ProjectsConfigSchema = z.object({
  alignment: z.enum(["center", "left"]).default("left"),
  projects: z.array(ProjectItemSchema).default([]),
});

export const CurrentStatusConfigSchema = z.object({
  alignment: z.enum(["center", "left"]).default("left"),
  workingOnText: z.string().optional().default(""),
  workingOnLink: z.string().optional().default(""),
  learningText: z.string().optional().default(""),
  collaboratingText: z.string().optional().default(""),
  collaboratingLink: z.string().optional().default(""),
  pronouns: z.string().optional().default(""),
});

export const QuoteCounterConfigSchema = z.object({
  showQuote: z.boolean().default(true),
  quoteTheme: z.string().optional().default("radical"),
  showVisitorCounter: z.boolean().default(true),
  counterUsername: z.string().optional().default(""),
  counterTheme: z.string().optional().default("rule_your_face"),
  alignment: z.enum(["center", "left"]).default("center"),
});

export const SectionItemSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  title: z.string(),
  enabled: z.boolean().default(true),
  config: z.record(z.any()),
});

export const ProfileConfigSchema = z.object({
  version: z.number().default(1),
  templateId: TemplateIdSchema.default("modern"),
  themeId: ThemeIdSchema.default("github-dark"),
  githubUsername: z.string().optional().default(""),
  sections: z.array(SectionItemSchema),
});
