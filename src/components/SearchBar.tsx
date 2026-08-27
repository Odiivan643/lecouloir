import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  onSearchClick: () => void;
  onFilterClick: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  activeFilterCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchClick,
  onFilterClick,
  searchValue = '',
  onSearchChange,
  activeFilterCount = 0,
}) => {
  return (
    <div className="flex items-center gap-2.5 w-full">
      {/* Search Input Box */}
      <div
        onClick={onSearchClick}
        className="flex-1 flex items-center bg-[#dbe8fd] hover:bg-[#d0e0fb] transition-colors rounded-xl px-3.5 py-3 cursor-pointer shadow-xs border border-blue-200/50"
        id="search-bar-container"
      >
        <Search className="w-5 h-5 text-blue-500 mr-2.5 shrink-0 stroke-[2]" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Rechercher ..."
          className="w-full bg-transparent border-none outline-hidden text-sm text-neutral-800 placeholder:text-neutral-500 font-normal cursor-pointer"
          readOnly={!onSearchChange}
          id="search-input-field"
        />
      </div>

      {/* Blue Filter Button */}
      <button
        onClick={onFilterClick}
        className="relative bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white p-3.5 rounded-xl flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
        aria-label="Filtrer les produits"
        id="filter-toggle-btn"
      >
        <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};
