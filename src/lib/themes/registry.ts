import { ThemeDefinition, ThemeId } from "@/types/profile";

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  "github-dark": {
    id: "github-dark",
    name: "GitHub Dark",
    description: "The classic, sleek dark aesthetic from GitHub.",
    previewBg: "#0d1117",
    previewBorder: "#30363d",
    previewAccent: "#58a6ff",
    previewText: "#c9d1d9",
    widgetTheme: {
      titleColor: "58a6ff",
      textColor: "c9d1d9",
      iconColor: "58a6ff",
      bgColor: "0d1117",
      borderColor: "30363d",
    },
    badgeStyle: "for-the-badge",
  },
  "github-light": {
    id: "github-light",
    name: "GitHub Light",
    description: "Clean, high-contrast light mode with crisp borders.",
    previewBg: "#ffffff",
    previewBorder: "#d0d7de",
    previewAccent: "#0969da",
    previewText: "#1f2328",
    widgetTheme: {
      titleColor: "0969da",
      textColor: "1f2328",
      iconColor: "0969da",
      bgColor: "ffffff",
      borderColor: "d0d7de",
    },
    badgeStyle: "for-the-badge",
  },
  dracula: {
    id: "dracula",
    name: "Dracula",
    description: "Famous vibrant dark theme with rich purples and pinks.",
    previewBg: "#282a36",
    previewBorder: "#6272a4",
    previewAccent: "#bd93f9",
    previewText: "#f8f8f2",
    widgetTheme: {
      titleColor: "bd93f9",
      textColor: "f8f8f2",
      iconColor: "ff79c6",
      bgColor: "282a36",
      borderColor: "6272a4",
    },
    badgeStyle: "for-the-badge",
  },
  nord: {
    id: "nord",
    name: "Nord",
    description: "An arctic, north-bluish clean color palette.",
    previewBg: "#2e3440",
    previewBorder: "#4c566a",
    previewAccent: "#88c0d0",
    previewText: "#eceff4",
    widgetTheme: {
      titleColor: "88c0d0",
      textColor: "eceff4",
      iconColor: "81a1c1",
      bgColor: "2e3440",
      borderColor: "4c566a",
    },
    badgeStyle: "flat-square",
  },
  "tokyo-night": {
    id: "tokyo-night",
    name: "Tokyo Night",
    description: "Neon-infused night city colors with deep blues.",
    previewBg: "#1a1b26",
    previewBorder: "#2f3549",
    previewAccent: "#7aa2f7",
    previewText: "#a9b1d6",
    widgetTheme: {
      titleColor: "7aa2f7",
      textColor: "a9b1d6",
      iconColor: "bb9af7",
      bgColor: "1a1b26",
      borderColor: "2f3549",
    },
    badgeStyle: "for-the-badge",
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    description: "Warm, soothing pastel palette for modern makers.",
    previewBg: "#1e1e2e",
    previewBorder: "#313244",
    previewAccent: "#cba6f7",
    previewText: "#cdd6f4",
    widgetTheme: {
      titleColor: "cba6f7",
      textColor: "cdd6f4",
      iconColor: "f38ba8",
      bgColor: "1e1e2e",
      borderColor: "313244",
    },
    badgeStyle: "flat-square",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES[id] || THEMES["github-dark"];
}
