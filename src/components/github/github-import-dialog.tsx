"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/stores/use-profile-store";
import { Github, Loader2, Check, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function GithubImportDialog() {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<any | null>(null);

  const {
    config,
    setGithubUsername,
    updateSectionConfig,
  } = useProfileStore();

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser) return;

    setIsLoading(true);
    setError(null);
    setUserData(null);

    try {
      const res = await fetch(`/api/github/user/${encodeURIComponent(cleanUser)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch GitHub profile");
      }

      setUserData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load GitHub data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!userData) return;

    // 1. Update store username
    setGithubUsername(userData.username);

    // 2. Update Header section
    const headerSec = config.sections.find((s) => s.type === "header");
    if (headerSec) {
      updateSectionConfig(headerSec.id, {
        name: userData.name || userData.username,
        avatarUrl: userData.avatarUrl,
        avatarStyle: "circle",
      });
    }

    // 3. Update About Me section
    const aboutSec = config.sections.find((s) => s.type === "about");
    if (aboutSec && userData.bio) {
      updateSectionConfig(aboutSec.id, {
        bio: userData.bio,
        reachMeAt: userData.blog || "",
      });
    }

    // 4. Update Projects section with top starred repos
    const projectsSec = config.sections.find((s) => s.type === "projects");
    if (projectsSec && userData.topRepos?.length > 0) {
      const mappedProjects = userData.topRepos.slice(0, 4).map((r: any) => ({
        id: `gh_repo_${r.name}_${Date.now()}`,
        name: r.name,
        description: r.description || "Open source GitHub repository.",
        repoUrl: r.htmlUrl,
        demoUrl: r.homepage || "",
        techs: r.language ? [r.language] : [],
        starsBadge: true,
      }));

      updateSectionConfig(projectsSec.id, {
        projects: mappedProjects,
      });
    }

    toast.success(`Imported @${userData.username}'s GitHub profile!`);
    setOpen(false);
    setUserData(null);
    setUsername("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">Import GitHub</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Import from GitHub
          </DialogTitle>
          <DialogDescription>
            Enter your GitHub username to auto-populate your avatar, bio, top starred repos, and stats widgets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFetch} className="space-y-4 pt-2">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. torvalds, vercel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" disabled={isLoading || !username.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {userData && (
          <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              {userData.avatarUrl && (
                <img
                  src={userData.avatarUrl}
                  alt={userData.username}
                  className="h-12 w-12 rounded-full border"
                />
              )}
              <div>
                <h4 className="font-semibold text-foreground">
                  {userData.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  @{userData.username} • {userData.publicRepos} public repos
                </p>
              </div>
            </div>

            {userData.bio && (
              <p className="text-sm text-muted-foreground italic line-clamp-2">
                &ldquo;{userData.bio}&rdquo;
              </p>
            )}

            {userData.topRepos?.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-foreground">
                  Top Repositories Detected:
                </span>
                <div className="flex flex-wrap gap-1">
                  {userData.topRepos.slice(0, 3).map((r: any) => (
                    <span
                      key={r.name}
                      className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                    >
                      ⭐ {r.stars} {r.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {userData && (
            <Button onClick={handleApply} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Apply to Profile
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
