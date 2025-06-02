import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import { useCommunityDetail } from '../../../hooks/useCommunityDetail';
import { Community } from '../../../types/community';
import styles from './CommunityMembersPage.module.css';

interface UserProfile {
  id: string;
  username: string;
  imageUrl?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  city?: string;
  interests?: string[];
  registrationDate?: string;
  lastActivity?: string;
}

interface MemberWithProfile {
  id: string;
  username: string;
  role: 'admin' | 'member';
  profile?: UserProfile;
  joinDate?: string;
  lastActivity?: string;
}

const CommunityMembersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    loading: communityLoading, 
    error: communityError, 
    community, 
    loadCommunity 
  } = useCommunityDetail(user?.username);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string>('');

  // Загрузка данных сообщества
  useEffect(() => {
    if (id) {
      loadCommunity(id);
    }
  }, [id, loadCommunity]);

  // Функция загрузки профилей пользователей
  const loadUserProfiles = async (usernames: string[]) => {
    if (!usernames || usernames.length === 0) {
      setUserProfiles(new Map());
      return;
    }

    setMembersLoading(true);
    setMembersError('');

    try {
      const token = localStorage.getItem('accessToken');
      const profilesMap = new Map<string, UserProfile>();

      console.log(`🔍 Загружаем профили ${usernames.length} пользователей...`);

      // Загружаем профили пользователей параллельно
      const profilePromises = usernames.map(async (username) => {
        try {
          const response = await fetch(`http://localhost:8090/api/users/get-by-username/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.warn(` Профиль ${username} не найден (${response.status})`);
            return {
              id: username,
              username: username,
              imageUrl: '/api/placeholder/50/50'
            };
          }

          const profile: UserProfile = await response.json();
          return profile;
        } catch (error) {
          console.error(`Ошибка загрузки профиля ${username}:`, error);
          return {
            id: username,
            username: username,
            imageUrl: '/api/placeholder/50/50'
          };
        }
      });

      const profiles = await Promise.all(profilePromises);
      
      profiles.forEach(profile => {
        if (profile) {
          profilesMap.set(profile.username, profile);
        }
      });

      console.log(` Загружено ${profilesMap.size} профилей пользователей`);
      setUserProfiles(profilesMap);

    } catch (error) {
      console.error('Общая ошибка загрузки профилей:', error);
      setMembersError('Ошибка при загрузке профилей пользователей');
    } finally {
      setMembersLoading(false);
    }
  };

  // Загрузка профилей пользователей при изменении сообщества
  useEffect(() => {
    if (community && community.users) {
      loadUserProfiles(community.users);
    }
  }, [community?.users]);

  // Обновление списка участников при загрузке профилей
  useEffect(() => {
    if (community && userProfiles.size > 0) {
      const membersList: MemberWithProfile[] = community.users.map(username => {
        const profile = userProfiles.get(username);
        return {
          id: profile?.id || username,
          username: username,
          role: username === community.author ? 'admin' : 'member',
          profile: profile,
          joinDate: profile?.registrationDate ? 
            new Date(profile.registrationDate).toLocaleDateString('ru-RU') : 
            'Неизвестно',
          lastActivity: profile?.lastActivity ? 
            new Date(profile.lastActivity).toLocaleDateString('ru-RU') : 
            'Неизвестно'
        };
      });

      setMembers(membersList);
    }
  }, [community, userProfiles]);

  // Фильтрация участников
  const filteredMembers = members.filter(member => {
    const matchesFilter = activeFilter === 'all' || member.role === activeFilter;
    const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (member.profile?.firstName && member.profile.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.profile?.lastName && member.profile.lastName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const adminCount = members.filter(m => m.role === 'admin').length;

  const handleBack = () => {
    navigate(`/communities/${id}`);
  };

  const handleMemberClick = (memberId: string) => {
    // Переход к профилю пользователя (если такая страница существует)
    // navigate(`/users/${memberId}`);
    console.log(`Переход к профилю пользователя: ${memberId}`);
  };

  // Проверка ID
  if (!id) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>ID сообщества не найден</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  // Состояние загрузки сообщества
  if (communityLoading && !community) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка данных сообщества...</p>
        </div>
      </div>
    );
  }

  // Ошибка загрузки сообщества
  if (communityError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{communityError}</p>
          <div className={styles.errorActions}>
            <button onClick={() => loadCommunity(id)}>Попробовать еще раз</button>
            <button onClick={handleBack}>Назад</button>
          </div>
        </div>
      </div>
    );
  }

  // Сообщество не найдено
  if (!community) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Сообщество не найдено</h2>
          <p>Запрашиваемое сообщество не существует или было удалено</p>
          <button onClick={() => navigate('/communities')}>К списку сообществ</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Назад к сообществу
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Участники сообщества</h1>
          <p className={styles.communityName}>"{community.name}"</p>
        </div>
      </header>
      
      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{members.length}</span>
              <span className={styles.statLabel}>Всего участников</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{adminCount}</span>
              <span className={styles.statLabel}>Администраторов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{members.length - adminCount}</span>
              <span className={styles.statLabel}>Участников</span>
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${activeFilter === 'all' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Все ({members.length})
              </button>
              <button 
                className={`${styles.filterTab} ${activeFilter === 'admin' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('admin')}
              >
                Администраторы ({adminCount})
              </button>
              <button 
                className={`${styles.filterTab} ${activeFilter === 'member' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('member')}
              >
                Участники ({members.length - adminCount})
              </button>
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  type="text" 
                  placeholder="Поиск участников..." 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.membersSection}>
          {membersLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка участников...</p>
            </div>
          )}

          {membersError && (
            <div className={styles.error}>
              <p>{membersError}</p>
              <button onClick={() => loadUserProfiles(community.users)}>
                Попробовать снова
              </button>
            </div>
          )}

          {!membersLoading && !membersError && (
            <>
              {filteredMembers.length === 0 ? (
                <div className={styles.noResults}>
                  {searchQuery ? (
                    <div>
                      <h3>Участники не найдены</h3>
                      <p>По запросу "{searchQuery}" никого не найдено</p>
                    </div>
                  ) : (
                    <div>
                      <h3>Участники скоро появятся</h3>
                      <p>В этом сообществе пока нет участников</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.membersList}>
                  {filteredMembers.map(member => (
                    <div key={member.id} className={styles.memberCard}>
                      <div 
                        className={styles.memberCardContent}
                        onClick={() => handleMemberClick(member.id)}
                      >
                        <div className={styles.memberAvatar}>
                          <img 
                            src={member.profile?.imageUrl || '/api/placeholder/60/60'} 
                            alt={member.username}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder/60/60';
                            }}
                          />
                          {member.role === 'admin' && (
                            <div className={styles.adminBadge}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26"></polygon>
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.memberInfo}>
                          <div className={styles.memberHeader}>
                            <h3 className={styles.memberName}>
                              {member.profile?.firstName && member.profile?.lastName ? 
                                `${member.profile.firstName} ${member.profile.lastName}` : 
                                member.username
                              }
                              {member.username === community.author && (
                                <span className={styles.creatorLabel}>(Создатель)</span>
                              )}
                            </h3>
                            <span className={styles.memberUsername}>@{member.username}</span>
                          </div>
                          
                          <div className={styles.memberRole}>
                            <span className={`${styles.roleBadge} ${member.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeMember}`}>
                              {member.role === 'admin' ? 'Администратор' : 'Участник'}
                            </span>
                          </div>

                          {member.profile?.bio && (
                            <p className={styles.memberBio}>{member.profile.bio}</p>
                          )}

                          <div className={styles.memberDetails}>
                            {member.profile?.city && (
                              <div className={styles.memberDetail}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                  <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>{member.profile.city}</span>
                              </div>
                            )}
                            
                            <div className={styles.memberDetail}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              <span>В сообществе с {member.joinDate}</span>
                            </div>

                            {member.lastActivity && member.lastActivity !== 'Неизвестно' && (
                              <div className={styles.memberDetail}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                                <span>Активность: {member.lastActivity}</span>
                              </div>
                            )}
                          </div>

                          {member.profile?.interests && member.profile.interests.length > 0 && (
                            <div className={styles.memberInterests}>
                              {member.profile.interests.slice(0, 3).map((interest, index) => (
                                <span key={index} className={styles.interestTag}>
                                  {interest}
                                </span>
                              ))}
                              {member.profile.interests.length > 3 && (
                                <span className={styles.moreInterests}>
                                  +{member.profile.interests.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityMembersPage;