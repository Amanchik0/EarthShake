// modals/EventModal.tsx
import React, { useState } from 'react';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: any) => void;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isPrivate: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setEventData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...eventData,
      date: new Date(eventData.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'active',
      participants: 0
    });
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Добавить новое событие</div>
          <div className="close-modal" onClick={onClose}>×</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Название события</label>
          <input 
            type="text" 
            id="title" 
            value={eventData.title} 
            onChange={handleChange} 
            required 
          />
          
          <label htmlFor="description">Описание</label>
          <textarea 
            id="description" 
            value={eventData.description} 
            onChange={handleChange} 
            required 
          />
          
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="date">Дата</label>
              <input 
                type="date" 
                id="date" 
                value={eventData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-col">
              <label htmlFor="time">Время</label>
              <input 
                type="time" 
                id="time" 
                value={eventData.time} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <label htmlFor="location">Место проведения</label>
          <input 
            type="text" 
            id="location" 
            value={eventData.location} 
            onChange={handleChange} 
            required 
          />
          
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="isPrivate" 
              checked={eventData.isPrivate} 
              onChange={handleChange} 
            />
            <label htmlFor="isPrivate">Приватное событие (только для участников сообщества)</label>
          </div>
          
          <div className="button-group">
            <button type="button" className="secondary" onClick={onClose}>Отменить</button>
            <button type="submit">Создать событие</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;