import React from 'react';
import { ProductCategory } from '../types';

interface CategoryTabsProps {
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-sm font-medium transition-all px-3.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-800 hover:text-blue-600 bg-transparent hover:bg-neutral-100/60'
              }`}
              id={`category-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
