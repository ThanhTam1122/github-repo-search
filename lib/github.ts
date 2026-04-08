import { GitHubRepository, GitHubSearchResponse } from "./types";

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_PER_PAGE = 20;
const VALID_PER_PAGE = [10, 20, 30, 50];
const VALID_SORT = ["stars", "forks", "updated", "help-wanted-issues", "best-match"] as const;

export type SortOption = typeof VALID_SORT[number];

export function validatePerPage(value: number): number {
  return VALID_PER_PAGE.includes(value) ? value : DEFAULT_PER_PAGE;
}

export function validateSort(value: string): SortOption {
  return VALID_SORT.includes(value as SortOption) ? (value as SortOption) : "stars";
}

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
  sort: SortOption = "stars",
  perPage: number = DEFAULT_PER_PAGE,
): Promise<GitHubSearchResponse> {
  if (!query.trim()) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }

  const params = new URLSearchParams({
    q: query,
    order: "desc",
    per_page: String(perPage),
    page: String(page),
  });

  // "best-match" is GitHub's default (no sort param)
  if (sort !== "best-match") {
    params.set("sort", sort);
  }

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

export { DEFAULT_PER_PAGE, VALID_PER_PAGE, VALID_SORT };
