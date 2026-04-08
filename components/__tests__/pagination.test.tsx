import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "../pagination";

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

describe("Pagination", () => {
  it("does not render when total fits on one page", () => {
    const { container } = render(
      <Pagination query="test" currentPage={1} totalCount={10} />,
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("renders page numbers for multiple pages", () => {
    render(
      <Pagination query="react" currentPage={1} totalCount={100} />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("highlights current page", () => {
    render(
      <Pagination query="react" currentPage={2} totalCount={100} />,
    );
    const currentPageLink = screen.getByText("2");
    expect(currentPageLink).toHaveAttribute("aria-current", "page");
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination query="test" currentPage={1} totalCount={100} />,
    );
    const prevButton = screen.getByText("←");
    expect(prevButton.tagName).toBe("SPAN"); // disabled = span, not link
  });

  it("enables previous button on later pages", () => {
    render(
      <Pagination query="test" currentPage={3} totalCount={100} />,
    );
    const prevButtons = screen.getAllByText("←");
    const prevLink = prevButtons.find((el) => el.tagName === "A");
    expect(prevLink).toBeDefined();
    expect(prevLink).toHaveAttribute("href", "/?q=test&page=2");
  });

  it("generates correct page URLs", () => {
    render(
      <Pagination query="next.js" currentPage={1} totalCount={100} />,
    );
    const page2Link = screen.getByText("2");
    expect(page2Link).toHaveAttribute("href", "/?q=next.js&page=2");
  });

  it("caps total pages based on GitHub API limit of 1000 results", () => {
    render(
      <Pagination query="test" currentPage={1} totalCount={50000} />,
    );
    // 1000 / 20 = 50 pages max
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
