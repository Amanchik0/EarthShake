import React, { useState } from 'react';
import PageHeader from '../../components/EventEdit/PageHeader';
import FormSection from '../../components/EventEdit/FormSection';
import FormButtons from '../../components/EventEdit/FormButtons';
import FormRow from '../../components/EventEdit/FormRow';
import EventPhoto from '../../components/EventEdit/EventPhoto';
import FormGroup from '../../components/EventEdit/FormGroup';
import styles from './EventEditPage.module.css';

const EventEditPage: React.FC = () => {
  const [formData, setFormData] = useState({
    eventName: 'Конференция по дизайну',
    description: 'Ежегодная конференция для дизайнеров и разработчиков интерфейсов. В программе: выступления экспертов, мастер-классы и нетворкинг.',
    eventType: 'conference',
    eventCategory: 'design',
    eventDate: '2025-05-15',
    eventTime: '14:00',
    eventEndTime: '18:00',
    location: 'Конференц-центр «Технополис», улица Ленина, 45',
    city: 'Москва',
    country: 'Россия',
    maxParticipants: '200',
    contactEmail: 'info@design-conference.ru'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <div className={styles.eventEditPage}>
      <div className={styles.mainContainer}>
        <PageHeader 
          title="Редактирование события" 
          subtitle="Заполните все поля для обновления информации о событии" 
        />

        <div className={styles.eventFormContainer}>
          <form className="event-form" onSubmit={handleSubmit}>
            <FormSection title="Основная информация">
              <FormGroup fullWidth>
                <label htmlFor="eventName">Название события</label>
                <input 
                  type="text" 
                  id="eventName" 
                  name="eventName" 
                  value={formData.eventName} 
                  onChange={handleChange}
                  required 
                />
                <div className={styles.hints}>Укажите краткое и информативное название</div>
              </FormGroup>
              
              <EventPhoto />
              
              <FormGroup fullWidth>
                <label htmlFor="description">Описание</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={5} 
                  value={formData.description} 
                  onChange={handleChange}
                  required 
                />
                <div className={styles.hints}>Подробно опишите событие: что будет происходить, для кого оно предназначено</div>
              </FormGroup>
            </FormSection>

            <FormSection title="Детали события">
              <FormRow>
                <FormGroup>
                  <label htmlFor="eventType">Тип события</label>
                  <select 
                    id="eventType" 
                    name="eventType" 
                    value={formData.eventType} 
                    onChange={handleChange}
                  >
                    <option value="conference">Конференция</option>
                    <option value="meetup">Митап</option>
                    <option value="workshop">Мастер-класс</option>
                    <option value="exhibition">Выставка</option>
                    <option value="concert">Концерт</option>
                    <option value="party">Вечеринка</option>
                    <option value="other">Другое</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="eventCategory">Категория</label>
                  <select 
                    id="eventCategory" 
                    name="eventCategory" 
                    value={formData.eventCategory} 
                    onChange={handleChange}
                  >
                    <option value="design">Дизайн</option>
                    <option value="technology">Технологии</option>
                    <option value="business">Бизнес</option>
                    <option value="education">Образование</option>
                    <option value="entertainment">Развлечения</option>
                    <option value="other">Другое</option>
                  </select>
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <label htmlFor="eventDate">Дата</label>
                  <input 
                    type="date" 
                    id="eventDate" 
                    name="eventDate" 
                    value={formData.eventDate} 
                    onChange={handleChange}
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="eventTime">Время начала</label>
                  <input 
                    type="time" 
                    id="eventTime" 
                    name="eventTime" 
                    value={formData.eventTime} 
                    onChange={handleChange}
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="eventEndTime">Время окончания</label>
                  <input 
                    type="time" 
                    id="eventEndTime" 
                    name="eventEndTime" 
                    value={formData.eventEndTime} 
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormSection title="Локация">
              <FormGroup fullWidth>
                <label htmlFor="location">Адрес</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
            </FormSection>
            
            <FormSection title="Дополнительная информация">
              <FormRow>
                <FormGroup>
                  <label htmlFor="contactEmail">Контактный email</label>
                  <input 
                    type="text" 
                    id="contactEmail" 
                    name="contactEmail" 
                    value={formData.contactEmail} 
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormButtons
              onCancel={() => console.log('Cancel clicked')}
              onDelete={() => console.log('Delete clicked')}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage;