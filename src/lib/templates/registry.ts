import { ProfileConfig, TemplateId } from "@/types/profile";
import { createSection } from "@/lib/sections/registry";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  recommendedTheme: ProfileConfig["themeId"];
  createConfig: (username?: string) => ProfileConfig;
}

export const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  modern: {
    id: "modern",
    name: "Modern Developer",
    badge: "Most Popular",
    description: "High-impact layout with typing header banner, categorized tech stack, streak stats, and project showcases.",
    recommendedTheme: "github-dark",
    createConfig: (username = "alexrivera") => ({
      version: 1,
      templateId: "modern",
      themeId: "github-dark",
      githubUsername: username,
      sections: [
        {
          ...createSection("header"),
          config: {
            greeting: "Hi there, I'm",
            name: "Alex Rivera 👋",
            title: "Senior Full Stack Engineer & Open Source Builder",
            alignment: "center",
            avatarUrl: "",
            avatarStyle: "circle",
            typingTexts: [
              "Full Stack TypeScript & Next.js Enthusiast",
              "Passionate about developer experience and tools",
              "Open-source advocate & lifelong learner",
            ],
            bannerUrl: "",
          },
        },
        createSection("about"),
        createSection("socials"),
        createSection("tech-stack"),
        {
          ...createSection("github-stats"),
          config: {
            username,
            showIcons: true,
            hideBorder: false,
            includeAllCommits: true,
            countPrivate: true,
            alignment: "center",
          },
        },
        {
          ...createSection("streak-stats"),
          config: {
            username,
            hideBorder: false,
            alignment: "center",
          },
        },
        {
          ...createSection("top-langs"),
          config: {
            username,
            layout: "compact",
            hideBorder: false,
            langsCount: 6,
            alignment: "center",
          },
        },
        createSection("projects"),
        createSection("current-status"),
        {
          ...createSection("quote-counter"),
          config: {
            showQuote: true,
            quoteTheme: "radical",
            showVisitorCounter: true,
            counterUsername: username,
            counterTheme: "rule_your_face",
            alignment: "center",
          },
        },
      ],
    }),
  },
  minimal: {
    id: "minimal",
    name: "Minimalist",
    badge: "Clean & Fast",
    description: "Subtle typography, zero bloat, concise biography, and clean flat shields. Perfect for focused senior engineers.",
    recommendedTheme: "github-light",
    createConfig: (username = "alexrivera") => ({
      version: 1,
      templateId: "minimal",
      themeId: "github-light",
      githubUsername: username,
      sections: [
        {
          ...createSection("header"),
          config: {
            greeting: "",
            name: "Alex Rivera",
            title: "Software Engineer",
            alignment: "left",
            avatarUrl: "",
            avatarStyle: "none",
            typingTexts: [],
            bannerUrl: "",
          },
        },
        {
          ...createSection("about"),
          config: {
            bio: "I craft maintainable distributed systems and pragmatic web services with TypeScript and Go.",
            currentWork: "High-scale infrastructure",
            collaborateOn: "",
            askMeAbout: "System architecture, distributed systems, web standards",
            reachMeAt: "alex@rivera.sh",
            funFact: "",
          },
        },
        {
          ...createSection("socials"),
          config: {
            alignment: "left",
            links: [
              {
                id: "soc_gh_min",
                platform: "github",
                username: username,
                url: `https://github.com/${username}`,
                style: "flat-square",
                label: "GitHub",
              },
              {
                id: "soc_li_min",
                platform: "linkedin",
                username: username,
                url: "https://linkedin.com",
                style: "flat-square",
                label: "LinkedIn",
              },
            ],
          },
        },
        {
          ...createSection("tech-stack"),
          config: {
            alignment: "left",
            viewMode: "badges",
            perLine: 8,
            skills: [
              { id: "m_ts", name: "TypeScript", slug: "ts", category: "languages" },
              { id: "m_go", name: "Go", slug: "go", category: "languages" },
              { id: "m_react", name: "React", slug: "react", category: "frameworks" },
              { id: "m_node", name: "Node.js", slug: "nodejs", category: "frameworks" },
              { id: "m_pg", name: "PostgreSQL", slug: "postgres", category: "databases" },
              { id: "m_k8s", name: "Kubernetes", slug: "kubernetes", category: "tools" },
            ],
          },
        },
        {
          ...createSection("projects"),
          config: {
            alignment: "left",
            projects: [
              {
                id: "proj_min_1",
                name: "profileforge",
                description: "Lightweight profile markdown generator.",
                repoUrl: `https://github.com/${username}/profileforge`,
                techs: ["TypeScript", "Next.js"],
                starsBadge: false,
              },
            ],
          },
        },
      ],
    }),
  },
  professional: {
    id: "professional",
    name: "Executive & Lead",
    badge: "Enterprise Ready",
    description: "Structured executive summary, team collaboration highlights, categorized tech matrix, and verified stats.",
    recommendedTheme: "nord",
    createConfig: (username = "alexrivera") => ({
      version: 1,
      templateId: "professional",
      themeId: "nord",
      githubUsername: username,
      sections: [
        {
          ...createSection("header"),
          config: {
            greeting: "Hello, I am",
            name: "Alex Rivera",
            title: "Engineering Lead & Solution Architect",
            alignment: "left",
            avatarUrl: "",
            avatarStyle: "circle",
            typingTexts: [
              "Driving product architecture and developer productivity",
              "Mentoring engineers & architecting cloud native systems",
            ],
            bannerUrl: "",
          },
        },
        {
          ...createSection("about"),
          config: {
            bio: "10+ years architecting mission-critical cloud platforms, guiding high-performing cross-functional teams, and fostering engineering excellence.",
            currentWork: "Enterprise application modernization & platform engineering",
            collaborateOn: "Architectural reviews, open standards, tech leadership",
            askMeAbout: "Cloud architecture, team topologies, micro frontends, CI/CD",
            reachMeAt: "contact@alexrivera.io",
            funFact: "Authored internal design docs read by over 500 engineers.",
          },
        },
        createSection("socials"),
        createSection("tech-stack"),
        {
          ...createSection("github-stats"),
          config: {
            username,
            showIcons: true,
            hideBorder: false,
            includeAllCommits: true,
            countPrivate: true,
            alignment: "left",
          },
        },
        {
          ...createSection("top-langs"),
          config: {
            username,
            layout: "normal",
            hideBorder: false,
            langsCount: 5,
            alignment: "left",
          },
        },
        createSection("projects"),
      ],
    }),
  },
  terminal: {
    id: "terminal",
    name: "Terminal & Hacker",
    badge: "Retro Geek",
    description: "Monospaced retro CLI aesthetic with bash prompt headers, command outputs, and green terminal vibe.",
    recommendedTheme: "tokyo-night",
    createConfig: (username = "alexrivera") => ({
      version: 1,
      templateId: "terminal",
      themeId: "tokyo-night",
      githubUsername: username,
      sections: [
        {
          ...createSection("header"),
          config: {
            greeting: "$ whoami",
            name: `${username}@localhost:~#`,
            title: "Console Hacker & Systems Developer",
            alignment: "left",
            avatarUrl: "",
            avatarStyle: "square",
            typingTexts: [
              "curl -sL https://alexrivera.dev/profile.json",
              "ssh dev@matrix.production",
              "grep -rn 'awesome' ./projects",
            ],
            bannerUrl: "",
          },
        },
        {
          ...createSection("about"),
          config: {
            bio: "```bash\n# System Information:\nOS: Arch Linux x86_64\nKernel: 6.9.1-zen\nShell: zsh 5.9\nEditor: Neovim\nFocus: Distributed Systems, Low-latency Networking, Security\n```",
            currentWork: "Optimizing terminal emulator runtimes",
            collaborateOn: "Rust systems libraries and security tooling",
            askMeAbout: "Linux kernel, CLI utilities, network protocols, eBPF",
            reachMeAt: "alex@matrix.network",
            funFact: "Can exit Vim in under 100 milliseconds.",
          },
        },
        createSection("tech-stack"),
        {
          ...createSection("github-stats"),
          config: {
            username,
            showIcons: true,
            hideBorder: true,
            includeAllCommits: true,
            countPrivate: true,
            alignment: "left",
          },
        },
        {
          ...createSection("streak-stats"),
          config: {
            username,
            hideBorder: true,
            alignment: "left",
          },
        },
        createSection("projects"),
      ],
    }),
  },
  creative: {
    id: "creative",
    name: "Creative Showcase",
    badge: "Vibrant & Dynamic",
    description: "Vibrant palettes, rich badges, dynamic cards, quotes, and visitor counter for maximum engagement.",
    recommendedTheme: "dracula",
    createConfig: (username = "alexrivera") => ({
      version: 1,
      templateId: "creative",
      themeId: "dracula",
      githubUsername: username,
      sections: [
        {
          ...createSection("header"),
          config: {
            greeting: "✨ Welcome to my digital workshop! I'm",
            name: "Alex Rivera 🎨",
            title: "Creative Technologist & Interactive Frontend Craftsman",
            alignment: "center",
            avatarUrl: "",
            avatarStyle: "circle",
            typingTexts: [
              "Turning pixels into interactive magic ✨",
              "WebGPU, Three.js, and generative experiences 🚀",
              "Building delightful developer experiences 🌟",
            ],
            bannerUrl: "",
          },
        },
        createSection("about"),
        createSection("socials"),
        createSection("tech-stack"),
        {
          ...createSection("github-stats"),
          config: {
            username,
            showIcons: true,
            hideBorder: false,
            includeAllCommits: true,
            countPrivate: true,
            alignment: "center",
          },
        },
        {
          ...createSection("streak-stats"),
          config: {
            username,
            hideBorder: false,
            alignment: "center",
          },
        },
        {
          ...createSection("top-langs"),
          config: {
            username,
            layout: "compact",
            hideBorder: false,
            langsCount: 6,
            alignment: "center",
          },
        },
        createSection("projects"),
        createSection("current-status"),
        {
          ...createSection("quote-counter"),
          config: {
            showQuote: true,
            quoteTheme: "dracula",
            showVisitorCounter: true,
            counterUsername: username,
            counterTheme: "radical",
            alignment: "center",
          },
        },
      ],
    }),
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);

export function getTemplate(id: TemplateId): TemplateDefinition {
  return TEMPLATES[id] || TEMPLATES.modern;
}
