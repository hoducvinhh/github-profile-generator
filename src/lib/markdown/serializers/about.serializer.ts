import { AboutConfig } from "@/types/profile";

export function serializeAbout(config: AboutConfig): string {
  const lines: string[] = [];

  lines.push("## 📖 About Me");
  lines.push("");

  if (config.bio?.trim()) {
    lines.push(config.bio.trim());
    lines.push("");
  }

  const bullets: string[] = [];
  if (config.currentWork?.trim()) {
    bullets.push(`- 🔭 I’m currently working on **${config.currentWork.trim()}**`);
  }
  if (config.collaborateOn?.trim()) {
    bullets.push(`- 👯 I’m looking to collaborate on **${config.collaborateOn.trim()}**`);
  }
  if (config.askMeAbout?.trim()) {
    bullets.push(`- 💬 Ask me about **${config.askMeAbout.trim()}**`);
  }
  if (config.reachMeAt?.trim()) {
    bullets.push(`- 📫 How to reach me: **${config.reachMeAt.trim()}**`);
  }
  if (config.funFact?.trim()) {
    bullets.push(`- ⚡ Fun fact: **${config.funFact.trim()}**`);
  }

  if (bullets.length > 0) {
    lines.push(...bullets);
    lines.push("");
  }

  return lines.join("\n");
}
