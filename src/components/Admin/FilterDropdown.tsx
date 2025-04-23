import { useState } from 'react';
import { TabType } from '../../types/adminTypes';

const FilterDropdown = ({ tab }: { tab: TabType }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const getFilterOptions = () => {
    switch (tab) {
      case 'users':
        return [
          { id: 'withSubscription', label: 'С подпиской' },
          { id: 'withoutSubscription', label: 'Без подписки' },
          { id: 'activeUsers', label: 'Активные' },
          { id: 'blockedUsers', label: 'Заблокированные' }
        ];
      // Similar for other tabs
      default:
        return [];
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className="filter-button" onClick={toggleDropdown}>
        <span>Фильтр</span>
        <span>▼</span>
      </button>
      
      {isOpen && (
        <div className="filter-dropdown">
          {getFilterOptions().map(option => (
            <div key={option.id} className="filter-option">
              <input type="checkbox" className="filter-checkbox" id={option.id} />
              <label htmlFor={option.id}>{option.label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;