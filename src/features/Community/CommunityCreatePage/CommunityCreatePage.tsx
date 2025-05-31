// CommunityCreatePage.tsx
import React, { useState } from 'react';
import { CommunityFormData, CommunityCategory } from '../../../types/community';
import { useCommunityApi } from '../../../hooks/useCommunityApi';
import CitySelect from '../../../components/CitySelect/CitySelect';
import styles from './CommunityCreatePage.module.css';
import { useNavigate } from 'react-router-dom';

const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    description: '',
    category: '',
    location: '',
    dopDescription: '',
    imageFiles: [],
    existingImageUrls: [],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({ ...prev, location: cityName }));
    // Clear location error if city is selected
    if (errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8090/api/media/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    return await response.text(); // API возвращает просто URL как строку
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
      setIsUploadingImages(true);

      try {
        const uploadPromises = files.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        setImageUrls(uploadedUrls);
        
        // Clear image error if upload successful
        if (errors.imageUrls) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.imageUrls;
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Error uploading images:', error);
        showNotificationMessage('Failed to upload images. Please try again.');
      } finally {
        setIsUploadingImages(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Community name is required';
    }
    
    if (!formData.description || formData.description.toString().trim() === '') {
      newErrors.description = 'Description is required';
    }
    
    if (imageUrls.length === 0) {
      newErrors.imageUrls = 'At least one community image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotificationMessage('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const username = localStorage.getItem('username');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!username || !accessToken) {
        throw new Error('User not authenticated');
      }

      const requestBody = {
        name: formData.name,
        description: formData.description,
        imageUrls: imageUrls,
        numberMembers: 1, // Создатель как первый участник
        type: formData.category || 'general', // API ожидает type, а не category
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewsCount: 0,
        content: formData.dopDescription || '', // API ожидает строку, не массив
        city: formData.location || 'Almaty',
        eventsCount: 0,
        postsCount: 0,
        users: [username], // Создатель как первый пользователь
        author: username
      };

      const response = await fetch('http://localhost:8090/api/community/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create community: ${errorText}`);
      }

      const createdCommunity = await response.json();
      console.log('Created community:', createdCommunity);
      showNotificationMessage('Community created successfully!');
      
      // Redirect to the new community page after a delay
      setTimeout(() => {
        navigate(`/communities/${createdCommunity.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating community:', error);
      showNotificationMessage('Failed to create community. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setImageUrls(newUrls);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>Create New Community</div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                {imageUrls.length > 0 ? (
                  <div className={styles.imageGrid}>
                    {imageUrls.map((url, index) => (
                      <div key={index} className={styles.imagePreview}>
                        <img 
                          src={url} 
                          alt={`Community image ${index + 1}`} 
                          className={styles.profileImage} 
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className={styles.removeImageBtn}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <img 
                    src="/api/placeholder/150/150" 
                    alt="Community profile placeholder" 
                    className={styles.profileImage} 
                  />
                )}
                
                <label htmlFor="imageUpload" className={styles.imageUpload}>
                  <i className="fas fa-camera"></i>
                  {isUploadingImages && <span>Uploading...</span>}
                </label>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  multiple
                  onChange={handleImageChange} 
                  style={{ display: 'none' }}
                  disabled={isUploadingImages}
                />
                {errors.imageUrls && <div className={styles.errorText}>{errors.imageUrls}</div>}
              </div>
              
              <div className={styles.profileInfo}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Community Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Enter community name"
                  />
                  {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label htmlFor="category" className={styles.label}>Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="">Select a category</option>
                      <option value={CommunityCategory.HOBBY}>Hobby</option>
                      <option value={CommunityCategory.TECHNOLOGY}>Technology</option>
                      <option value={CommunityCategory.ARTS}>Arts & Culture</option>
                      <option value={CommunityCategory.SPORTS}>Sports & Fitness</option>
                      <option value={CommunityCategory.EDUCATION}>Education</option>
                      <option value={CommunityCategory.SOCIAL}>Social</option>
                      <option value={CommunityCategory.BUSINESS}>Business & Networking</option>
                      <option value={CommunityCategory.OTHER}>Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formCol}>
                    <label htmlFor="location" className={styles.label}>Location</label>
                    <CitySelect
                      value={formData.location || ''}
                      onChange={handleCityChange}
                      placeholder="Выберите город"
                      error={errors.location}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Tell people what your community is about"
              />
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="dopDescription" className={styles.label}>Additional Information</label>
              <textarea
                id="dopDescription"
                name="dopDescription"
                value={formData.dopDescription || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dopDescription: e.target.value 
                }))}
                className={styles.textarea}
                placeholder="Share more details about your community (optional)"
              />
            </div>
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">I agree to the community guidelines and terms of service</label>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.button}
                disabled={isSubmitting || isUploadingImages}
              >
                {isSubmitting ? 'Creating...' : 'Create Community'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {showNotification && (
        <div className={`${styles.notification} ${styles.notificationSuccess}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityCreatePage;