"use client";

import dynamic from "next/dynamic";

const ProductDetailPage = dynamic(
  () => import("@/components/ProductDetailPage"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-white/10" />
            <div className="space-y-4">
              <div className="h-6 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-white/10" />
              <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
);

export default function ProductPage() {
  return <ProductDetailPage />;
}
