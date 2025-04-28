
import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
          activeCategory === null 
            ? 'bg-gradient-tech text-white' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
        onClick={() => onCategoryChange(null)}
      >
        Todos
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category 
              ? 'bg-gradient-tech text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
