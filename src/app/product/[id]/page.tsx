"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";

type ProductDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail: string;
  images: string[];
};

async function fetchProduct(id: string): Promise<ProductDetail> {
  const response = await axios.get<ProductDetail>(
    `https://dummyjson.com/products/${id}`,
  );
  return response.data;
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId =
    typeof params?.id === "string" ? params.id : params?.id?.[0];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId ?? ""),
    enabled: Boolean(productId),
  });

  if (isLoading) {
    return (
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
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100 shadow-sm">
          <h1 className="text-lg font-semibold">Unable to load product</h1>
          <p className="mt-2 text-sm text-rose-100/80">
            {(error as Error)?.message ?? "Something went wrong."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c34b] shadow-sm transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          ← Back to products
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <Image
                src={data.thumbnail}
                alt={data.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data.images.slice(0, 6).map((image) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                >
                  <Image
                    src={image}
                    alt={`${data.title} preview`}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c34b]">
                {data.brand} · {data.category}
              </p>
              <h1 className="text-3xl font-semibold text-[#f4f1e9]">
                {data.title}
              </h1>
              <p className="text-sm text-[#c9c2b8]">{data.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-[#f4f1e9]">
                ${data.price}
              </span>
              <span className="rounded-full bg-[#f3c34b] px-3 py-1 text-xs font-semibold text-[#1a1a1f]">
                {data.discountPercentage.toFixed(2)}% off
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f4f1e9]">
                ⭐ {data.rating.toFixed(1)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#c9c2b8]">
              <span className="rounded-full bg-white/10 px-3 py-1">
                Stock: {data.stock}
              </span>
              {data.availabilityStatus ? (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {data.availabilityStatus}
                </span>
              ) : null}
              {data.shippingInformation ? (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {data.shippingInformation}
                </span>
              ) : null}
              {data.warrantyInformation ? (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {data.warrantyInformation}
                </span>
              ) : null}
            </div>

            <div className="space-y-3 text-sm text-[#c9c2b8]">
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[#a49c90]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid gap-2 text-xs text-[#a49c90] sm:grid-cols-2">
                <span>SKU: {data.sku}</span>
                <span>Weight: {data.weight}</span>
                {data.dimensions ? (
                  <span>
                    Dimensions: {data.dimensions.width} × {data.dimensions.height} ×{" "}
                    {data.dimensions.depth}
                  </span>
                ) : null}
                {data.returnPolicy ? (
                  <span>Return policy: {data.returnPolicy}</span>
                ) : null}
                {data.minimumOrderQuantity ? (
                  <span>Min order: {data.minimumOrderQuantity}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
