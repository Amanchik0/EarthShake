import React from 'react';

interface FormButtonsProps {
  onCancel: () => void;
  onDelete: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ onCancel, onDelete }) => {
  return (
    <div className="buttons-container">
      <div className="buttons-left">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Отмена
        </button>
        <button type="button" className="delete-btn" onClick={onDelete}>
          Удалить событие
        </button>
      </div>
      <div className="buttons-right">

        <button type="submit" className="save-btn">
          Сохранить событие
        </button>
      </div>
    </div>
  );
};

export default FormButtons;