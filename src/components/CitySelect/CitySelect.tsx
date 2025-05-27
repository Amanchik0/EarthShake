import React, { useState, useRef, useEffect } from 'react';
import { kazakhstanCities, searchCities, City } from '../../data/cities';
import styles from './CitySelect.module.css';

interface CitySelectProps {
  value: string;
  onChange: (cityName: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  placeholder = "Выберите город",
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(kazakhstanCities);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Обновляем список городов при изменении поискового запроса
  useEffect(() => {
    const filtered = searchCities(searchQuery);
    setFilteredCities(filtered);
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Закрываем список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Если пользователь очистил поле, сбрасываем значение
    if (!query) {
      onChange('');
    }
  };

  const handleCitySelect = (city: City) => {
    onChange(city.name);
    setIsOpen(false);
    setSearchQuery('');
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
          handleCitySelect(filteredCities[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Скроллим к выделенному элементу
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const displayValue = isOpen ? searchQuery : value;

  return (
    <div className={styles.citySelect} ref={containerRef}>
      <div className={styles.inputWrapper}>
        {/* <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg> */}
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          autoComplete="off"
          required={required}
        />
        <button
          type="button"
          className={styles.dropdownToggle}
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={-1}
        >
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul className={styles.dropdown} ref={listRef}>
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <li
                key={city.id}
                className={`${styles.dropdownItem} ${
                  index === highlightedIndex ? styles.highlighted : ''
                }`}
                onClick={() => handleCitySelect(city)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className={styles.cityName}>{city.name}</div>
                <div className={styles.cityRegion}>{city.region}</div>
              </li>
            ))
          ) : (
            <li className={styles.noResults}>
              Город не найден
            </li>
          )}
        </ul>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default CitySelect;