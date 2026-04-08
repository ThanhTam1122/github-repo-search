"use client";

import Link from "next/link";
import { PER_PAGE } from "@/lib/github";

interface PaginationProps {
  query: string;
  currentPage: number;
  totalCount: number;
}

export function Pagination({ query, currentPage, totalCount }: PaginationProps) {
  // GitHub API limits search results to 1000
  const effectiveTotal = Math.min(totalCount, 1000);
  const totalPages = Math.ceil(effectiveTotal / PER_PAGE);

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageUrl = (page: number) =>
    `/?q=${encodeURIComponent(query)}&page=${page}`;

  const buttonBase =
    "inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className={`${buttonBase} text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`}
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span className={`${buttonBase} text-gray-300 dark:text-gray-700 cursor-not-allowed`}>
          ←
        </span>
      )}

      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className={`${buttonBase} text-gray-400 cursor-default`}>
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`${buttonBase} ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className={`${buttonBase} text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800`}
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span className={`${buttonBase} text-gray-300 dark:text-gray-700 cursor-not-allowed`}>
          →
        </span>
      )}
    </nav>
  );
}
