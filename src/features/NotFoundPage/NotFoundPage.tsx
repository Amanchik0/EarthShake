import React from 'react';
import styles from './NotFoundPage.module.css';

interface NotFoundPageProps {
  styles?: any; // Опциональный пропс для совместимости с вашим подходом передачи стилей
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ styles: propStyles }) => {
  // Используем переданные стили или импортированные локально
  const s = propStyles || styles;
  
  return (
    <div className={s.notFoundPage}>
      <div className={s.floatingElements}>
        <div className={s.floatingElement}></div>
        <div className={s.floatingElement}></div>
        <div className={s.floatingElement}></div>
        <div className={s.floatingElement}></div>
      </div>
      
      <div className={s.errorContainer}>
        <div className={s.errorCode}>404</div>
        <h1 className={s.errorTitle}>Страница не найдена</h1>
        <p className={s.errorMessage}>
          Упс! Кажется, вы заблудились. Страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className={s.actionButtons}>
          <a href="/" className={s.btn}>На главную</a>
          <a href="/contact" className={`${s.btn} ${s.btnSecondary}`}>Связаться с нами</a>
        </div>
        
        <a href="#" className={s.backLink} onClick={(e) => { e.preventDefault(); window.history.back(); }}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ verticalAlign: 'middle', marginRight: '5px' }}
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Вернуться назад
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;