import React from 'react';

export const HeroSkeleton: React.FC = () => (
  <div className="flex flex-col mb-8 border-b border-gray-200 pb-8 animate-pulse">
    <div className="w-full h-[250px] sm:h-[400px] bg-gray-200 rounded-sm mb-4"></div>
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-2 bg-gray-200 rounded"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 w-3/4 bg-gray-200 rounded mb-3"></div>
      <div className="h-10 w-1/2 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const GridSkeleton: React.FC = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-200 rounded-sm mb-3"></div>
    <div className="flex-1 flex flex-col">
      <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-6 w-2/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-full bg-gray-200 rounded mb-2 mt-2"></div>
      <div className="h-3 w-4/5 bg-gray-200 rounded mb-4"></div>
      <div className="h-3 w-32 bg-gray-200 rounded mt-auto"></div>
    </div>
  </div>
);

export const CompactSkeleton: React.FC = () => (
  <div className="flex gap-4 mb-6 border-b border-gray-100 pb-6 animate-pulse items-start">
    <div className="flex-1">
      <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
      <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="w-24 h-24 shrink-0 bg-gray-200 rounded-sm"></div>
  </div>
);

export const TrendingSkeleton: React.FC = () => (
  <div className="flex gap-4 animate-pulse items-start">
    <div className="h-10 w-6 bg-gray-200 rounded"></div>
    <div className="pt-2 flex-1">
      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  </div>
);
