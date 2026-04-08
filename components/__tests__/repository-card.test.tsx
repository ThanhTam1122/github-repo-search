import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RepositoryCard } from "../repository-card";
import { GitHubRepository } from "@/lib/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockRepository: GitHubRepository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
  description: "The library for web and native user interfaces.",
  language: "JavaScript",
  stargazers_count: 230000,
  watchers_count: 230000,
  forks_count: 47000,
  open_issues_count: 900,
  html_url: "https://github.com/facebook/react",
};

describe("RepositoryCard", () => {
  it("renders repository name", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(
      screen.getByText("The library for web and native user interfaces."),
    ).toBeInTheDocument();
  });

  it("renders language", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("renders star count with locale formatting", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("★ 230,000")).toBeInTheDocument();
  });

  it("renders owner avatar", () => {
    render(<RepositoryCard repository={mockRepository} />);
    const img = screen.getByAltText("facebook's avatar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockRepository.owner.avatar_url);
  });

  it("links to detail page", () => {
    render(<RepositoryCard repository={mockRepository} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/repositories/facebook/react");
  });

  it("handles repository without description", () => {
    const repoWithoutDesc = { ...mockRepository, description: null };
    render(<RepositoryCard repository={repoWithoutDesc} />);
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
  });

  it("handles repository without language", () => {
    const repoWithoutLang = { ...mockRepository, language: null };
    render(<RepositoryCard repository={repoWithoutLang} />);
    expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
  });
});
