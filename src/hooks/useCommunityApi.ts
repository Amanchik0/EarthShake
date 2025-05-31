// hooks/useCommunityApi.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiCommunityResponse, CommunityDetails, CommunityFormData } from '../types/community';

const API_BASE_URL = 'http://localhost:8090/api';

interface UseCommunityApiState {
  loading: boolean;
  error: string | null;
  community: CommunityDetails | null;
}

interface UseCommunityApiReturn extends UseCommunityApiState {
  fetchCommunity: (id: string) => Promise<void>;
  joinCommunity: (id: string) => Promise<void>;
  leaveCommunity: (id: string) => Promise<void>;
  createCommunity: (formData: CommunityFormData) => Promise<CommunityDetails>;
  updateCommunity: (id: string, formData: CommunityFormData) => Promise<void>;
  refreshCommunity: () => Promise<void>;
  subscribeToUpdates: (enabled: boolean) => void;
}

export const useCommunityApi = (): UseCommunityApiReturn => {
  const [state, setState] = useState<UseCommunityApiState>({
    loading: false,
    error: null,
    community: null,
  });

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCommunityIdRef = useRef<string | null>(null);

  // Получение заголовков авторизации
  const getAuthHeaders = useCallback((): HeadersInit => {
    const accessToken = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Преобразование API ответа в CommunityDetails
  const transformToCommunityDetails = useCallback((apiData: ApiCommunityResponse): CommunityDetails => {
    const currentUsername = localStorage.getItem('username');
    
    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      imageUrl: apiData.imageUrls,
      avatarUrl: apiData.imageUrls[0] || '/api/placeholder/150/150',
      coverUrl: apiData.imageUrls[1] || undefined,
      numberMembers: apiData.numberMembers,
      membersCount: apiData.numberMembers,
      location: apiData.city,
      createdAt: new Date(apiData.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      eventsCount: apiData.eventsCount,
      rating: apiData.rating,
      postsCount: apiData.postsCount,
      isMember: apiData.users.includes(currentUsername || ''),
      category: apiData.type,
      dopDescription: apiData.content ? [apiData.content] : [],
      users: apiData.users,
      author: apiData.author,
      listEvents: apiData.listEvents,
      reviewsCount: apiData.reviewsCount
    };
  }, []);

  // Получить обновления сообщества
  const getCommunityUpdates = useCallback(async (): Promise<ApiCommunityResponse> => {
    const response = await fetch(`${API_BASE_URL}/community/update`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch community updates: ${response.statusText}`);
    }

    return response.json();
  }, [getAuthHeaders]);

  // Получить конкретное сообщество
  const fetchCommunity = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    currentCommunityIdRef.current = id;

    try {
      const response = await fetch(`${API_BASE_URL}/community/${id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch community: ${response.statusText}`);
      }

      const apiData: ApiCommunityResponse = await response.json();
      const communityData = transformToCommunityDetails(apiData);

      setState(prev => ({
        ...prev,
        community: communityData,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load community'
      }));
    }
  }, [getAuthHeaders, transformToCommunityDetails]);

  // Обновить текущее сообщество
  const refreshCommunity = useCallback(async (): Promise<void> => {
    if (currentCommunityIdRef.current) {
      await fetchCommunity(currentCommunityIdRef.current);
    }
  }, [fetchCommunity]);

  // Вступить в сообщество
  const joinCommunity = useCallback(async (id: string): Promise<void> => {
    const username = localStorage.getItem('username');
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/community/${id}/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username })
      });

      let apiData: ApiCommunityResponse;

      if (response.ok) {
        apiData = await response.json();
      } else {
        // Если endpoint не реализован, используем update
        console.log('Join endpoint not implemented, using updates');
        apiData = await getCommunityUpdates();
      }

      const communityData = transformToCommunityDetails(apiData);
      setState(prev => ({
        ...prev,
        community: communityData,
        loading: false,
        error: null
      }));
    } catch (error) {
      // В случае ошибки API, обновляем состояние локально
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        community: prev.community ? {
          ...prev.community,
          isMember: true,
          numberMembers: prev.community.numberMembers + 1,
          membersCount: prev.community.membersCount + 1
        } : null
      }));
    }
  }, [getAuthHeaders, getCommunityUpdates, transformToCommunityDetails]);

  // Покинуть сообщество
  const leaveCommunity = useCallback(async (id: string): Promise<void> => {
    const username = localStorage.getItem('username');
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/community/${id}/leave`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username })
      });

      let apiData: ApiCommunityResponse;

      if (response.ok) {
        apiData = await response.json();
      } else {
        // Если endpoint не реализован, используем update
        console.log('Leave endpoint not implemented, using updates');
        apiData = await getCommunityUpdates();
      }

      const communityData = transformToCommunityDetails(apiData);
      setState(prev => ({
        ...prev,
        community: communityData,
        loading: false,
        error: null
      }));
    } catch (error) {
      // В случае ошибки API, обновляем состояние локально
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        community: prev.community ? {
          ...prev.community,
          isMember: false,
          numberMembers: prev.community.numberMembers - 1,
          membersCount: prev.community.membersCount - 1
        } : null
      }));
    }
  }, [getAuthHeaders, getCommunityUpdates, transformToCommunityDetails]);

  // Создать сообщество
  const createCommunity = useCallback(async (formData: CommunityFormData): Promise<CommunityDetails> => {
    const username = localStorage.getItem('username');
    
    const communityData = {
      name: formData.name,
      description: formData.description,
      imageUrls: formData.existingImageUrls || [],
      type: formData.category,
      city: formData.location,
      content: formData.dopDescription || '',
      author: username
    };

    const response = await fetch(`${API_BASE_URL}/community/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(communityData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create community: ${response.statusText}`);
    }

    const apiData: ApiCommunityResponse = await response.json();
    return transformToCommunityDetails(apiData);
  }, [getAuthHeaders, transformToCommunityDetails]);

  // Обновить сообщество
  const updateCommunity = useCallback(async (id: string, formData: CommunityFormData): Promise<void> => {
    const communityData = {
      name: formData.name,
      description: formData.description,
      imageUrls: formData.existingImageUrls || [],
      type: formData.category,
      city: formData.location,
      content: formData.dopDescription || ''
    };

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/community/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(communityData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update community: ${response.statusText}`);
      }

      const apiData: ApiCommunityResponse = await response.json();
      const communityDetails = transformToCommunityDetails(apiData);

      setState(prev => ({
        ...prev,
        community: communityDetails,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update community'
      }));
    }
  }, [getAuthHeaders, transformToCommunityDetails]);

  // Подписка на обновления
  const subscribeToUpdates = useCallback((enabled: boolean): void => {
    // Очищаем существующий интервал
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    if (enabled && currentCommunityIdRef.current) {
      updateIntervalRef.current = setInterval(async () => {
        try {
          const updates = await getCommunityUpdates();
          // Обновляем только если это наше сообщество
          if (updates.id === currentCommunityIdRef.current) {
            const communityDetails = transformToCommunityDetails(updates);
            setState(prev => ({
              ...prev,
              community: communityDetails
            }));
          }
        } catch (error) {
          console.error('Failed to fetch community updates:', error);
        }
      }, 30000); // Каждые 30 секунд
    }
  }, [getCommunityUpdates, transformToCommunityDetails]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    fetchCommunity,
    joinCommunity,
    leaveCommunity,
    createCommunity,
    updateCommunity,
    refreshCommunity,
    subscribeToUpdates
  };
};

// Дополнительный hook для списка сообществ
export const useCommunitiesList = () => {
  const [communities, setCommunities] = useState<CommunityDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
    hasMore: true
  });

  const getAuthHeaders = useCallback((): HeadersInit => {
    const accessToken = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const transformToCommunityDetails = useCallback((apiData: ApiCommunityResponse): CommunityDetails => {
    const currentUsername = localStorage.getItem('username');
    
    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      imageUrl: apiData.imageUrls,
      avatarUrl: apiData.imageUrls[0] || '/api/placeholder/150/150',
      coverUrl: apiData.imageUrls[1] || undefined,
      numberMembers: apiData.numberMembers,
      membersCount: apiData.numberMembers,
      location: apiData.city,
      createdAt: new Date(apiData.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      eventsCount: apiData.eventsCount,
      rating: apiData.rating,
      postsCount: apiData.postsCount,
      isMember: apiData.users.includes(currentUsername || ''),
      category: apiData.type,
      dopDescription: apiData.content ? [apiData.content] : [],
      users: apiData.users,
      author: apiData.author,
      listEvents: apiData.listEvents,
      reviewsCount: apiData.reviewsCount
    };
  }, []);

  const fetchCommunities = useCallback(async (page = 0, size = 20, reset = true) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/community/get-all?page=${page}&size=${size}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch communities: ${response.statusText}`);
      }

      const apiData = await response.json();
      const communitiesData = apiData.content.map(transformToCommunityDetails);
      
      if (reset) {
        setCommunities(communitiesData);
      } else {
        setCommunities(prev => [...prev, ...communitiesData]);
      }

      setPagination({
        currentPage: apiData.number,
        totalPages: apiData.totalPages,
        totalElements: apiData.totalElements,
        pageSize: apiData.size,
        hasMore: !apiData.last
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, transformToCommunityDetails]);

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      await fetchCommunities(pagination.currentPage + 1, pagination.pageSize, false);
    }
  }, [pagination, loading, fetchCommunities]);

  const refresh = useCallback(async () => {
    await fetchCommunities(0, pagination.pageSize, true);
  }, [fetchCommunities, pagination.pageSize]);

  const searchCommunities = useCallback(async (searchTerm: string, filters?: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_BASE_URL}/community/get-all?page=0&size=${pagination.pageSize}`;
      
      // Добавляем параметры поиска и фильтров (если API поддерживает)
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            url += `&${key}=${encodeURIComponent(value)}`;
          }
        });
      }

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to search communities: ${response.statusText}`);
      }

      const apiData = await response.json();
      const communitiesData = apiData.content.map(transformToCommunityDetails);
      
      setCommunities(communitiesData);
      setPagination({
        currentPage: apiData.number,
        totalPages: apiData.totalPages,
        totalElements: apiData.totalElements,
        pageSize: apiData.size,
        hasMore: !apiData.last
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search communities');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, transformToCommunityDetails, pagination.pageSize]);

  return {
    communities,
    loading,
    error,
    pagination,
    fetchCommunities,
    loadMore,
    refresh,
    searchCommunities
  };
};