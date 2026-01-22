"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  href: string;
  actions?: ReactNode;
};

export default function ProductCard({ product, href, actions }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-black/40 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-white/20">
      <Link href={href} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link href={href}>
          <h3 className="text-base font-semibold text-[#f4f1e9]">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs uppercase tracking-wide text-[#a49c90]">
          {product.brand} - {product.category}
        </p>
        <p className="text-sm text-[#c9c2b8] [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
          {product.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-lg font-semibold text-[#f4f1e9]">
          ${product.price}
        </span>
        <span className="rounded-full bg-[#f3c34b] px-3 py-1 text-xs font-semibold text-[#1a1a1f]">
          Rating: {product.rating.toFixed(1)}
        </span>
      </div>
      {actions ? <div className="mt-4 flex items-center gap-2">{actions}</div> : null}
    </article>
  );
}
