import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository, GitHubApiError } from "@/lib/github";

interface PageProps {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} - GitHub Repository Search`,
    description: `Details for ${owner}/${repo} repository on GitHub.`,
  };
}

export default async function RepositoryDetailPage({ params, searchParams }: PageProps) {
  const { owner, repo } = await params;
  const { q, page } = await searchParams;
  const backHref = q ? `/?q=${encodeURIComponent(q)}&page=${page || "1"}` : "/";

  let repository;
  try {
    repository = await getRepository(owner, repo);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const stats = [
    { label: "Star数", value: repository.stargazers_count },
    { label: "Watcher数", value: repository.watchers_count },
    { label: "Fork数", value: repository.forks_count },
    { label: "Issue数", value: repository.open_issues_count },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップページへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Repository header */}
          <div className="flex items-start gap-5 mb-8">
            <Image
              src={repository.owner.avatar_url}
              alt={`${repository.owner.login}'s avatar`}
              width={80}
              height={80}
              className="rounded-full shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                {repository.full_name}
              </h1>
              {repository.language && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  {repository.language}
                </p>
              )}
              {repository.description && (
                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {repository.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* External link */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHubで開く
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
