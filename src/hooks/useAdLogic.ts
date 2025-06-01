import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [adClicks, setAdClicks] = useState(0);
  const [adData, setAdData] = useState<AdDisplayData | null>(null);
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);

  // Функция для получения рекламы из API
  const fetchAdvertisement = async (): Promise<AdData | null> => {
    try {
      const response = await fetch('http://localhost:8090/api/advertisement/get-advertisement');
      if (!response.ok) {
        throw new Error('Failed to fetch advertisement');
      }
      const data = await response.json();
      
      // Проверяем, что реклама активна и не истекла
      if (data && data.active && new Date(data.finishDate) > new Date()) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching advertisement:', error);
      return null;
    }
  };

  // Функция для обновления счетчика показов
  const updateShowCount = async (adId: string) => {
    try {
      // Предполагаем, что есть API для обновления счетчика показов
      // Если такого API нет, можете удалить эту функцию
      await fetch(`http://localhost:8090/api/advertisement/${adId}/show`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error updating show count:', error);
    }
  };

  // Функция для обновления счетчика кликов
  const updateClickCount = async (adId: string) => {
    try {
      // Предполагаем, что есть API для обновления счетчика кликов
      // Если такого API нет, можете удалить эту функцию
      await fetch(`http://localhost:8090/api/advertisement/${adId}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

  // Увеличиваем счетчик при смене страницы
  useEffect(() => {
    setAdClicks(prev => prev + 1);
  }, [location.pathname]);

  // Загружаем рекламу при инициализации
  useEffect(() => {
    const loadAdvertisement = async () => {
      const ad = await fetchAdvertisement();
      setCurrentAd(ad);
    };
    
    loadAdvertisement();
  }, []);

  // Показываем рекламу каждые 10 кликов
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (adClicks > 0 && adClicks % 10 === 0 && currentAd) {
      // Преобразуем данные для компонента AdModal
      setAdData({
        name: currentAd.name,
        mediaUrl: currentAd.mediaUrl,
        targetUrl: currentAd.targetUrl
      });

      // Обновляем счетчик показов
      updateShowCount(currentAd.id);

      // Автоматически закрываем через 10 секунд
      timer = setTimeout(() => {
        setAdData(null);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adClicks, currentAd]);

  const handleCloseAd = () => {
    setAdData(null);
  };

  // Обработчик клика по рекламе (для счетчика кликов)
  const handleAdClick = () => {
    if (currentAd) {
      updateClickCount(currentAd.id);
    }
  };

  return { 
    adData, 
    handleCloseAd, 
    handleAdClick,
    currentAd // Возвращаем текущую рекламу для дополнительной информации если нужно
  };
}