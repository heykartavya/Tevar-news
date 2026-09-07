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


export const VideoGridSkeleton: React.FC = () => (
  <div className="w-full bg-zinc-900 py-12 mt-12 border-t-4 border-red-700 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-700 pb-2">
        <div className="h-8 w-48 bg-zinc-700 rounded"></div>
        <div className="h-5 w-20 bg-zinc-700 rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-[9/16] bg-zinc-800 rounded-md"></div>
        ))}
      </div>
    </div>
  </div>
);

export const ArticlePageSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-pulse">
    {/* Category & Date */}
    <div className="flex items-center space-x-2 mb-6">
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    {/* Title */}
    <div className="h-12 w-full bg-gray-200 rounded mb-4"></div>
    <div className="h-12 w-3/4 bg-gray-200 rounded mb-8"></div>
    {/* Excerpt */}
    <div className="h-6 w-full bg-gray-200 rounded mb-3"></div>
    <div className="h-6 w-5/6 bg-gray-200 rounded mb-8"></div>
    {/* Author Info */}
    <div className="flex items-center space-x-4 mb-8 py-4 border-y border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* Main Image */}
    <div className="w-full aspect-[21/9] bg-gray-200 rounded mb-10"></div>
    {/* Content paragraphs */}
    <div className="space-y-4">
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
      <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const AdminListSkeleton: React.FC = () => (
  <ul className="divide-y divide-gray-200 animate-pulse">
    {[1, 2, 3, 4, 5].map(i => (
      <li key={i} className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
          <div className="ml-5 flex-shrink-0 flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </li>
    ))}
  </ul>
);
