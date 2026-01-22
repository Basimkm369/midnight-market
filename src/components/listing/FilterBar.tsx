import Link from "next/link";
import Dropdown from "@/components/listing/Dropdown";
import type { DropdownOption, SortOption } from "@/lib/productListing";
import { formatCategoryLabel } from "@/lib/productListing";

type FilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  category: string;
  categoryOptions: DropdownOption[];
  categoryList: string[];
  sortBy: SortOption;
  sortOptions: DropdownOption[];
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  disableCategory: boolean;
};

export default function FilterBar({
  search,
  onSearchChange,
  onClearSearch,
  category,
  categoryOptions,
  categoryList,
  sortBy,
  sortOptions,
  onCategoryChange,
  onSortChange,
  disableCategory,
}: FilterBarProps) {
  return (
    <div className="sticky top-3 z-[300] -mx-2 flex flex-col gap-4 border-y border-white/10 bg-black/80 px-2 py-4 backdrop-blur sm:rounded-2xl sm:border sm:px-4 sm:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c34b]">
            Search
          </span>
          <input
            className="w-full border-0 bg-transparent text-sm text-[#f4f1e9] outline-none placeholder:text-[#a49c90]"
            placeholder="Search by product name, brand, or category..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search.length > 0 ? (
            <button
              type="button"
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f4f1e9] transition hover:bg-white/20"
              onClick={onClearSearch}
            >
              Clear
            </button>
          ) : null}
        </label>

        <Dropdown
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          disabled={disableCategory}
          maxHeight={220}
        />

        <Dropdown
          label="Sort"
          value={sortBy}
          options={sortOptions}
          onChange={(value) => onSortChange(value as SortOption)}
          maxHeight={220}
        />
      </div>

      <div className="chip-scroll flex items-center gap-2 overflow-x-auto pb-2 text-sm text-[#c9c2b8]">
        <Link
          href="/"
          className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c34b] transition hover:bg-white/10"
        >
          All
        </Link>
        {categoryList.map((item) => (
          <Link
            key={item}
            href={`/category/${item}`}
            className="whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold text-[#f4f1e9] transition hover:border-[#f3c34b]/60 hover:text-[#f3c34b]"
          >
            {formatCategoryLabel(item)}
          </Link>
        ))}
      </div>
    </div>
  );
}
