// components/Community/CommunityHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityDetails } from '../../types/community';
import styles from './CommunityHeader.module.css';

interface CommunityHeaderProps {
  community: CommunityDetails;
  onJoin: () => void;
  loading?: boolean;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community, onJoin, loading = false }) => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate(`/events/create?communityId=${community.id}`);
  };

  const handleEditCommunity = () => {
    navigate(`/communities/${community.id}/edit`);
  };

  return (
    <div className={styles.communityHeader}>
      {/* Обложка (если есть) */}
      {community.coverUrl && (
        <div className={styles.coverImage}>
          <img src={community.coverUrl} alt={`Обложка ${community.name}`} />
        </div>
      )}
      
      <div className={styles.headerContent}>
        <div className={styles.avatar}>
          <img src={community.avatarUrl} alt={community.name} />
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.name}>{community.name}</h1>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {community.location}
            </div>
            
            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Создано: {new Date(community.createdAt).toLocaleDateString('ru-RU')}
            </div>
            
            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Автор: {community.author}
            </div>

            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Категория: {community.category}
            </div>
          </div>
          
          <div className={styles.description}>
            <p>{community.description}</p>
            {community.content && (
              <div className={styles.content}>
                <p>{community.content}</p>
              </div>
            )}
          </div>
          
          <div className={styles.actionButtons}>
            {/* Кнопки для автора */}
            {community.isAuthor && (
              <div className={styles.authorActions}>
                <button 
                  className={styles.createEventButton}
                  onClick={handleCreateEvent}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Создать событие
                </button>
                
                <button 
                  className={styles.editCommunityButton}
                  onClick={handleEditCommunity}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Редактировать
                </button>
              </div>
            )}
            
            {/* Кнопка вступления/выхода */}
            <button 
              className={`${styles.joinButton} ${community.isMember ? styles.memberButton : ''}`} 
              onClick={onJoin}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.buttonLoading}>
                  <div className={styles.spinner}></div>
                  {community.isMember ? 'Выход...' : 'Вступление...'}
                </span>
              ) : (
                community.isMember ? 'Покинуть сообщество' : 'Вступить в сообщество'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;