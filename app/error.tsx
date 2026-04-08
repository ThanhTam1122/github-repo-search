"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          エラーが発生しました
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {error.message || "予期しないエラーが発生しました。しばらくしてから再度お試しください。"}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors cursor-pointer"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
