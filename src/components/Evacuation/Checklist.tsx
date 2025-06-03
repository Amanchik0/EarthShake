import React from 'react';
import { ChecklistItem } from '../../types/types';
import styles from '../../features/Evacuation/EvacuationPage.module.css';

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ title, items, onToggle }) => {
  return (
    <div className={styles.sidebarCard}>
      <div className={styles.sidebarTitle}>{title}</div>
      <div>
        {items.map(item => (
          <div key={item.id} className={styles.checklistItem}>
            <div 
              className={styles.checklistCheckbox} 
              onClick={() => onToggle(item.id)}
            >
              {item.checked ? '✓' : ''}
            </div>
            <div className={styles.checklistText}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;