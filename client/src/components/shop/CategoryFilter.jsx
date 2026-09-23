import React from 'react';

export function CategoryFilter({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-earth-800 text-cream-50 shadow-soft'
            : 'bg-cream-100/90 text-earth-700 hover:bg-cream-200 border border-cream-200'
        }`}
      >
        Todos os Produtos
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-earth-800 text-cream-50 shadow-soft'
                : 'bg-cream-100/90 text-earth-700 hover:bg-cream-200 border border-cream-200'
            }`}
          >
            <span>{cat.name}</span>
            {cat.product_count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-earth-700 text-cream-200' : 'bg-cream-200 text-earth-600'
                }`}
              >
                {cat.product_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
