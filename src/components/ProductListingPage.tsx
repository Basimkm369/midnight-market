'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';
import type { AddFormValues, EditFormValues } from '@/types/forms';
import ListingHeader from '@/components/listing/ListingHeader';
import FilterBar from '@/components/listing/FilterBar';
import ProductFormModal from '@/components/listing/ProductFormModal';
import DeleteConfirmModal from '@/components/listing/DeleteConfirmModal';
import {
  mapSort,
  useDebouncedValue,
  type DropdownOption,
  type SortOption,
  type SortQuery,
} from '@/lib/productListing';

const PAGE_SIZE = 12;

type DeletedProduct = Product & {
  isDeleted?: boolean;
  deletedOn?: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

type Category = string;

async function fetchProducts({
  pageParam,
  search,
  sort,
  category,
}: {
  pageParam: number;
  search: string;
  sort: SortQuery;
  category: string;
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
  const url = new URL(
    category
      ? `https://dummyjson.com/products/category/${category}`
      : search
        ? 'https://dummyjson.com/products/search'
        : 'https://dummyjson.com/products',
  );
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('skip', String(pageParam));
  url.searchParams.set('select', selectFields);
  url.searchParams.set('sortBy', sort.sortBy);
  url.searchParams.set('order', sort.order);
  if (search && !category) {
    url.searchParams.set('q', search);
  }

  const response = await axios.get<ProductsResponse>(url.toString());
  return response.data;
}

export default function ProductListingPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const debouncedSearch = useDebouncedValue(search.trim());
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const sortQuery = useMemo(() => mapSort(sortBy), [sortBy]);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<Category[]>(
        'https://dummyjson.com/products/category-list',
      );
      return response.data;
    },
    staleTime: 5 * 60_000,
  });

  const categoryList = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const asRecord = item as Record<string, unknown>;
        const slug = asRecord.slug;
        if (typeof slug === 'string') return slug;
        const name = asRecord.name;
        if (typeof name === 'string') return name;
      }
      return String(item);
    });
  }, [categories]);

  const sortOptions: DropdownOption[] = [
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const categoryOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', label: 'All categories' },
      ...categoryList.map((item) => ({ value: item, label: item })),
    ],
    [categoryList],
  );

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
    queryKey: [
      'products',
      debouncedSearch,
      sortQuery.sortBy,
      sortQuery.order,
      category,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        pageParam,
        search: debouncedSearch,
        sort: sortQuery,
        category,
      }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });

  const imageSchema = useMemo(
    () =>
      yup
        .mixed<FileList>()
        .test('fileSize', 'Image must be less than 10MB', (value) => {
          if (!value || value.length === 0) return true;
          return value[0].size <= 10 * 1024 * 1024;
        })
        .test('fileType', 'Only image files are allowed', (value) => {
          if (!value || value.length === 0) return true;
          return value[0].type.startsWith('image/');
        }),
    [],
  );

  const addSchema = useMemo(
    () =>
      yup.object({
        title: yup.string().trim().required('Title is required'),
        price: yup
          .number()
          .typeError('Price must be a number')
          .positive('Price must be greater than 0')
          .required('Price is required'),
        category: yup.string().trim().required('Category is required'),
        description: yup.string().trim().required('Description is required'),
        rating: yup
          .number()
          .typeError('Rating must be a number')
          .min(0, 'Rating must be between 0 and 5')
          .max(5, 'Rating must be between 0 and 5')
          .required('Rating is required'),
        image: imageSchema.required('Image is required'),
      }),
    [imageSchema],
  );

  const editSchema = useMemo(
    () =>
      yup.object({
        title: yup.string().trim().required('Title is required'),
        price: yup
          .number()
          .typeError('Price must be a number')
          .positive('Price must be greater than 0')
          .required('Price is required'),
        category: yup.string().trim().optional(),
        description: yup.string().trim().optional(),
        rating: yup
          .number()
          .typeError('Rating must be a number')
          .min(0, 'Rating must be between 0 and 5')
          .max(5, 'Rating must be between 0 and 5')
          .optional(),
        image: imageSchema.optional(),
      }),
    [imageSchema],
  );

  const addForm = useForm<AddFormValues>({
    resolver: yupResolver(addSchema),
    defaultValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      rating: undefined,
    },
  });

  const editForm = useForm<EditFormValues>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      rating: undefined,
    },
  });

  const addImageFiles = addForm.watch('image');
  const editImageFiles = editForm.watch('image');

  useEffect(() => {
    if (!addImageFiles || addImageFiles.length === 0) {
      setAddPreview(null);
      return;
    }
    const url = URL.createObjectURL(addImageFiles[0]);
    setAddPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [addImageFiles]);

  useEffect(() => {
    if (!editImageFiles || editImageFiles.length === 0) {
      setEditPreview(null);
      return;
    }
    const url = URL.createObjectURL(editImageFiles[0]);
    setEditPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [editImageFiles]);

  const addProductMutation = useMutation({
    mutationFn: async (payload: {
      data: AddFormValues;
      preview?: string | null;
    }) => {
      const fallbackProduct = {
        description: payload.data.description ?? 'Newly added product',
        thumbnail:
          payload.preview ??
          'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        rating: payload.data.rating ?? 4.2,
        brand: 'Custom',
        category: payload.data.category || category || 'misc',
        price: payload.data.price ?? 0,
      };
      const response = await axios.post<Product>(
        'https://dummyjson.com/products/add',
        {
          title: payload.data.title,
          price: payload.data.price,
          category: payload.data.category || category || undefined,
          description: payload.data.description,
          thumbnail: fallbackProduct.thumbnail,
          rating: payload.data.rating,
        },
      );
      const created = response.data;
      return {
        ...fallbackProduct,
        ...created,
        thumbnail: fallbackProduct.thumbnail,
        images: payload.preview ? [payload.preview] : created.images,
        isLocal: true,
      };
    },
    onSuccess: (created) => {
      queryClient.setQueryData(
        [
          'products',
          debouncedSearch,
          sortQuery.sortBy,
          sortQuery.order,
          category,
        ],
        (
          oldData:
            | { pages: ProductsResponse[]; pageParams: number[] }
            | undefined,
        ) => {
          if (!oldData?.pages?.length) return oldData;
          const [first, ...rest] = oldData.pages;
          const updatedFirst = {
            ...first,
            products: [created, ...first.products],
            total: first.total + 1,
          };
          return { ...oldData, pages: [updatedFirst, ...rest] };
        },
      );
      addForm.reset();
      setIsModalOpen(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      data: EditFormValues;
      preview?: string | null;
    }) => {
      const response = await axios.put<Product>(
        `https://dummyjson.com/products/${payload.id}`,
        {
          title: payload.data.title,
          price: payload.data.price,
          category: payload.data.category,
          description: payload.data.description,
          rating: payload.data.rating,
        },
      );
      return {
        ...response.data,
        thumbnail: payload.preview ?? response.data.thumbnail,
        images: payload.preview ? [payload.preview] : response.data.images,
      };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        [
          'products',
          debouncedSearch,
          sortQuery.sortBy,
          sortQuery.order,
          category,
        ],
        (
          oldData:
            | { pages: ProductsResponse[]; pageParams: number[] }
            | undefined,
        ) => {
          if (!oldData?.pages?.length) return oldData;
          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            products: page.products.map((product) =>
              product.id === updated.id ? { ...product, ...updated } : product,
            ),
          }));
          return { ...oldData, pages: updatedPages };
        },
      );
      queryClient.setQueryData(
        ['product', String(updated.id)],
        (old: Product | undefined) => (old ? { ...old, ...updated } : old),
      );
      editForm.reset();
      setEditingProduct(null);
      setIsModalOpen(false);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete<DeletedProduct>(
        `https://dummyjson.com/products/${id}`,
      );
      return response.data;
    },
    onSuccess: (deleted) => {
      queryClient.setQueryData(
        [
          'products',
          debouncedSearch,
          sortQuery.sortBy,
          sortQuery.order,
          category,
        ],
        (
          oldData:
            | { pages: ProductsResponse[]; pageParams: number[] }
            | undefined,
        ) => {
          if (!oldData?.pages?.length) return oldData;
          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            products: page.products.filter(
              (product) => product.id !== deleted.id,
            ),
          }));
          return { ...oldData, pages: updatedPages };
        },
      );
      queryClient.setQueryData(
        ['product', String(deleted.id)],
        (old: Product | undefined) => {
          if (!old) return old;
          return { ...old, ...(deleted as Product) };
        },
      );
    },
  });

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

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const filteredProducts = useMemo(() => {
    if (!category && !debouncedSearch) return products;
    const term = debouncedSearch.toLowerCase();
    if (!term || !category) return products;
    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    });
  }, [products, debouncedSearch, category]);

  const sortedProducts = filteredProducts;

  const totalResults = data?.pages[0]?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#0b0b0d] px-2 py-10 text-[#f4f1e9] sm:px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#3b3216,transparent_45%),radial-gradient(circle_at_bottom,#1a1a1f,transparent_45%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="relative z-[100] flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
          <ListingHeader
            title="Midnight Market"
            subtitle="Curated picks with smart search, effortless sorting, and smooth infinite browsing."
            totalResults={totalResults}
            loadedCount={products.length}
            onAdd={() => {
              setEditingProduct(null);
              addForm.reset();
              setIsModalOpen(true);
            }}
          />
        </header>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          onClearSearch={() => setSearch('')}
          category={category}
          categoryOptions={categoryOptions}
          categoryList={categoryList}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
          disableCategory={isCategoriesLoading || isCategoriesError}
        />

        {isError ? (
          <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
            <h2 className="text-lg font-semibold">Unable to load products</h2>
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
        ) : null}

        <section className="relative z-0 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-3xl border border-white/10 bg-black/40 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="aspect-[4/3] w-full rounded-2xl bg-white/10" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-2/3 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                  </div>
                </div>
              ))
            : sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/product/${product.id}`}
                  actions={
                    product.isLocal ? (
                      <span className="rounded-full border border-[#f3c34b]/40 bg-[#f3c34b]/10 px-3 py-1 text-xs font-semibold text-[#f3c34b]">
                        Local item
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#f4f1e9] transition hover:bg-white/10"
                          onClick={() => {
                            setEditingProduct(product);
                            editForm.reset({
                              title: product.title,
                              price: product.price,
                              category: product.category,
                              description: product.description,
                              rating: product.rating,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20"
                          onClick={() => {
                            setDeleteTarget(product);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )
                  }
                />
              ))}
        </section>

        {!isLoading && sortedProducts.length === 0 && !isError ? (
          <div className="rounded-3xl border border-white/10 bg-black/40 p-10 text-center text-[#c9c2b8] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
            No products match your search yet.
          </div>
        ) : null}

        {sortedProducts.length > 0 ? (
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetchingNextPage ? (
              <span className="rounded-full bg-black/40 px-4 py-2 text-sm font-semibold text-[#f4f1e9] shadow-sm">
                Loading more products...
              </span>
            ) : hasNextPage ? (
              <span className="rounded-full bg-black/40 px-4 py-2 text-sm text-[#a49c90] shadow-sm">
                Scroll to load more
              </span>
            ) : reachedEnd ? (
              <span className="rounded-full bg-black/40 px-4 py-2 text-sm text-[#a49c90] shadow-sm">
                You have reached the end.
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        addForm={addForm}
        editForm={editForm}
        addPreview={addPreview}
        editPreview={editPreview}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onAddSubmit={(values) =>
          addProductMutation.mutate({ data: values, preview: addPreview })
        }
        onEditSubmit={(values) => {
          if (!editingProduct) return;
          updateProductMutation.mutate({
            id: editingProduct.id,
            data: values,
            preview: editPreview,
          });
        }}
        onClearEditImage={() => {
          setEditPreview(null);
          editForm.setValue('image', undefined);
        }}
        isAddPending={addProductMutation.isPending}
        isEditPending={updateProductMutation.isPending}
      />
      {deleteTarget ? (
        <DeleteConfirmModal
          product={deleteTarget}
          isPending={deleteProductMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteProductMutation.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      ) : null}
    </div>
  );
}
