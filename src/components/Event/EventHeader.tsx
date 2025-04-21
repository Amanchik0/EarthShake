import React from 'react';

interface EventHeaderProps {
  onBack: () => void;
  tag: 'regular' | 'emergency';
}

const EventHeader: React.FC<EventHeaderProps> = ({ onBack, tag }) => {
  return (
    <header>
      <button className="back-button" onClick={onBack}>
        ← Назад к событиям
      </button>
      <div className={`event-tag ${tag === 'emergency' ? 'emergency-tag' : ''}`}>
        {tag === 'emergency' ? 'ЧС' : 'Обычное событие'}
      </div>
    </header>
  );
};

export default EventHeader;