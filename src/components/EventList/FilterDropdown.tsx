import React from 'react';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="filter-item">
      <label className="filter-label">{label}</label>
      <select 
        className="filter-dropdown" 
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