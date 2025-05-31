// tabs/ProfileTab.tsx
import React, { useState } from 'react';
import styles from '../../features/Community/CommunityEditPage/CommunityEditPage.module.css';


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
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>Редактирование профиля</div>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img src="/api/placeholder/150/150" alt="Логотип сообщества" className={styles.profileImage} />
          <div className={styles.imageUpload} title="Загрузить новое фото">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>
        <div className={styles.profileInfo}>
          <label htmlFor="name" className={styles.label}>Название сообщества</label>
          <input 
            type="text" 
            id="name" 
            value={communityData.name} 
            onChange={handleChange}
            className={styles.input}
          />
          
          <label htmlFor="url" className={styles.label}>URL сообщества</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px', color: 'var(--gray-medium)' }}>harmony-club.ru/</span>
            <input 
              type="text" 
              id="url" 
              value={communityData.url} 
              onChange={handleChange}
              style={{ flexGrow: 1 }}
              className={styles.input}
            />
          </div>
        </div>
      </div>
      
      <label htmlFor="description" className={styles.label}>Описание сообщества</label>
      <textarea 
        id="description" 
        value={communityData.description} 
        onChange={handleChange}
        className={styles.textarea}
      />
      
      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label htmlFor="category" className={styles.label}>Категория</label>
          <select 
            id="category" 
            value={communityData.category} 
            onChange={handleChange}
            className={styles.select}
          >
            <option>Искусство и творчество</option>
            <option>Спорт и активный отдых</option>
            <option>Технологии и IT</option>
            <option>Образование</option>
            <option>Другое</option>
          </select>
        </div>
        <div className={styles.formCol}>
          <label htmlFor="privacy" className={styles.label}>Приватность</label>
          <select 
            id="privacy" 
            value={communityData.privacy} 
            onChange={handleChange}
            className={styles.select}
          >
            <option>Открытое сообщество</option>
            <option>Закрытое сообщество</option>
            <option>Приватное сообщество</option>
          </select>
        </div>
      </div>
      
      <label htmlFor="contacts" className={styles.label}>Контактная информация</label>
      <textarea 
        id="contacts" 
        value={communityData.contacts} 
        onChange={handleChange}
        className={styles.textarea}
      />
      
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.buttonSecondary}`}>Отменить</button>
        <button className={styles.button} onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  );
};

export default ProfileTab;