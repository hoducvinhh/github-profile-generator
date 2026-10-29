import confetti from "canvas-confetti";
import { toast } from "sonner";

export async function copyMarkdownToClipboard(markdown: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(markdown);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      disableForReducedMotion: true,
    });

    toast.success("Markdown copied to clipboard!", {
      description: "Paste directly into your GitHub profile README.md",
    });

    return true;
  } catch (err) {
    toast.error("Failed to copy Markdown", {
      description: "Please check your browser permissions.",
    });
    return false;
  }
}
