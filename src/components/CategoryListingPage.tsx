'use client';

import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';

const PAGE_SIZE = 12;

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
type SortQuery = { sortBy: 'price' | 'title'; order: 'asc' | 'desc' };

function mapSort(sortBy: SortOption): SortQuery {
  switch (sortBy) {
    case 'price-desc':
      return { sortBy: 'price', order: 'desc' };
    case 'name-asc':
      return { sortBy: 'title', order: 'asc' };
    case 'name-desc':
      return { sortBy: 'title', order: 'desc' };
    default:
      return { sortBy: 'price', order: 'asc' };
  }
}

async function fetchCategoryProducts({
  pageParam,
  category,
  sort,
}: {
  pageParam: number;
  category: string;
  sort: SortQuery;
}): Promise<ProductsResponse> {
  const selectFields = [
    'title',
    'price',
    'thumbnail',
    'brand',
    'category',
    'rating',
    'description',
  ].join(',');
  const url = new URL(`https://dummyjson.com/products/category/${category}`);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('skip', String(pageParam));
  url.searchParams.set('select', selectFields);
  url.searchParams.set('sortBy', sort.sortBy);
  url.searchParams.set('order', sort.order);

  const response = await axios.get<ProductsResponse>(url.toString());
  return response.data;
}

export default function CategoryListingPage() {
  const params = useParams<{ slug: string }>();
  const slug =
    typeof params?.slug === 'string' ? params.slug : params?.slug?.[0];
  const sortQuery = useMemo(() => mapSort('price-asc'), []);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['category-products', slug, sortQuery.sortBy, sortQuery.order],
    queryFn: ({ pageParam = 0 }) =>
      fetchCategoryProducts({
        pageParam,
        category: slug ?? '',
        sort: sortQuery,
      }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    enabled: Boolean(slug),
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
        if (entries[0].isIntersecting && !hasNextPage && products.length > 0) {
          setReachedEnd(true);
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100 shadow-sm">
          <h1 className="text-lg font-semibold">Unable to load category</h1>
          <p className="mt-2 text-sm text-rose-100/80">
            {(error as Error)?.message ?? 'Something went wrong.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%),#0b0b0d] px-4 py-10 text-[#f4f1e9] sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c34b] shadow-sm transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          ƒ+? Back to products
        </Link>

        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c34b]">
            Category
          </p>
          <h1 className="text-3xl font-semibold text-[#f4f1e9] sm:text-4xl">
            {slug ?? 'Loading...'}
          </h1>
          <p className="text-sm text-[#c9c2b8]">
            Browse products from this category with infinite scroll.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm"
                >
                  <div className="aspect-[4/3] w-full rounded-2xl bg-white/10" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-2/3 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/product/${product.id}`}
                />
              ))}
        </section>

        {products.length > 0 ? (
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetchingNextPage ? (
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-[#f4f1e9] shadow-sm">
                Loading more products...
              </span>
            ) : hasNextPage ? (
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-[#a49c90] shadow-sm">
                Scroll to load more
              </span>
            ) : reachedEnd ? (
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-[#a49c90] shadow-sm">
                You have reached the end.
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
