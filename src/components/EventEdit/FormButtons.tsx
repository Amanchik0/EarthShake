import React from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';

interface FormButtonsProps {
  onCancel: () => void;
  onDelete: () => void;
  loading?: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ 
  onCancel, 
  onDelete, 
  loading = false 
}) => {
  return (
    <div className={styles.buttonsContainer}>
      <div className={styles.buttonsLeft}>
        <button 
          type="button" 
          className={styles.cancelBtn} 
          onClick={onCancel}
          disabled={loading}
        >
          Отмена
        </button>
        <button 
          type="button" 
          className={styles.deleteBtn} 
          onClick={onDelete}
          disabled={loading}
        >
          {loading ? 'Удаление...' : 'Удалить событие'}
        </button>
      </div>
      <div className={styles.buttonsRight}>
        <button 
          type="submit" 
          className={styles.saveBtn}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить событие'}
        </button>
      </div>
    </div>
  );
};

export default FormButtons;