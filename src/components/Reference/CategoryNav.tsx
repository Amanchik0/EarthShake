import React from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <nav className="category-nav">
      {categories.map(category => (
        <div 
          key={category}
          className={`category-item ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </div>
      ))}
    </nav>
  );
};

export default CategoryNav;