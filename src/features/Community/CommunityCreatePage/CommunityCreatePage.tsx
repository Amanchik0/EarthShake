// CommunityCreatePage.tsx
import React, { useState } from 'react';
import { Community } from '../../../types/community';
import styles from './CommunityCreatePage.module.css';
import { useNavigate } from 'react-router-dom';

const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState<Partial<Community>>({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this example, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, imageUrl: fakeUrl }));
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
    
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Community image is required';
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
      // In a real application, you would make an API call here
      // For this example, we'll simulate a server delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add fake ID and members count
      const newCommunity: Community = {
        ...formData as Community,
        id: `comm_${Date.now()}`,
        numberMembers: 1, // Starting with the creator
      };
      
      console.log('Created community:', newCommunity);
      showNotificationMessage('Community created successfully!');
      
      // Redirect to the new community page after a delay
      setTimeout(() => {
        navigate(`/communities/${newCommunity.id}`);
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

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.sectionTitle}>Create New Community</div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img 
                  src={formData.imageUrl || "/api/placeholder/150/150"} 
                  alt="Community profile" 
                  className={styles.profileImage} 
                />
                <label htmlFor="imageUpload" className={styles.imageUpload}>
                  <i className="fas fa-camera"></i>
                </label>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
                {errors.imageUrl && <div className={styles.errorText}>{errors.imageUrl}</div>}
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
                      value={(formData as any).category || ''}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="">Select a category</option>
                      <option value="technology">Technology</option>
                      <option value="arts">Arts & Culture</option>
                      <option value="sports">Sports & Fitness</option>
                      <option value="education">Education</option>
                      <option value="social">Social</option>
                      <option value="business">Business & Networking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formCol}>
                    <label htmlFor="location" className={styles.label}>Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={(formData as any).location || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="City, Country"
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
                value={(formData as any).dopDescription || ''}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Share more details about your community (optional)"
              />
            </div>
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" name="terms" />
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
                disabled={isSubmitting}
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