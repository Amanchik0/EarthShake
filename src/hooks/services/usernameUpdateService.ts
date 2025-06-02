
// services/usernameUpdateService.ts

interface UpdateUsernameResult {
  success: boolean;
  updatedCommunities: number;
  updatedEvents: number;
  errors: string[];
}

export class UsernameUpdateService {
  private static async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * Обновляет username во всех связанных записях
   */
  static async updateUsernameInAllRecords(oldUsername: string, newUsername: string): Promise<UpdateUsernameResult> {
    const result: UpdateUsernameResult = {
      success: true,
      updatedCommunities: 0,
      updatedEvents: 0,
      errors: []
    };

    console.log(`🔄 Начинаем обновление username: ${oldUsername} → ${newUsername}`);

    try {
      // 1. Обновляем сообщества где пользователь является участником
      const communitiesResult = await this.updateUsernameInCommunities(oldUsername, newUsername);
      result.updatedCommunities = communitiesResult.updated;
      result.errors.push(...communitiesResult.errors);

      // 2. Обновляем события где пользователь является участником или автором
      const eventsResult = await this.updateUsernameInEvents(oldUsername, newUsername);
      result.updatedEvents = eventsResult.updated;
      result.errors.push(...eventsResult.errors);

      // 3. Если есть ошибки, считаем операцию частично неуспешной
      if (result.errors.length > 0) {
        result.success = false;
        console.warn(' Обновление username завершено с ошибками:', result.errors);
      } else {
        console.log(' Username успешно обновлен во всех записях');
      }

    } catch (error) {
      console.error('Критическая ошибка при обновлении username:', error);
      result.success = false;
      result.errors.push('Критическая ошибка при обновлении данных');
    }

    return result;
  }

  /**
   * Обновляет username в сообществах
   */
  private static async updateUsernameInCommunities(oldUsername: string, newUsername: string) {
    const result = { updated: 0, errors: [] as string[] };

    try {
      // Получаем все сообщества
      const response = await this.makeAuthenticatedRequest('http://localhost:8090/api/community/get-all');
      
      if (!response.ok) {
        throw new Error(`Ошибка получения сообществ: ${response.status}`);
      }

      const communitiesData = await response.json();
      const communities = communitiesData.content || [];

      console.log(`🔍 Найдено ${communities.length} сообществ для проверки`);

      // Обрабатываем каждое сообщество
      for (const community of communities) {
        try {
          let needsUpdate = false;
          const updatedCommunity = { ...community };

          // Проверяем автора
          if (community.author === oldUsername) {
            updatedCommunity.author = newUsername;
            needsUpdate = true;
            console.log(`📝 Обновляем автора сообщества "${community.name}"`);
          }

          // Проверяем участников
          if (community.users && community.users.includes(oldUsername)) {
            updatedCommunity.users = community.users.map((username: string) => 
              username === oldUsername ? newUsername : username
            );
            needsUpdate = true;
            console.log(`👥 Обновляем участника в сообществе "${community.name}"`);
          }

          // Если нужно обновление, отправляем запрос
          if (needsUpdate) {
            const updateResponse = await this.makeAuthenticatedRequest(
              'http://localhost:8090/api/community/update',
              {
                method: 'PUT',
                body: JSON.stringify(updatedCommunity)
              }
            );

            if (updateResponse.ok) {
              result.updated++;
              console.log(` Сообщество "${community.name}" обновлено`);
            } else {
              const errorText = await updateResponse.text().catch(() => 'Неизвестная ошибка');
              result.errors.push(`Ошибка обновления сообщества "${community.name}": ${errorText}`);
            }
          }

        } catch (error) {
          console.error(`Ошибка обработки сообщества "${community.name}":`, error);
          result.errors.push(`Ошибка обработки сообщества "${community.name}": ${error}`);
        }
      }

    } catch (error) {
      console.error('Ошибка получения списка сообществ:', error);
      result.errors.push(`Ошибка получения списка сообществ: ${error}`);
    }

    return result;
  }

  /**
   * Обновляет username в событиях
   */
  private static async updateUsernameInEvents(oldUsername: string, newUsername: string) {
    const result = { updated: 0, errors: [] as string[] };

    try {
      // Получаем все события (нужен эндпоинт для получения всех событий)
      // Если такого эндпоинта нет, пропускаем этот шаг
      const response = await this.makeAuthenticatedRequest('http://localhost:8090/api/events/get-all');
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ Эндпоинт для получения всех событий не найден, пропускаем обновление событий');
          return result;
        }
        throw new Error(`Ошибка получения событий: ${response.status}`);
      }

      const eventsData = await response.json();
      const events = Array.isArray(eventsData) ? eventsData : eventsData.content || [];

      console.log(`🔍 Найдено ${events.length} событий для проверки`);

      // Обрабатываем каждое событие
      for (const event of events) {
        try {
          let needsUpdate = false;
          const updatedEvent = { ...event };

          // Проверяем автора
          if (event.author === oldUsername) {
            updatedEvent.author = newUsername;
            needsUpdate = true;
            console.log(`📝 Обновляем автора события "${event.title}"`);
          }

          // Проверяем участников
          if (event.usersIds && event.usersIds.includes(oldUsername)) {
            updatedEvent.usersIds = event.usersIds.map((username: string) => 
              username === oldUsername ? newUsername : username
            );
            needsUpdate = true;
            console.log(`👥 Обновляем участника в событии "${event.title}"`);
          }

          // Если нужно обновление, отправляем запрос
          if (needsUpdate) {
            const updateResponse = await this.makeAuthenticatedRequest(
              `http://localhost:8090/api/events/update/${event.id}`,
              {
                method: 'PUT',
                body: JSON.stringify(updatedEvent)
              }
            );

            if (updateResponse.ok) {
              result.updated++;
              console.log(` Событие "${event.title}" обновлено`);
            } else {
              const errorText = await updateResponse.text().catch(() => 'Неизвестная ошибка');
              result.errors.push(`Ошибка обновления события "${event.title}": ${errorText}`);
            }
          }

        } catch (error) {
          console.error(`Ошибка обработки события "${event.title}":`, error);
          result.errors.push(`Ошибка обработки события "${event.title}": ${error}`);
        }
      }

    } catch (error) {
      console.error('Ошибка получения списка событий:', error);
      result.errors.push(`Ошибка получения списка событий: ${error}`);
    }

    return result;
  }

  /**
   * Проверяет, используется ли username в каких-либо записях
   */
  static async checkUsernameUsage(username: string): Promise<{
    communities: number;
    events: number;
    total: number;
  }> {
    const usage = { communities: 0, events: 0, total: 0 };

    try {
      // Проверяем сообщества
      const communitiesResponse = await this.makeAuthenticatedRequest('http://localhost:8090/api/community/get-all');
      if (communitiesResponse.ok) {
        const communitiesData = await communitiesResponse.json();
        const communities = communitiesData.content || [];
        
        usage.communities = communities.filter((community: any) => 
          community.author === username || 
          (community.users && community.users.includes(username))
        ).length;
      }

      // Проверяем события (если эндпоинт доступен)
      try {
        const eventsResponse = await this.makeAuthenticatedRequest('http://localhost:8090/api/events/get-all');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          const events = Array.isArray(eventsData) ? eventsData : eventsData.content || [];
          
          usage.events = events.filter((event: any) => 
            event.author === username || 
            (event.usersIds && event.usersIds.includes(username))
          ).length;
        }
      } catch (error) {
        console.log('ℹ️ Эндпоинт событий недоступен для проверки');
      }

      usage.total = usage.communities + usage.events;

    } catch (error) {
      console.error('Ошибка проверки использования username:', error);
    }

    return usage;
  }
}