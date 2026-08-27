import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { FilterOptions, ProductCategory } from '../types';

interface FilterModalProps {
  currentFilters: FilterOptions;
  categories: ProductCategory[];
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  currentFilters,
  categories,
  onClose,
  onApply,
  onReset,
}) => {
  const [category, setCategory] = useState<ProductCategory>(currentFilters.category);
  const [maxPrice, setMaxPrice] = useState<number>(currentFilters.maxPrice);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>(currentFilters.sortBy);
  const [inStockOnly, setInStockOnly] = useState<boolean>(currentFilters.inStockOnly);

  const handleApply = () => {
    onApply({
      category,
      minPrice: 0,
      maxPrice,
      sortBy,
      inStockOnly,
    });
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-black">Filtres et tri</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full"
            aria-label="Fermer"
            id="filter-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Body */}
        <div className="py-4 space-y-6 flex-1">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2.5">
              Catégorie
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">
                Prix maximum
              </label>
              <span className="text-sm font-bold text-blue-600">
                {maxPrice.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-medium">
              <span>200 F</span>
              <span>5 000 F</span>
              <span>10 000 F</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2.5">
              Trier par
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {[
                { id: 'popular', label: 'Populaires d\'abord' },
                { id: 'price-asc', label: 'Prix croissant' },
                { id: 'price-desc', label: 'Prix décroissant' },
                { id: 'rating', label: 'Meilleurs avis' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortBy(option.id as FilterOptions['sortBy'])}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    sortBy === option.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-semibold'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.id && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="flex items-center justify-between py-2 border-t border-neutral-100">
            <div>
              <span className="block text-sm font-semibold text-black">
                Articles en stock uniquement
              </span>
              <span className="block text-xs text-neutral-500">
                Masquer les articles momentanément indisponibles
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleReset}
            className="w-1/3 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            id="apply-filter-btn"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};
