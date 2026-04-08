import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchRepositories, getRepository, GitHubApiError } from "../github";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("searchRepositories", () => {
  it("returns empty results for empty query", async () => {
    const result = await searchRepositories("");
    expect(result).toEqual({
      total_count: 0,
      incomplete_results: false,
      items: [],
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns empty results for whitespace-only query", async () => {
    const result = await searchRepositories("   ");
    expect(result).toEqual({
      total_count: 0,
      incomplete_results: false,
      items: [],
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls GitHub API with correct parameters", async () => {
    const mockResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: "react",
          full_name: "facebook/react",
          owner: { login: "facebook", avatar_url: "https://example.com/avatar.png" },
          description: "A JavaScript library",
          language: "JavaScript",
          stargazers_count: 200000,
          watchers_count: 200000,
          forks_count: 40000,
          open_issues_count: 1000,
          html_url: "https://github.com/facebook/react",
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await searchRepositories("react", 1);

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/search/repositories");
    expect(url).toContain("q=react");
    expect(url).toContain("page=1");
    expect(url).toContain("per_page=20");
    expect(url).toContain("sort=stars");
    expect(result.total_count).toBe(1);
    expect(result.items[0].full_name).toBe("facebook/react");
  });

  it("passes page parameter correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ total_count: 0, incomplete_results: false, items: [] }),
    });

    await searchRepositories("test", 3);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("page=3");
  });

  it("throws GitHubApiError on 403 rate limit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    });

    await expect(searchRepositories("test")).rejects.toThrow(GitHubApiError);
    await expect(searchRepositories("test")).rejects.toThrow();
  });

  it("throws GitHubApiError on 422 validation error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
    });

    await expect(searchRepositories("test")).rejects.toThrow(GitHubApiError);
  });
});

describe("getRepository", () => {
  it("calls correct API endpoint", async () => {
    const mockRepo = {
      id: 1,
      name: "react",
      full_name: "facebook/react",
      owner: { login: "facebook", avatar_url: "https://example.com/avatar.png" },
      description: "A JavaScript library",
      language: "JavaScript",
      stargazers_count: 200000,
      watchers_count: 200000,
      forks_count: 40000,
      open_issues_count: 1000,
      html_url: "https://github.com/facebook/react",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepo),
    });

    const result = await getRepository("facebook", "react");

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/repos/facebook/react");
    expect(result.full_name).toBe("facebook/react");
  });

  it("throws on 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(getRepository("nonexistent", "repo")).rejects.toThrow(
      GitHubApiError,
    );
  });
});
