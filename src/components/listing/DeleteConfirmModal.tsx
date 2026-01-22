import type { Product } from "@/types/product";

type DeleteConfirmModalProps = {
  product: Product;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  product,
  isPending,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121217] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
              Delete product
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f4f1e9]">
              {product.title}
            </h2>
            <p className="mt-2 text-sm text-[#c9c2b8]">
              This will simulate a delete and remove it from the list.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#f4f1e9] transition hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#f4f1e9] transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
