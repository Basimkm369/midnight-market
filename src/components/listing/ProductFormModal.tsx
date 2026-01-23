"use client";

import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import type { AddFormValues, EditFormValues } from "@/types/forms";
import type { Product } from "@/types/product";

type ProductFormModalProps = {
  isOpen: boolean;
  editingProduct: Product | null;
  addForm: UseFormReturn<AddFormValues, unknown, AddFormValues>;
  editForm: UseFormReturn<EditFormValues, unknown, EditFormValues>;
  addPreview: string | null;
  editPreview: string | null;
  onClose: () => void;
  onAddSubmit: (values: AddFormValues) => void;
  onEditSubmit: (values: EditFormValues) => void;
  onClearEditImage: () => void;
  isAddPending: boolean;
  isEditPending: boolean;
};

export default function ProductFormModal({
  isOpen,
  editingProduct,
  addForm,
  editForm,
  addPreview,
  editPreview,
  onClose,
  onAddSubmit,
  onEditSubmit,
  onClearEditImage,
  isAddPending,
  isEditPending,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4">
      <div className="flex w-full max-w-lg max-h-[85vh] flex-col rounded-3xl border border-white/10 bg-[#111115] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
        <div className="flex items-start justify-between border-b border-white/10 px-6 pb-4 pt-4">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-[#f3c34b]">
              {editingProduct ? "Edit product" : "Add product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#f4f1e9] transition hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="modal-scroll flex-1 overflow-y-auto px-6 pb-6 pt-4">
          {!editingProduct ? (
            <form
              className="space-y-4"
              onSubmit={addForm.handleSubmit(onAddSubmit)}
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#f3c34b] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#1a1a1f]"
                  {...addForm.register("image")}
                />
                <p className="text-xs text-[#a49c90]">JPG/PNG/WebP, max 10MB.</p>
                {addForm.formState.errors.image ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.image.message}
                  </p>
                ) : null}
                {addPreview ? (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 p-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/50">
                      <Image
                        src={addPreview}
                        alt="Preview"
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-[#c9c2b8]">Preview</span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Title
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...addForm.register("title")}
                  placeholder="Product title"
                />
                {addForm.formState.errors.title ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.title.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...addForm.register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {addForm.formState.errors.price ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.price.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Category
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...addForm.register("category")}
                  placeholder="Category"
                />
                {addForm.formState.errors.category ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.category.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...addForm.register("description")}
                  placeholder="Description"
                />
                {addForm.formState.errors.description ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.description.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...addForm.register("rating", { valueAsNumber: true })}
                  placeholder="0 - 5"
                />
                {addForm.formState.errors.rating ? (
                  <p className="text-xs text-rose-500">
                    {addForm.formState.errors.rating.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isAddPending}
                className="w-full cursor-pointer rounded-full bg-[#f3c34b] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1f] transition hover:bg-[#ffd467] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAddPending ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1a1a1f] border-t-transparent" />
                    Adding...
                  </span>
                ) : (
                  "Add product"
                )}
              </button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={editForm.handleSubmit(onEditSubmit)}
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Image
                </label>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/50 p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/50">
                    <Image
                      src={editPreview ?? editingProduct.thumbnail}
                      alt={editingProduct.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized={Boolean(editPreview)}
                    />
                    {editPreview ? (
                      <button
                        type="button"
                        onClick={onClearEditImage}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                  <div className="text-sm text-[#c9c2b8]">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#a49c90]">
                      {editPreview ? "New image" : "Current image"}
                    </p>
                    <p className="text-sm text-[#f4f1e9]">
                      {editingProduct.title}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#f3c34b] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#1a1a1f]"
                  {...editForm.register("image")}
                />
                <p className="text-xs text-[#a49c90]">JPG/PNG/WebP, max 10MB.</p>
                {editForm.formState.errors.image ? (
                  <p className="text-xs text-rose-500">
                    {editForm.formState.errors.image.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Title
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...editForm.register("title")}
                  placeholder="Product title"
                />
                {editForm.formState.errors.title ? (
                  <p className="text-xs text-rose-500">
                    {editForm.formState.errors.title.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...editForm.register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {editForm.formState.errors.price ? (
                  <p className="text-xs text-rose-500">
                    {editForm.formState.errors.price.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Category
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...editForm.register("category")}
                  placeholder="Category"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...editForm.register("description")}
                  placeholder="Description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a49c90]">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#f4f1e9] outline-none"
                  {...editForm.register("rating", { valueAsNumber: true })}
                  placeholder="0 - 5"
                />
                {editForm.formState.errors.rating ? (
                  <p className="text-xs text-rose-500">
                    {editForm.formState.errors.rating.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isEditPending}
                className="w-full cursor-pointer rounded-full bg-[#f3c34b] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1f] transition hover:bg-[#ffd467] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isEditPending ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1a1a1f] border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  "Save changes"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
