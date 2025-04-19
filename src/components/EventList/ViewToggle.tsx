import React from 'react';

type ViewMode = 'list' | 'split' | 'map';

interface ViewToggleProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentMode, onChange }) => {
  return (
    <div className="view-toggle">
      <button 
        className={`toggle-button ${currentMode === 'list' ? 'active' : ''}`} 
        onClick={() => onChange('list')}
      >
        Список
      </button>
      <button 
        className={`toggle-button ${currentMode === 'split' ? 'active' : ''}`} 
        onClick={() => onChange('split')}
      >
        Список + Карта
      </button>
      <button 
        className={`toggle-button ${currentMode === 'map' ? 'active' : ''}`} 
        onClick={() => onChange('map')}
      >
        Карта
      </button>
    </div>
  );
};

export default ViewToggle;