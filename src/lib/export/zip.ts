import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ProfileConfig } from "@/types/profile";

export async function downloadZipBundle(
  markdown: string,
  config: ProfileConfig
) {
  try {
    const zip = new JSZip();

    // 1. README.md
    zip.file("README.md", markdown);

    // 2. Profile configuration JSON
    zip.file("profileforge-config.json", JSON.stringify(config, null, 2));

    // 3. How to use guide
    const instructions = `# How to set up your GitHub Profile README

1. Log into your GitHub account.
2. Create a new repository named exactly as your GitHub username (e.g. \`${config.githubUsername || "your-username"}/${config.githubUsername || "your-username"}\`).
3. Make sure the repository is marked as **Public** and check **"Add a README file"**.
4. Replace the contents of \`README.md\` in that repository with the generated \`README.md\` in this bundle.
5. Commit your changes—your new profile is live!

---
*Created with ProfileForge (https://github.com/profileforge)*
`;
    zip.file("HOW_TO_USE.md", instructions);

    // Generate zip blob
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "github-profile-bundle.zip");

    toast.success("Downloaded GitHub Profile ZIP bundle!");
  } catch (err) {
    toast.error("Failed to generate ZIP bundle");
  }
}
