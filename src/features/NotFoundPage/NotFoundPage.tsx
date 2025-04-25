import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      <div className="error-container">
        <div className="error-code">404</div>
        <h1 className="error-title">Страница не найдена</h1>
        <p className="error-message">
          Упс! Кажется, вы заблудились. Страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="action-buttons">
          <a href="/" className="btn">На главную</a>
          <a href="/contact" className="btn btn-secondary">Связаться с нами</a>
        </div>
        
        <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
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