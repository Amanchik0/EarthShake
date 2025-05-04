import { TabType } from '../../types/adminTypes';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'users', label: 'Пользователи', count: 254 },
    { id: 'events', label: 'События', count: 45 },
    { id: 'communities', label: 'Сообщества', count: 32 },
  ];

  return (
    <div className="tab-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id as TabType)}
          >
            <div className="badge">
              <span>{tab.label}</span>
              <span className="badge-count">{tab.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;