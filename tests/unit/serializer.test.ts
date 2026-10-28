import { describe, it, expect } from "vitest";
import { serializeProfileMarkdown } from "@/lib/markdown/serializer";
import { getTemplate } from "@/lib/templates/registry";
import { ProfileConfigSchema } from "@/schemas/profile.schema";

describe("Markdown Serializer & Templates", () => {
  it("serializes Modern Developer template without errors", () => {
    const config = getTemplate("modern").createConfig("alexrivera");
    const markdown = serializeProfileMarkdown(config);

    expect(markdown).toContain("Alex Rivera");
    expect(markdown).toContain("## 📖 About Me");
    expect(markdown).toContain("## 🌐 Connect with Me");
    expect(markdown).toContain("## 🛠️ Languages & Tools");
    expect(markdown).toContain("## 📊 GitHub Statistics");
    expect(markdown).toContain("## 🚀 Featured Projects");
    expect(markdown).toContain("ProfileForge");
  });

  it("serializes Minimalist template without badges or headers clutter", () => {
    const config = getTemplate("minimal").createConfig("alexrivera");
    const markdown = serializeProfileMarkdown(config);

    expect(markdown).toContain("# Alex Rivera");
    expect(markdown).toContain("Software Engineer");
    expect(markdown).not.toContain("## 📊 GitHub Statistics"); // Minimal does not include stats
  });

  it("serializes Terminal template with bash aesthetic", () => {
    const config = getTemplate("terminal").createConfig("alexrivera");
    const markdown = serializeProfileMarkdown(config);

    expect(markdown).toContain("$ whoami");
    expect(markdown).toContain("```bash");
  });

  it("escapes table pipes in projects cleanly", () => {
    const config = getTemplate("minimal").createConfig("alexrivera");
    config.sections.push({
      id: "test_proj",
      type: "projects",
      title: "Projects",
      enabled: true,
      config: {
        alignment: "left",
        projects: [
          {
            id: "p1",
            name: "Test | Broken Pipe",
            description: "Has | pipe symbols | inside",
            repoUrl: "https://github.com",
            techs: ["TS"],
          },
        ],
      },
    });

    const markdown = serializeProfileMarkdown(config);
    expect(markdown).toContain("Has / pipe symbols / inside");
  });

  it("validates Zod profile schema for valid config", () => {
    const config = getTemplate("creative").createConfig("alexrivera");
    const parseResult = ProfileConfigSchema.safeParse(config);
    expect(parseResult.success).toBe(true);
  });
});
