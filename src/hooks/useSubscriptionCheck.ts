import { useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';

export const useSubscriptionCheck = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    feature: 'event' | 'community';
    targetPath: string;
  } | null>(null);

  const checkSubscriptionAndNavigate = (
    feature: 'event' | 'community',
    targetPath: string,
    navigateCallback: (path: string) => void
  ) => {
    console.log('🔍 Проверяем подписку пользователя...');
    console.log('👤 Пользователь:', user);
    console.log('📦 isSubscriber:', user?.isSubscriber);

    if (!user) {
      console.log('Пользователь не авторизован');
      return;
    }

    if (user.isSubscriber) {
      console.log(' У пользователя есть подписка, разрешаем переход');
      navigateCallback(targetPath);
    } else {
      console.log(' У пользователя нет подписки, показываем модалку');
      setPendingNavigation({ feature, targetPath });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPendingNavigation(null);
  };

  return {
    isModalOpen,
    pendingNavigation,
    checkSubscriptionAndNavigate,
    closeModal
  };
};