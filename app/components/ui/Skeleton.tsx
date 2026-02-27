type SkeletonProps = { className?: string };

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-600 rounded ${className}`}
    ></div>
  );
}
