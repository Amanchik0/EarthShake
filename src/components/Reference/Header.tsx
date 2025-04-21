import React from 'react';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ title, searchQuery, onSearchChange }) => {
  return (
    <header>
      <h1 className="page-title">{title}</h1>
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск по справочнику..." 
          value={searchQuery}
          onChange={onSearchChange}
        />
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </header>
  );
};

export default Header;