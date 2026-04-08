import Image from "next/image";
import Link from "next/link";
import { GitHubRepository } from "@/lib/types";

interface RepositoryCardProps {
  repository: GitHubRepository;
  query: string;
  page: number;
}

export function RepositoryCard({ repository, query, page }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repository.owner.login}/${repository.name}?q=${encodeURIComponent(query)}&page=${page}`}
      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200
        hover:border-blue-300 hover:bg-blue-50/50
        dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/30
        transition-all group"
    >
      <Image
        src={repository.owner.avatar_url}
        alt={`${repository.owner.login}'s avatar`}
        width={48}
        height={48}
        className="rounded-full shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
          {repository.full_name}
        </h3>
        {repository.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {repository.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
          {repository.language && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              {repository.language}
            </span>
          )}
          <span>★ {repository.stargazers_count.toLocaleString()}</span>
          <span>🍴 {repository.forks_count.toLocaleString()}</span>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
