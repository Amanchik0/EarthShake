// tabs/ProfileTab.tsx
import React, { useState } from 'react';

interface ProfileTabProps {
  onSave: (message: string) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onSave }) => {
  const [communityData, setCommunityData] = useState({
    name: "Творческое объединение 'Розовая гармония'",
    url: "pink-harmony",
    description: "Мы объединяем творческих людей, интересующихся искусством, музыкой и танцами. Наше сообщество проводит мастер-классы, встречи и тематические вечера для всех желающих.",
    category: "Искусство и творчество",
    privacy: "Открытое сообщество",
    contacts: "Email: info@pink-harmony.com\nТелефон: +7 (999) 123-45-67\nАдрес: г. Москва, ул. Художников, д. 15"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setCommunityData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // Здесь будет логика сохранения
    onSave('Изменения успешно сохранены!');
  };

  return (
    <div className="profile-section">
      <div className="section-title">Редактирование профиля</div>
      <div className="profile-header">
        <div className="profile-image-container">
          <img src="/api/placeholder/150/150" alt="Логотип сообщества" className="profile-image" />
          <div className="image-upload" title="Загрузить новое фото">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>
        <div className="profile-info">
          <label htmlFor="name">Название сообщества</label>
          <input 
            type="text" 
            id="name" 
            value={communityData.name} 
            onChange={handleChange}
          />
          
          <label htmlFor="url">URL сообщества</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px', color: 'var(--gray-medium)' }}>harmony-club.ru/</span>
            <input 
              type="text" 
              id="url" 
              value={communityData.url} 
              onChange={handleChange}
              style={{ flexGrow: 1 }}
            />
          </div>
        </div>
      </div>
      
      <label htmlFor="description">Описание сообщества</label>
      <textarea 
        id="description" 
        value={communityData.description} 
        onChange={handleChange}
      />
      
      <div className="form-row">
        <div className="form-col">
          <label htmlFor="category">Категория</label>
          <select 
            id="category" 
            value={communityData.category} 
            onChange={handleChange}
          >
            <option>Искусство и творчество</option>
            <option>Спорт и активный отдых</option>
            <option>Технологии и IT</option>
            <option>Образование</option>
            <option>Другое</option>
          </select>
        </div>
        <div className="form-col">
          <label htmlFor="privacy">Приватность</label>
          <select 
            id="privacy" 
            value={communityData.privacy} 
            onChange={handleChange}
          >
            <option>Открытое сообщество</option>
            <option>Закрытое сообщество</option>
            <option>Приватное сообщество</option>
          </select>
        </div>
      </div>
      
      <label htmlFor="contacts">Контактная информация</label>
      <textarea 
        id="contacts" 
        value={communityData.contacts} 
        onChange={handleChange}
      />
      
      <div className="button-group">
        <button className="secondary">Отменить</button>
        <button onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  );
};

export default ProfileTab;