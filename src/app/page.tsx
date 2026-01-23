"use client";

import dynamic from "next/dynamic";

const ProductListingPage = dynamic(
  () => import("@/components/ProductListingPage"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0b0b0d] px-4 py-16 text-[#f4f1e9]">
        <div className="mx-auto w-full max-w-5xl animate-pulse space-y-6">
          <div className="h-10 w-1/2 rounded-full bg-white/10" />
          <div className="h-6 w-1/3 rounded-full bg-white/10" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`lazy-skeleton-${index}`}
                className="h-48 rounded-3xl border border-white/10 bg-black/40"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return <ProductListingPage />;
}
