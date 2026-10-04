/**
 * Skeleton loading components for dashboard
 */

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="w-14 h-5 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
      <div className="w-32 h-7 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}

export function SkeletonChart({ className = '', height = 'h-64' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse ${className}`}>
      <div className="w-40 h-5 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
      <div className={`${height} bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-end gap-2 p-4`}>
        {[60, 80, 45, 90, 55, 70, 85, 50, 75, 65, 80, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 animate-pulse ${className}`}>
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <div className="w-32 h-3 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
        <div className="w-20 h-2.5 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="w-20 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}
