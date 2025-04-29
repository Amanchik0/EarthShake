import React from 'react';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  styles: any;
}

const Header: React.FC<HeaderProps> = ({ title, searchQuery, onSearchChange, styles }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.pageTitle}>
        {title}
      </h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={onSearchChange}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
    </header>
  );
};

export default Header;