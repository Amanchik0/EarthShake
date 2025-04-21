import React from 'react';
import styles from './ProfileForm.module.css';
import { ProfileFormData } from '../../types/types';

interface ProfileFormProps {
  initialData: ProfileFormData;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onCancel, onSubmit }) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
// TODO изменение п пароля номера и тд тп дополнитьь надо 

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">Имя</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName">Фамилия</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio">О себе</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttons}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.saveBtn}>
          Сохранить изменения
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;