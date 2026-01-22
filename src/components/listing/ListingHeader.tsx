"use client";

type ListingHeaderProps = {
  title: string;
  subtitle: string;
  totalResults: number;
  loadedCount: number;
  onAdd: () => void;
};

export default function ListingHeader({
  title,
  subtitle,
  totalResults,
  loadedCount,
  onAdd,
}: ListingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c34b]">
          Midnight Market
        </p>
        <h1 className="text-3xl font-semibold text-[#f4f1e9] sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base text-[#c9c2b8]">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#c9c2b8] lg:justify-end">
        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
          Total results:{" "}
          <span className="font-semibold text-[#f4f1e9]">{totalResults}</span>
        </div>
        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
          Loaded:{" "}
          <span className="font-semibold text-[#f4f1e9]">{loadedCount}</span>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#f3c34b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a1a1f] shadow-[0_10px_30px_rgba(243,195,75,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ffd467] lg:ml-auto"
        onClick={onAdd}
      >
        + Add product
      </button>
    </div>
  );
}
