import { ProfileConfig, SectionItem } from "@/types/profile";
import { getTheme } from "@/lib/themes/registry";
import { serializeHeader } from "./serializers/header.serializer";
import { serializeAbout } from "./serializers/about.serializer";
import { serializeSocials } from "./serializers/socials.serializer";
import { serializeTechStack } from "./serializers/tech-stack.serializer";
import {
  serializeGitHubStats,
  serializeStreakStats,
  serializeTopLangs,
} from "./serializers/stats.serializer";
import { serializeProjects } from "./serializers/projects.serializer";
import { serializeCurrentStatus } from "./serializers/status.serializer";
import { serializeQuoteCounter } from "./serializers/quote-counter.serializer";

export function serializeProfileMarkdown(config: ProfileConfig): string {
  const theme = getTheme(config.themeId);
  const blocks: string[] = [];

  for (const section of config.sections) {
    if (!section.enabled) continue;

    let serialized = "";
    switch (section.type) {
      case "header":
        serialized = serializeHeader(section.config as any, theme);
        break;
      case "about":
        serialized = serializeAbout(section.config as any);
        break;
      case "socials":
        serialized = serializeSocials(section.config as any, theme);
        break;
      case "tech-stack":
        serialized = serializeTechStack(section.config as any, theme);
        break;
      case "github-stats":
        serialized = serializeGitHubStats(section.config as any, theme);
        break;
      case "streak-stats":
        serialized = serializeStreakStats(section.config as any, theme);
        break;
      case "top-langs":
        serialized = serializeTopLangs(section.config as any, theme);
        break;
      case "projects":
        serialized = serializeProjects(section.config as any);
        break;
      case "current-status":
        serialized = serializeCurrentStatus(section.config as any);
        break;
      case "quote-counter":
        serialized = serializeQuoteCounter(section.config as any, theme);
        break;
      default:
        break;
    }

    if (serialized.trim().length > 0) {
      blocks.push(serialized.trim());
    }
  }

  // Footer attribution watermark (subtle comment or link)
  blocks.push(
    `---\n\n<div align="center">\n  <sub>Crafted with ❤️ using <a href="https://github.com/profileforge">ProfileForge</a></sub>\n</div>`
  );

  return blocks.join("\n\n") + "\n";
}
