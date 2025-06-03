import React from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  styles: any;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategory, onCategoryClick, styles }) => {
  return (
    <div className={styles.categoryNav}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`${styles.categoryItem} ${activeCategory === category ? styles.active : ''}`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryNav;