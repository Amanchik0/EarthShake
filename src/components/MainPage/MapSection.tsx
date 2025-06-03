import React, { useEffect, useState } from 'react';
import styles from '../../features/Main/mainStyle.module.css';
import Map, { Emergency } from '../MapComponent';
import { Event, BackendEventData } from '../../types/event';

interface MapSectionProps {
  events?: Event[];
}

interface MapEvent {
  id: string;
  lat: number;
  lng: number;
  title?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ events = [] }) => {
  const [mapEvents, setMapEvents] = useState<MapEvent[]>([]);
  const [allEvents, setAllEvents] = useState<MapEvent[]>([]);

  // Получаем все события для карты
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/events/get-all');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Преобразуем данные для карты
        const transformedEvents: MapEvent[] = data.content
          .filter((event: BackendEventData) => 
            event.location && 
            typeof event.location.x === 'number' && 
            typeof event.location.y === 'number'
          )
          .map((event: BackendEventData) => ({
            id: event.id,
            lat: event.location.y,
            lng: event.location.x,
            title: event.title
          }));

        setAllEvents(transformedEvents);
        setMapEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events for map:', error);
        // Если есть переданные события, используем их
        if (events.length > 0) {
          setMapEvents([]);
        }
      }
    };

    fetchAllEvents();
  }, [events]);

  // Демо данные для чрезвычайных ситуаций
  const demoEmergencies: Emergency[] = [
    {
      id: '1',
      lat: 51.1694,
      lng: 71.4491,
      radius: 5000,
      title: 'Наводнение в Нур-Султане'
    },
    {
      id: '2',
      lat: 43.2567,
      lng: 76.9286,
      radius: 3000,
      title: 'Землетрясение в Алматы'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mapContainer}>
          <h2 className={styles.mapTitle}>События по всему Казахстану</h2>
     
          
          <div className={styles.mapWrapper}>
            <Map 
              emergencies={demoEmergencies}
              events={mapEvents}
              mode="events"
            />
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default MapSection;