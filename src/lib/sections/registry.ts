import { SectionItem, SectionType } from "@/types/profile";

export interface SectionMeta {
  type: SectionType;
  title: string;
  description: string;
  category: "identity" | "skills" | "stats" | "projects" | "extras";
  icon: string;
  createDefault: () => SectionItem;
}

export const SECTION_METAS: Record<SectionType, SectionMeta> = {
  header: {
    type: "header",
    title: "Profile Header",
    description: "Your name, avatar, title banner, and animated typing greetings.",
    category: "identity",
    icon: "User",
    createDefault: () => ({
      id: `sec_header_${Date.now()}`,
      type: "header",
      title: "Profile Header",
      enabled: true,
      config: {
        greeting: "Hi there, I'm",
        name: "Alex Rivera",
        title: "Full Stack Engineer & Open Source Enthusiast",
        alignment: "center",
        avatarUrl: "",
        avatarStyle: "circle",
        typingTexts: [
          "Building resilient web apps",
          "Open source contributor",
          "Passionate about TypeScript & Rust",
        ],
        bannerUrl: "",
      },
    }),
  },
  about: {
    type: "about",
    title: "About Me",
    description: "Brief personal summary, what you're building, and fun facts.",
    category: "identity",
    icon: "BookOpen",
    createDefault: () => ({
      id: `sec_about_${Date.now()}`,
      type: "about",
      title: "About Me",
      enabled: true,
      config: {
        bio: "I am a software engineer focused on building fast, accessible web applications and developer tools.",
        currentWork: "High-performance full stack platforms",
        collaborateOn: "Developer tools & developer experience open source projects",
        askMeAbout: "React, Next.js, TypeScript, API architecture, and Node.js",
        reachMeAt: "hi@alexrivera.dev",
        funFact: "I brew artisanal coffee while waiting for builds to complete.",
      },
    }),
  },
  socials: {
    type: "socials",
    title: "Social Links",
    description: "Shields.io badge pills for GitHub, LinkedIn, X, Discord, and more.",
    category: "identity",
    icon: "Share2",
    createDefault: () => ({
      id: `sec_socials_${Date.now()}`,
      type: "socials",
      title: "Connect with Me",
      enabled: true,
      config: {
        alignment: "center",
        links: [
          {
            id: "soc_gh",
            platform: "github",
            username: "alexrivera",
            url: "https://github.com",
            style: "for-the-badge",
            label: "GitHub",
          },
          {
            id: "soc_li",
            platform: "linkedin",
            username: "alexrivera",
            url: "https://linkedin.com",
            style: "for-the-badge",
            label: "LinkedIn",
          },
          {
            id: "soc_x",
            platform: "x",
            username: "alexrivera",
            url: "https://x.com",
            style: "for-the-badge",
            label: "X (Twitter)",
          },
        ],
      },
    }),
  },
  "tech-stack": {
    type: "tech-stack",
    title: "Tech Stack & Skills",
    description: "Visual icons or badges showcasing your programming languages and tools.",
    category: "skills",
    icon: "Code",
    createDefault: () => ({
      id: `sec_tech_${Date.now()}`,
      type: "tech-stack",
      title: "Languages & Tools",
      enabled: true,
      config: {
        alignment: "center",
        viewMode: "icons",
        perLine: 10,
        skills: [
          { id: "t_ts", name: "TypeScript", slug: "ts", category: "languages" },
          { id: "t_js", name: "JavaScript", slug: "js", category: "languages" },
          { id: "t_react", name: "React", slug: "react", category: "frameworks" },
          { id: "t_next", name: "Next.js", slug: "nextjs", category: "frameworks" },
          { id: "t_tailwind", name: "Tailwind CSS", slug: "tailwind", category: "frameworks" },
          { id: "t_node", name: "Node.js", slug: "nodejs", category: "frameworks" },
          { id: "t_pg", name: "PostgreSQL", slug: "postgres", category: "databases" },
          { id: "t_docker", name: "Docker", slug: "docker", category: "tools" },
          { id: "t_git", name: "Git", slug: "git", category: "tools" },
          { id: "t_aws", name: "AWS", slug: "aws", category: "cloud" },
        ],
      },
    }),
  },
  "github-stats": {
    type: "github-stats",
    title: "GitHub Statistics",
    description: "Overview card of total stars, commits, PRs, and contributions.",
    category: "stats",
    icon: "BarChart3",
    createDefault: () => ({
      id: `sec_stats_${Date.now()}`,
      type: "github-stats",
      title: "GitHub Statistics",
      enabled: true,
      config: {
        username: "torvalds",
        showIcons: true,
        hideBorder: false,
        includeAllCommits: true,
        countPrivate: true,
        alignment: "center",
      },
    }),
  },
  "streak-stats": {
    type: "streak-stats",
    title: "GitHub Streak",
    description: "Streak stats widget displaying current streak and longest commit streak.",
    category: "stats",
    icon: "Flame",
    createDefault: () => ({
      id: `sec_streak_${Date.now()}`,
      type: "streak-stats",
      title: "Contribution Streak",
      enabled: true,
      config: {
        username: "torvalds",
        hideBorder: false,
        alignment: "center",
      },
    }),
  },
  "top-langs": {
    type: "top-langs",
    title: "Top Languages",
    description: "Dynamic graph of your most-used languages across repositories.",
    category: "stats",
    icon: "PieChart",
    createDefault: () => ({
      id: `sec_langs_${Date.now()}`,
      type: "top-langs",
      title: "Top Languages",
      enabled: true,
      config: {
        username: "torvalds",
        layout: "compact",
        hideBorder: false,
        langsCount: 6,
        alignment: "center",
      },
    }),
  },
  projects: {
    type: "projects",
    title: "Featured Projects",
    description: "Showcase your top open-source projects or portfolio highlights.",
    category: "projects",
    icon: "FolderGit2",
    createDefault: () => ({
      id: `sec_projects_${Date.now()}`,
      type: "projects",
      title: "Featured Projects",
      enabled: true,
      config: {
        alignment: "left",
        projects: [
          {
            id: "proj_1",
            name: "ProfileForge",
            description: "Visual open-source GitHub Profile README builder with live GFM preview.",
            repoUrl: "https://github.com/alexrivera/profileforge",
            demoUrl: "https://profileforge.dev",
            techs: ["Next.js", "TypeScript", "Tailwind CSS"],
            starsBadge: true,
          },
          {
            id: "proj_2",
            name: "DevRadar",
            description: "Real-time tech stack trend monitor and developer career intelligence.",
            repoUrl: "https://github.com/alexrivera/devradar",
            demoUrl: "https://devradar.io",
            techs: ["React", "FastAPI", "PostgreSQL"],
            starsBadge: true,
          },
        ],
      },
    }),
  },
  "current-status": {
    type: "current-status",
    title: "Current Status",
    description: "What you are actively building, learning, and collaborating on right now.",
    category: "extras",
    icon: "Activity",
    createDefault: () => ({
      id: `sec_status_${Date.now()}`,
      type: "current-status",
      title: "Current Status",
      enabled: true,
      config: {
        alignment: "left",
        workingOnText: "Next-gen developer tooling & AI CLI interfaces",
        workingOnLink: "https://github.com",
        learningText: "Rust async runtimes and WebAssembly internals",
        collaboratingText: "Developer productivity tools",
        collaboratingLink: "https://github.com",
        pronouns: "they/them",
      },
    }),
  },
  "quote-counter": {
    type: "quote-counter",
    title: "Quotes & Profile Counter",
    description: "Dynamic developer quotes and profile visitor counter badges.",
    category: "extras",
    icon: "Eye",
    createDefault: () => ({
      id: `sec_quote_${Date.now()}`,
      type: "quote-counter",
      title: "Profile Extras",
      enabled: true,
      config: {
        showQuote: true,
        quoteTheme: "radical",
        showVisitorCounter: true,
        counterUsername: "torvalds",
        counterTheme: "rule_your_face",
        alignment: "center",
      },
    }),
  },
};

export const ALL_SECTION_TYPES = Object.keys(SECTION_METAS) as SectionType[];

export function createSection(type: SectionType): SectionItem {
  return SECTION_METAS[type].createDefault();
}
