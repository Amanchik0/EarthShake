/*
я это вообще с чат гпт взял можно полностью снести или хз че делать так как тут все криво но пусть стоит потом переделаем 

*/

import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle
} from '@react-google-maps/api';
import { Event } from '../types//Event';
import eventsData from '../../../data/events.json';

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const defaultCenter = {
  lat: 39.8283, 
  lng: -98.5795,
};

const EventsMap: React.FC = () => {
  // Преобразуем данные из JSON в массив типа Event[]
  const events: Event[] = eventsData.events;

  // Динамически получаем уникальные категории
  const categoriesSet = new Set(events.map((event) => event.category));
  const categories = ['All', ...Array.from(categoriesSet)];

  // Состояния для выбранной категории и выбранного события (для InfoWindow)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Фильтрация событий по выбранной категории
  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <div>
      {/* Панель фильтров */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              marginRight: '8px',
              padding: '8px 12px',
              backgroundColor: selectedCategory === cat ? '#1976d2' : '#e0e0e0',
              color: selectedCategory === cat ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={4}>
          {filteredEvents.map((event) => {
            // Для землетрясений отображаем круг, радиус зависит от magnitude
            if (event.category === 'Earthquake') {
              const radius = event.magnitude ? event.magnitude * 10000 : 50000;
              return (
                <Circle
                  key={event.id}
                  center={event.coordinates}
                  radius={radius}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                  }}
                  onClick={() => setSelectedEvent(event)}
                />
              );
            }
            // Для тайфунов (и похожих событий без конкретной точки)
            if (event.category === 'Typhoon') {
              // Если задан radius в данных, используем его, иначе значение по умолчанию (например, 100 км)
              const radius = event.radius ? event.radius : 100000;
              return (
                <Circle
                  key={event.id}
                  center={event.coordinates}
                  radius={radius}
                  options={{
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#0000FF',
                    fillOpacity: 0.35
                  }}
                  onClick={() => setSelectedEvent(event)}
                />
              );
            }
            // Для остальных категорий используем стандартный маркер
            return (
              <Marker
                key={event.id}
                position={event.coordinates}
                icon={{
                  url:
                    event.category === 'Wildfire'
                      ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                      : event.category === 'Severe Storm'
                      ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                      : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }}
                onClick={() => setSelectedEvent(event)}
              />
            );
          })}

          {selectedEvent && (
            <InfoWindow
              position={selectedEvent.coordinates}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div style={{ maxWidth: '200px' }}>
                <h4>{selectedEvent.title}</h4>
                <p>{selectedEvent.category}</p>
                <p>{new Date(selectedEvent.date).toLocaleString()}</p>
                {selectedEvent.description && <p>{selectedEvent.description}</p>}
                {selectedEvent.category === 'Earthquake' && selectedEvent.magnitude && (
                  <p><strong>Magnitude:</strong> {selectedEvent.magnitude}</p>
                )}
                {selectedEvent.category === 'Typhoon' && selectedEvent.radius && (
                  <p><strong>Radius:</strong> {selectedEvent.radius / 1000} km</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default EventsMap;
