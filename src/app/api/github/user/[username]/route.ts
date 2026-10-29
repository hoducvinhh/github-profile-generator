import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

// In-memory cache to prevent hitting rate limits during user editing
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cleanUsername = username?.trim().toLowerCase();

  if (!cleanUsername) {
    return NextResponse.json(
      { error: "Username parameter is required" },
      { status: 400 }
    );
  }

  // Check cache
  const cached = cache.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  }

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });

    // 1. Fetch user profile
    const { data: user } = await octokit.rest.users.getByUsername({
      username: cleanUsername,
    });

    // 2. Fetch public repos sorted by stars/updated
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: cleanUsername,
      sort: "updated",
      per_page: 30,
      type: "owner",
    });

    // Sort by stargazers_count descending
    const sortedRepos = [...repos].sort(
      (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
    );

    const topRepos = sortedRepos.slice(0, 6).map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      htmlUrl: repo.html_url,
      homepage: repo.homepage || "",
      stars: repo.stargazers_count ?? 0,
      language: repo.language || "",
      forks: repo.forks_count ?? 0,
    }));

    // Extract dominant languages
    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    }

    const payload = {
      username: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio || "",
      location: user.location || "",
      company: user.company || "",
      blog: user.blog || "",
      twitterUsername: user.twitter_username || "",
      publicRepos: user.public_repos,
      followers: user.followers,
      topRepos,
      languages: Object.keys(languageCounts),
    };

    // Store in cache
    cache.set(cleanUsername, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json(
        { error: `GitHub user "${username}" was not found.` },
        { status: 404 }
      );
    }
    if (error.status === 403) {
      return NextResponse.json(
        {
          error:
            "GitHub API rate limit exceeded. Set GITHUB_TOKEN in .env.local to raise limits.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch GitHub profile" },
      { status: 500 }
    );
  }
}
