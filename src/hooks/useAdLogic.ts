import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";

interface AdData {
  id: string;
  name: string;
  mediaUrl: string;
  type: string;
  targetUrl: string;
  active: boolean;
  showCount: number;
  clickCount: number;
  finishDate: string;
}

interface AdDisplayData {
  name: string;
  mediaUrl: string;
  targetUrl: string;
}

export function useAdLogic() {
  const { user } = useAuth();
  const location = useLocation();
  const [adClicks, setAdClicks] = useState(0);
  const [adData, setAdData] = useState<AdDisplayData | null>(null);
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);

  // Функция для получения рекламы из API
  const fetchAdvertisement = async (): Promise<AdData | null> => {
    try {
      console.log('📡 Загружаем рекламу...');
      const response = await fetch('http://localhost:8090/api/advertisement/get-advertisement');
      if (!response.ok) {
        console.warn(' Не удалось загрузить рекламу:', response.status);
        return null;
      }
      const data = await response.json();
      
      // Проверяем, что реклама активна и не истекла
      if (data && data.active && new Date(data.finishDate) > new Date()) {
        console.log(' Реклама загружена:', data);
        return data;
      }
      console.log(' Реклама неактивна или истекла');
      return null;
    } catch (error) {
      console.error(' Ошибка загрузки рекламы:', error);
      return null;
    }
  };

  const updateShowCount = async (adId: string) => {
    try {
      console.log(' Обновляем счетчик показов для рекламы:', adId);
      await fetch(`http://localhost:8090/api/advertisement/${adId}/show`, {
        method: 'POST'
      });
      console.log(' Счетчик показов обновлен');
    } catch (error) {
      console.error(' Ошибка обновления счетчика показов:', error);
    }
  };

  const updateClickCount = async (adId: string) => {
    try {
      console.log(' Обновляем счетчик кликов для рекламы:', adId);
      const response = await fetch(`http://localhost:8090/api/advertisement/increment/${adId}`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        console.log(' Счетчик кликов обновлен');
      } else {
        console.error(' Ошибка обновления счетчика кликов:', response.status);
      }
    } catch (error) {
      console.error(' Ошибка PATCH запроса для счетчика кликов:', error);
    }
  };

  useEffect(() => {
    setAdClicks(prev => prev + 1);
    console.log(' Переход на новую страницу, счетчик кликов:', adClicks + 1);
  }, [location.pathname]);

  useEffect(() => {
    const loadAdvertisement = async () => {
      const ad = await fetchAdvertisement();
      setCurrentAd(ad);
    };
    
    loadAdvertisement();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const shouldShowAd = adClicks > 0 && 
                        adClicks % 10 === 0 && 
                        currentAd && 
                        (!user || !user.isSubscriber);

    console.log('🔍 Проверка показа рекламы:', {
      adClicks,
      hasCurrentAd: !!currentAd,
      isUserLoggedIn: !!user,
      isSubscriber: user?.isSubscriber,
      shouldShowAd
    });

    if (shouldShowAd) {
      console.log('📺 Показываем рекламу пользователю');
      
      setAdData({
        name: currentAd.name,
        mediaUrl: currentAd.mediaUrl,
        targetUrl: currentAd.targetUrl
      });

      updateShowCount(currentAd.id);

      timer = setTimeout(() => {
        console.log('⏰ Автоматически закрываем рекламу');
        setAdData(null);
      }, 10000);
    } else if (user?.isSubscriber) {
      console.log(' У пользователя есть подписка, реклама отключена');
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adClicks, currentAd, user?.isSubscriber]);

  const handleCloseAd = () => {
    console.log('Пользователь закрыл рекламу');
    setAdData(null);
  };

  const handleAdClick = () => {
    if (currentAd) {
      console.log(' Клик по рекламе, отправляем PATCH запрос');
      updateClickCount(currentAd.id);
    }
  };

  return { 
    adData, 
    handleCloseAd, 
    handleAdClick,
    currentAd 
  };
}