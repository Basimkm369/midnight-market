import { useEffect, useState } from "react";

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";
export type SortQuery = { sortBy: "price" | "title"; order: "asc" | "desc" };
export type DropdownOption = { value: string; label: string; disabled?: boolean };

export function mapSort(sortBy: SortOption): SortQuery {
  switch (sortBy) {
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "name-asc":
      return { sortBy: "title", order: "asc" };
    case "name-desc":
      return { sortBy: "title", order: "desc" };
    default:
      return { sortBy: "price", order: "asc" };
  }
}

export function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
