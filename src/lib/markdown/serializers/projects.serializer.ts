import { ProjectsConfig } from "@/types/profile";

export function serializeProjects(config: ProjectsConfig): string {
  if (!config.projects || config.projects.length === 0) return "";

  const lines: string[] = [];

  lines.push("## 🚀 Featured Projects");
  lines.push("");

  // Table representation formatted cleanly for GitHub
  lines.push("| Project | Description | Tech Stack | Links |");
  lines.push("| :--- | :--- | :--- | :--- |");

  for (const proj of config.projects) {
    const techBadges = (proj.techs || [])
      .map((t) => `\`${t.trim()}\``)
      .join(" ");

    const links: string[] = [];
    if (proj.repoUrl?.trim()) {
      links.push(`[GitHub](${proj.repoUrl.trim()})`);
    }
    if (proj.demoUrl?.trim()) {
      links.push(`[Live Demo](${proj.demoUrl.trim()})`);
    }
    const linksStr = links.join(" • ");

    // Sanitized description without pipe characters
    const cleanDesc = proj.description.replace(/\|/g, "/");

    lines.push(
      `| **[${proj.name}](${proj.repoUrl})** | ${cleanDesc} | ${techBadges || "—"} | ${linksStr || "—"} |`
    );
  }

  lines.push("");
  return lines.join("\n");
}
