// modals/EventModal.tsx
import React, { useState } from 'react';
import styles from '../../features/Community/CommunityEditPage.module.css';

interface EventModalProps {
  onClose: () => void;
  onSave: (eventData: EventData) => void;
}

interface EventData {
  title: string;
  date: string;
  description: string;
  participants: number;
  status: 'active' | 'postponed';
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave }) => {
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    date: '',
    description: '',
    participants: 0,
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ 
      ...prev, 
      [name]: name === 'participants' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(eventData);
  };

  return (
    <div className={`${styles.modal} ${styles.modalActive}`}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Добавить новое событие</div>
          <span className={styles.closeModal} onClick={onClose}>&times;</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className={styles.label}>Название события</label>
          <input
            type="text"
            name="title"
            id="title"
            value={eventData.title}
            onChange={handleChange}
            className={styles.input}
            required
          />
          
          <label htmlFor="date" className={styles.label}>Дата проведения</label>
          <input
            type="date"
            name="date"
            id="date"
            value={eventData.date}
            onChange={handleChange}
            className={styles.input}
            required
          />
          
          <label htmlFor="description" className={styles.label}>Описание события</label>
          <textarea
            name="description"
            id="description"
            value={eventData.description}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
          
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="participants" className={styles.label}>Ожидаемое количество участников</label>
              <input
                type="number"
                name="participants"
                id="participants"
                value={eventData.participants}
                onChange={handleChange}
                className={styles.input}
                min="0"
              />
            </div>
            
            <div className={styles.formCol}>
              <label htmlFor="status" className={styles.label}>Статус события</label>
              <select
                name="status"
                id="status"
                value={eventData.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="active">Активное</option>
                <option value="postponed">Отложенное</option>
              </select>
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className={styles.button}
            >
              Сохранить событие
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
