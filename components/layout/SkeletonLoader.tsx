export function SkeletonLoader() {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {[...Array(6)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: This is a static list of skeleton loaders, so using the index as a key is acceptable here.
        <div key={i} className="h-20 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
