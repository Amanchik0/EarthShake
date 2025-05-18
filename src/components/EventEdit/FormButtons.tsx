import React from 'react';
import styles from '../../features/Events/EventEditPage/EventEditPage.module.css';


interface FormButtonsProps {
  onCancel: () => void;
  onDelete: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ onCancel, onDelete }) => {
  return (
    <div className={styles.buttonsContainer}>
      <div className={styles.buttonsLeft}>
        <button 
          type="button" 
          className={styles.cancelBtn} 
          onClick={onCancel}
        >
          Отмена
        </button>
        <button 
          type="button" 
          className={styles.deleteBtn} 
          onClick={onDelete}
        >
          Удалить событие
        </button>
      </div>
      <div className={styles.buttonsRight}>
        <button type="submit" className={styles.saveBtn}>
          Сохранить событие
        </button>
      </div>
    </div>
  );
};

export default FormButtons;