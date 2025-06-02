import { TabType } from '../../types/adminTypes';

interface NavMenuProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NavMenu = ({ activeTab, onTabChange }: NavMenuProps) => {
  const menuItems = [
    { tab: 'users', icon: '👥', label: 'Пользователи' },
    { tab: 'events', icon: '🗓️', label: 'События' },
    { tab: 'communities', icon: '👪', label: 'Сообщества' },
    { icon: '⚙️', label: 'Настройки' },
    { icon: '', label: 'Статистика' },
  ];

  return (
    <ul className="nav-menu">
      {menuItems.map((item, index) => (
        <li key={index} className="nav-item">
          <a 
            href="#" 
            className={`nav-link ${'tab' in item && activeTab === item.tab ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if ('tab' in item) {
                onTabChange(item.tab as TabType);
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;