import React from 'react';
import { ChecklistItem } from '../../types/types';

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ title, items, onToggle }) => {
  return (
    <div className="sidebar-card">
      <div className="sidebar-title">{title}</div>
      <div className="checklist">
        {items.map(item => (
          <div key={item.id} className="checklist-item">
            <div 
              className="checklist-checkbox" 
              onClick={() => onToggle(item.id)}
            >
              {item.checked ? '✓' : ''}
            </div>
            <div className="checklist-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;