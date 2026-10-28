import { CurrentStatusConfig } from "@/types/profile";

export function serializeCurrentStatus(config: CurrentStatusConfig): string {
  const items: string[] = [];

  if (config.workingOnText?.trim()) {
    const link = config.workingOnLink?.trim()
      ? ` ([${config.workingOnText.trim()}](${config.workingOnLink.trim()}))`
      : ` **${config.workingOnText.trim()}**`;
    items.push(`- 🔭 Working on${link}`);
  }

  if (config.learningText?.trim()) {
    items.push(`- 🌱 Learning **${config.learningText.trim()}**`);
  }

  if (config.collaboratingText?.trim()) {
    const link = config.collaboratingLink?.trim()
      ? ` ([${config.collaboratingText.trim()}](${config.collaboratingLink.trim()}))`
      : ` **${config.collaboratingText.trim()}**`;
    items.push(`- 💬 Looking to collaborate on${link}`);
  }

  if (config.pronouns?.trim()) {
    items.push(`- ⚡ Pronouns: **${config.pronouns.trim()}**`);
  }

  if (items.length === 0) return "";

  const lines: string[] = [];
  lines.push("## ⚡ Current Focus");
  lines.push("");
  lines.push(...items);
  lines.push("");

  return lines.join("\n");
}
