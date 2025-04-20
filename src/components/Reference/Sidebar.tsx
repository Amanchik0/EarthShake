import React from 'react';

interface SidebarItem {
  name: string;
  count?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (item: string) => void;
  popularTopics: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onItemClick, popularTopics }) => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        Разделы
      </h2>
      <ul className="sidebar-list">
        {items.map(item => (
          <li 
            key={item.name}
            className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => onItemClick(item.name)}
          >
            {item.name}
            {item.count && <span className="item-count">{item.count}</span>}
          </li>
        ))}
      </ul>
      
      <h2 className="sidebar-title" style={{ marginTop: '30px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        Популярные темы
      </h2>
      <ul className="sidebar-list">
        {popularTopics.map(topic => (
          <li key={topic} className="sidebar-item">
            {topic}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;