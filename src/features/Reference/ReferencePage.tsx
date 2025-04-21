import React, { useState, useEffect } from 'react';
import Header from '../../components/Reference/Header';
import CategoryNav from '../../components/Reference/CategoryNav';
import Sidebar from '../../components/Reference/Sidebar';
import ContentHeader from '../../components/Reference/ContentHeader';
import ReferenceCard from '../../components/Reference/ReferenceCard';
import ReferenceSection from '../../components/Reference/ReferenceSection';
import RelatedArticles from '../../components/Reference/RelatedArticles';
import FooterNavigation from '../../components/Reference/FooterNavigation';
import InfoBox from '../../components/Reference/InfoBox';
import './Reference.css';

// Define content structure for easier management
interface ContentItem {
  id: string;
  category: string;
  section: string;
  title: string;
  updateDate: string;
  content: React.ReactNode;
  relatedArticles: Array<{ title: string; meta: string }>;
}

const ReferencePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Все категории');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Общая информация');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSidebarItems, setFilteredSidebarItems] = useState<Array<{ name: string; count: number }>>([]); 
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);

  const categories = [
    'Все категории',
    'Инструкции',
    'Справочная информация',
    'Часто задаваемые вопросы',

  ];

  const allSidebarItems = [
    { name: 'Общая информация', count: 12, category: 'Все категории' },
    { name: 'Использование платформы', count: 8, category: 'Инструкции' },
    { name: 'Участие в событиях', count: 15, category: 'Справочная информация' },
    { name: 'Создание сообществ', count: 6, category: 'Инструкции' },
    { name: 'Безопасность', count: 9, category: 'Правила' },
    { name: 'Правила поведения', count: 7, category: 'Правила' },
    { name: 'Технические вопросы', count: 14, category: 'Часто задаваемые вопросы' },
    { name: 'Контакты и поддержка', count: 3, category: 'Справочная информация' }
  ];

  const popularTopics = [
    'Как создать событие',
    'Правила участия в ЧС',
    'Регистрация сообщества',
    'Решение технических проблем',
    'Конфиденциальность данных'
  ];

  // Example content data
  const contentData: ContentItem[] = [
    {
      id: '1',
      category: 'Все категории',
      section: 'Общая информация',
      title: 'Общая информация о платформе',
      updateDate: '15 апреля 2025',
      content: (
        <>
          <ReferenceCard 
            title="Основные понятия платформы" 
            content={
              <>
                <p>Данный справочный материал содержит основные термины и понятия, используемые на нашей платформе. Ознакомление с этой информацией поможет вам лучше ориентироваться в функциональности и особенностях сервиса.</p>
                
                <ReferenceSection 
                  title="Ключевые термины" 
                  content={
                    <table className="reference-table">
                      <thead>
                        <tr>
                          <th>Термин</th>
                          <th>Определение</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Событие</strong></td>
                          <td>Мероприятие, организованное пользователем или сообществом, которое имеет дату, время, местоположение и описание.</td>
                        </tr>
                        <tr>
                          <td><strong>Сообщество</strong></td>
                          <td>Объединение пользователей по интересам, которое может организовывать события и привлекать участников.</td>
                        </tr>
                        <tr>
                          <td><strong>ЧС событие</strong></td>
                          <td>Событие чрезвычайного характера, требующее особого внимания и участия.</td>
                        </tr>
                        <tr>
                          <td><strong>Участник</strong></td>
                          <td>Пользователь, присоединившийся к событию или сообществу.</td>
                        </tr>
                        <tr>
                          <td><strong>Администратор</strong></td>
                          <td>Пользователь с расширенными правами управления сообществом или событием.</td>
                        </tr>
                      </tbody>
                    </table>
                  } 
                />
                
                <ReferenceSection 
                  title="Типы событий" 
                  content={
                    <ul className="reference-list">
                      <li><strong>Обычные события</strong> - регулярные мероприятия, организуемые пользователями или сообществами</li>
                      <li><strong>ЧС события</strong> - события чрезвычайного характера, требующие особого внимания</li>
                      <li><strong>Частные события</strong> - мероприятия с ограниченным доступом</li>
                      <li><strong>Публичные события</strong> - открытые для всех мероприятия</li>
                      <li><strong>Онлайн события</strong> - мероприятия, проводимые в виртуальном формате</li>
                    </ul>
                  } 
                />
                
                <InfoBox 
                  title="Важно знать" 
                  content="Все пользователи должны соблюдать правила платформы при создании событий и участии в них. Нарушение правил может привести к ограничению доступа к функциям сервиса." 
                />
                
                <ReferenceSection 
                  title="Роли пользователей" 
                  content={
                    <>
                      <p>На платформе существуют различные роли пользователей, определяющие их возможности и уровень доступа:</p>
                      <ul className="reference-list">
                        <li><strong>Обычный пользователь</strong> - может участвовать в событиях и присоединяться к сообществам</li>
                        <li><strong>Организатор</strong> - может создавать и управлять событиями</li>
                        <li><strong>Администратор сообщества</strong> - управляет сообществом и его контентом</li>
                        <li><strong>Модератор</strong> - следит за соблюдением правил и помогает в управлении</li>
                        <li><strong>Создатель сообщества</strong> - имеет полный контроль над сообществом</li>
                      </ul>
                    </>
                  } 
                />
              </>
            } 
          />
        </>
      ),
      relatedArticles: [
        { title: 'Как создать событие', meta: 'Инструкция • 5 мин. чтения' },
        { title: 'Типы сообществ', meta: 'Справка • 3 мин. чтения' },
        { title: 'Правила участия в ЧС', meta: 'Правила • 7 мин. чтения' },
        { title: 'Права и обязанности', meta: 'Справка • 4 мин. чтения' }
      ]
    },
    {
      id: '2',
      category: 'Инструкции',
      section: 'Использование платформы',
      title: 'Руководство по использованию платформы',
      updateDate: '10 апреля 2025',
      content: (
        <>
          <ReferenceCard
            title="Начало работы с платформой"
            content={
              <>
                <p>В данном разделе представлены основные инструкции по работе с платформой для новых пользователей.</p>
                
                <ReferenceSection
                  title="Регистрация и вход"
                  content={
                    <ol className="reference-list">
                      <li>Перейдите на главную страницу платформы</li>
                      <li>Нажмите кнопку "Регистрация" в правом верхнем углу</li>
                      <li>Заполните необходимые поля формы</li>
                      <li>Подтвердите регистрацию по email</li>
                      <li>Войдите в систему, используя созданные учетные данные</li>
                    </ol>
                  }
                />
                
                <InfoBox
                  title="Совет"
                  content="Рекомендуем использовать надежный пароль, содержащий не менее 8 символов, включая буквы разного регистра, цифры и специальные символы."
                />
              </>
            }
          />
        </>
      ),
      relatedArticles: [
        { title: 'Настройка профиля', meta: 'Инструкция • 3 мин. чтения' },
        { title: 'Поиск по платформе', meta: 'Справка • 2 мин. чтения' },
        { title: 'Управление уведомлениями', meta: 'Инструкция • 4 мин. чтения' }
      ]
    }
    // Add more content items as needed
  ];

  // Filter sidebar items based on active category
  useEffect(() => {
    const filtered = activeCategory === 'Все категории'
      ? allSidebarItems
      : allSidebarItems.filter(item => item.category === activeCategory || item.category === 'Все категории');
    
    setFilteredSidebarItems(filtered);
    
    // If current sidebar item isn't in the filtered list, reset to first item
    if (!filtered.some(item => item.name === activeSidebarItem)) {
      setActiveSidebarItem(filtered[0]?.name || '');
    }
  }, [activeCategory]);

  // Update content based on active sidebar item
  useEffect(() => {
    const content = contentData.find(item => 
      item.section === activeSidebarItem && 
      (item.category === activeCategory || activeCategory === 'Все категории')
    );
    
    if (content) {
      setCurrentContent(content);
    } else if (contentData.length > 0) {
      // Fallback to first content if no match
      setCurrentContent(contentData[0]);
    }
  }, [activeSidebarItem, activeCategory]);

  // Handle search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement search logic here
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Handle sidebar item click
  const handleSidebarItemClick = (item: string) => {
    setActiveSidebarItem(item);
  };

  return (
    <div className="container">
      <Header
        title="Справочник" 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />
      
      <CategoryNav 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryClick={handleCategoryClick} 
      />
      
      <div className="content-grid">
        <Sidebar 
          items={filteredSidebarItems} 
          activeItem={activeSidebarItem} 
          onItemClick={handleSidebarItemClick} 
          popularTopics={popularTopics} 
        />
        
        <main className="main-content">
          {currentContent && (
            <>
              <ContentHeader 
                title={currentContent.title} 
                updateDate={currentContent.updateDate} 
                articlesCount={
                  filteredSidebarItems.find(item => item.name === activeSidebarItem)?.count || 0
                } 
              />
              
              {currentContent.content}
              
              <RelatedArticles articles={currentContent.relatedArticles} />
            </>
          )}
          
          <FooterNavigation />
        </main>
      </div>
    </div>
  );
};

export default ReferencePage;