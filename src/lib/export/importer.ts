import { ProfileConfig } from "@/types/profile";
import { ProfileConfigSchema } from "@/schemas/profile.schema";
import { toast } from "sonner";

export function importConfigFromFile(
  file: File,
  onSuccess: (config: ProfileConfig) => void
) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const json = JSON.parse(text);
      const result = ProfileConfigSchema.safeParse(json);

      if (!result.success) {
        toast.error("Invalid configuration file format", {
          description: "The JSON file does not conform to the ProfileForge schema.",
        });
        return;
      }

      onSuccess(result.data as unknown as ProfileConfig);
      toast.success("Profile configuration restored successfully!");
    } catch (err) {
      toast.error("Failed to parse JSON file");
    }
  };

  reader.readAsText(file);
}
