import React from 'react';

const FooterNavigation: React.FC = () => {
  return (
    <div className="footer-navigation">
      <button className="nav-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Предыдущая статья
      </button>
      
      <button className="nav-button next">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        Следующая статья
      </button>
    </div>
  );
};

export default FooterNavigation;