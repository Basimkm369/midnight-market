'use client';

import dynamic from 'next/dynamic';

const CategoryListingPage = dynamic(
  () => import('@/components/CategoryListingPage'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="h-8 w-1/3 animate-pulse rounded-full bg-white/10" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export default function CategoryPage() {
  return <CategoryListingPage />;
}
