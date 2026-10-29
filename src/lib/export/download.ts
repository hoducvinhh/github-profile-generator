import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ProfileConfig } from "@/types/profile";

export function downloadReadme(markdown: string, filename = "README.md") {
  try {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, filename);
    toast.success("Downloaded README.md!");
  } catch (err) {
    toast.error("Failed to download file");
  }
}

export function downloadProfileConfigJson(
  config: ProfileConfig,
  filename = "profileforge-config.json"
) {
  try {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, filename);
    toast.success("Downloaded configuration backup!");
  } catch (err) {
    toast.error("Failed to export JSON config");
  }
}
