import { useEffect, useRef, useState } from "react";
import type { DropdownOption } from "@/lib/productListing";

type DropdownProps = {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  maxHeight?: number;
};

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  disabled,
  maxHeight = 220,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-[180px]">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-[#f4f1e9] shadow-sm transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c34b]">
          {label}
        </span>
        <span className="flex flex-1 items-center justify-between gap-2 text-sm">
          <span className="truncate">{selected?.label ?? "Select"}</span>
          <span className="text-[#a49c90]">▾</span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 z-[9999] mt-2 w-full rounded-2xl border border-white/10 bg-[#121217] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <ul
            className="dropdown-scroll space-y-1 overflow-y-auto pr-1 text-sm text-[#f4f1e9] overscroll-contain"
            style={{ maxHeight }}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                    option.value === value
                      ? "bg-[#f3c34b] text-[#1a1a1f]"
                      : "text-[#f4f1e9] hover:bg-white/10"
                  } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
