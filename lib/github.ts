import { GitHubRepository, GitHubSearchResponse } from "./types";

const GITHUB_API_BASE = "https://api.github.com";
const PER_PAGE = 20;

export class GitHubApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new GitHubApiError(
        403,
        "GitHub API rate limit exceeded. Please try again later.",
      );
    }
    if (res.status === 422) {
      throw new GitHubApiError(422, "Invalid search query.");
    }
    throw new GitHubApiError(res.status, `GitHub API error: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function searchRepositories(
  query: string,
  page: number = 1,
): Promise<GitHubSearchResponse> {
  if (!query.trim()) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }

  const params = new URLSearchParams({
    q: query,
    sort: "stars",
    order: "desc",
    per_page: String(PER_PAGE),
    page: String(page),
  });

  return fetchGitHub<GitHubSearchResponse>(
    `/search/repositories?${params.toString()}`,
  );
}

export async function getRepository(
  owner: string,
  repo: string,
): Promise<GitHubRepository> {
  return fetchGitHub<GitHubRepository>(`/repos/${owner}/${repo}`);
}

export async function getReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const data = await fetchGitHub<{ content: string; encoding: string }>(
      `/repos/${owner}/${repo}/readme`,
    );
    if (data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return data.content;
  } catch {
    return null;
  }
}

export { PER_PAGE };
