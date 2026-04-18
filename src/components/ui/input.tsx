import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  onClear?: () => void;
}

function Input({
  className,
  type,
  startIcon,
  onClear,
  value,
  onChange,
  ...props
}: InputProps) {
  const isSearch = type === "search";
  const showStartIcon = startIcon || (isSearch && <Search className="w-4 h-4" />);
  const showClear = (isSearch || onClear) && value && value.toString().length > 0;

  return (
    <div className="relative w-full flex items-center group">
      {showStartIcon && (
        <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 pointer-events-none">
          {showStartIcon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-full border bg-transparent px-4 py-1.5 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          showStartIcon ? "pl-11" : "",
          showClear ? "pr-11" : "",
          "focus-visible:border-blue-600 focus-visible:ring-blue-600/20 focus-visible:ring-[3px] focus:bg-white dark:focus:bg-zinc-900/50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          className,
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export { Input };
