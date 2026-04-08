import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchForm } from "../search-form";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SearchForm", () => {
  it("renders input and button", () => {
    render(<SearchForm />);
    expect(
      screen.getByPlaceholderText("リポジトリ名を入力してください"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument();
  });

  it("button is disabled when input is empty", () => {
    render(<SearchForm />);
    const button = screen.getByRole("button", { name: "検索" });
    expect(button).toBeDisabled();
  });

  it("button is enabled when input has text", () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText("リポジトリ名を入力してください");
    fireEvent.change(input, { target: { value: "react" } });
    const button = screen.getByRole("button", { name: "検索" });
    expect(button).not.toBeDisabled();
  });

  it("navigates on form submit", () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText("リポジトリ名を入力してください");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/?q=react&page=1");
  });

  it("trims whitespace from query", () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText("リポジトリ名を入力してください");
    fireEvent.change(input, { target: { value: "  react  " } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/?q=react&page=1");
  });

  it("does not navigate on empty submit", () => {
    mockPush.mockClear();
    render(<SearchForm />);
    const form = screen.getByRole("button", { name: "検索" }).closest("form")!;
    fireEvent.submit(form);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
