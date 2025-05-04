import React, { useState } from 'react';

interface SupportFormProps {
  styles: any;
}

const SupportForm: React.FC<SupportFormProps> = ({ styles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'technical',
    message: '',
    file: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      email: '',
      topic: 'technical',
      message: '',
      file: null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <form id="support-form" onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Ваше имя</label>
        <input 
          type="text" 
          id="name" 
          required 
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Электронная почта</label>
        <input 
          type="email" 
          id="email" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="topic">Тема обращения</label>
        <select 
          id="topic" 
          value={formData.topic}
          onChange={handleChange}
        >
          <option value="technical">Технические проблемы</option>
          <option value="account">Вопросы по аккаунту</option>
          <option value="billing">Вопросы по оплате</option>
          <option value="other">Другое</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">Сообщение</label>
        <textarea 
          id="message" 
          required 
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="file">Приложить файл (необязательно)</label>
        <input 
          type="file" 
          id="file" 
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" className={styles.btn}>Отправить запрос</button>
    </form>
  );
};

export default SupportForm;