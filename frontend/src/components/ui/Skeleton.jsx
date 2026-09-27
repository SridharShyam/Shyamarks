import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-surface-elevated/60 ${className}`}
    />
  );
};

export const AchievementCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-[280px]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-xl mt-4" />
    </div>
  );
};

export const SkillCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-20 mb-4" />
      <Skeleton className="h-3 w-full rounded-full mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
};
