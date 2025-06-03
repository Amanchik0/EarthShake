import React from 'react';
import styles from '../../features/Events/EventsListPage/EventsListPage.module.css';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className={styles.filterItem}>
      <label className={styles.filterLabel}>{label}</label>
      <select 
        className={styles.filterDropdown} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;