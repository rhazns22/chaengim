export function SkeletonCard() {
  return (
    <div className="w-full bg-white border border-divider rounded-[24px] p-5 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 bg-background rounded-[20px]" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-background rounded w-2/3" />
          <div className="h-3 bg-background rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-divider w-full mb-4" />
      <div className="h-4 bg-background rounded w-1/3" />
    </div>
  );
}