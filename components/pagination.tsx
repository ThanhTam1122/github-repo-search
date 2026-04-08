"use client";

import Link from "next/link";
interface PaginationProps {
  query: string;
  currentPage: number;
  totalCount: number;
  sort: string;
  perPage: number;
}

export function Pagination({ query, currentPage, totalCount, sort, perPage }: PaginationProps) {
  // GitHub API limits search results to 1000
  const effectiveTotal = Math.min(totalCount, 1000);
  const totalPages = Math.ceil(effectiveTotal / perPage);

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
    `/?q=${encodeURIComponent(query)}&page=${page}&sort=${sort}&per_page=${perPage}`;

  const buttonBase =
    "inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-xl text-sm font-medium transition-all duration-200";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-8">
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className={`${buttonBase} text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400`}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className={`${buttonBase} text-gray-300 dark:text-gray-700 cursor-not-allowed`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
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
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
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
          className={`${buttonBase} text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400`}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className={`${buttonBase} text-gray-300 dark:text-gray-700 cursor-not-allowed`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}
