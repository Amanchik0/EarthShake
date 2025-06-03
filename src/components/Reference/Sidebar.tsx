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
  styles: any;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onItemClick, popularTopics, styles }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>
        <h2> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>

</h2>
        Разделы
      </div>
      <ul className={styles.sidebarList}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles.sidebarItem} ${activeItem === item.name ? styles.active : ''}`}
            onClick={() => onItemClick(item.name)}
          >
            {item.name}
            {item.count && <span className={styles.itemCount}>{item.count}</span>}
          </li>
        ))}
      </ul>
      
      <div className={styles.sidebarTitle} style={{ marginTop: '30px' }}>
        <h2> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg></h2>
        Популярные темы
      </div>
      <ul className={styles.sidebarList}>
        {popularTopics.map((topic, index) => (
          <li key={index} className={styles.sidebarItem}>
            {topic}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;