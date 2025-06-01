import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import type { Feature, Polygon, GeoJsonProperties, Geometry } from 'geojson';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// Типы
export interface Emergency {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  title?: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface DrawFeature extends Feature<Geometry, GeoJsonProperties> {
  id: string;
}

interface DrawEvent {
  features: DrawFeature[];
}

interface Event {
  id: string;
  lat: number;
  lng: number;
  title?: string;
}

interface GatheringPoint {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  address?: string;
}

interface MapProps {
  emergencies?: Emergency[];
  events?: Event[];
  gatheringPoints?: GatheringPoint[];
  selectedArea?: Feature<Polygon> | null;
  onSelectArea?: (area: Feature<Polygon>) => void;
  mode?: 'emergencies' | 'events' | 'gathering';
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw';

const Map: React.FC<MapProps> = ({
  emergencies = [],
  events = [],
  gatheringPoints = [],
  selectedArea = null,
  onSelectArea = () => {},
  mode = 'emergencies'
}) => {
  const mapboxToken = mapboxgl.accessToken;
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const drawControl = useRef<MapboxDraw | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  console.log('Map props:', { emergencies, events, mode });

  const markers = useRef<{
    emergencies: mapboxgl.Marker[];
    events: mapboxgl.Marker[];
    gatheringPoints: mapboxgl.Marker[];
  }>({ emergencies: [], events: [], gatheringPoints: [] });

  // Инициализация карты
  useEffect(() => {
    console.log('Инициализация карты...');
    if (!mapContainer.current) {
      console.error('Контейнер карты не найден!');
      return;
    }

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [73.3673, 48.0196],
      zoom: 5,
      antialias: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    });

    geolocate.on('geolocate', (e: any) => {
      setUserLocation({
        lng: e.coords.longitude,
        lat: e.coords.latitude
      });
    });

    map.current.addControl(geolocate);

    drawControl.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    if (drawControl.current) {
      map.current.addControl(drawControl.current);
    }

    map.current.on('draw.create', (e: DrawEvent) => {
      if (e.features.length === 0) return;

      const drawnFeature = e.features[0];

      if (drawnFeature.geometry.type === 'Polygon') {
        console.log('Полигон создан:', drawnFeature);
        onSelectArea(drawnFeature as Feature<Polygon>);
      } else {
        console.warn('Нарисован не полигон!');
        if (drawControl.current) {
          drawControl.current.delete(e.features.map(f => f.id as string));
        }
      }
    });

    // Устанавливаем флаг загрузки карты
    map.current.on('load', () => {
      console.log('Карта загружена');
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const clearAllMarkers = useCallback(() => {
    Object.values(markers.current).forEach(type => {
      type.forEach(marker => marker.remove());
    });
    markers.current = { emergencies: [], events: [], gatheringPoints: [] };
  }, []);

  // Проверка пользователя в радиусе ЧС (исправлено)
  useEffect(() => {
    if (!map.current || !userLocation || emergencies.length === 0 || !mapLoaded) return;

    const isUserInRadius = emergencies.some(emergency => {
      const distance = turf.distance(
        turf.point([userLocation.lng, userLocation.lat]),
        turf.point([emergency.lng, emergency.lat]),
        { units: 'meters' }
      );
      console.log(`Расстояние до ${emergency.title}: ${distance}м, радиус: ${emergency.radius}м`);
      return distance <= emergency.radius;
    });

    console.log('Пользователь в радиусе ЧС:', isUserInRadius);

    // Изменяем цвет фона только если пользователь действительно в радиусе
    if (isUserInRadius) {
      map.current.setPaintProperty('background', 'background-color', 'rgba(255, 0, 0, 0.1)');
    } else {
      map.current.setPaintProperty('background', 'background-color', 'rgba(255, 255, 255, 1)');
    }
  }, [userLocation, emergencies, mapLoaded]);

  // Отображение чрезвычайных ситуаций (исправлено)
  useEffect(() => {
    if (!map.current || !mapLoaded || mode !== 'emergencies') return;

    console.log('Обновление ЧС на карте:', emergencies);
    clearAllMarkers();

    // Сначала обновляем радиусы
    updateEmergencyRadii(emergencies);

    // Затем добавляем маркеры
    emergencies.forEach(emergency => {
      const marker = createMarker(
        [emergency.lng, emergency.lat],
        'red',
        `<h3>${emergency.title || 'ЧС'}</h3>
         <p>Радиус: ${emergency.radius}м</p>
         ${userLocation ? getDistanceText(userLocation, emergency) : ''}`
      );
      markers.current.emergencies.push(marker);
    });
  }, [emergencies, userLocation, mode, mapLoaded]);

  // Отображение событий
  useEffect(() => {
    if (!map.current || !mapLoaded || mode !== 'events') return;

    console.log('Обновление событий на карте:', events);
    clearAllMarkers();

    const filteredEvents = selectedArea
      ? events.filter(event => isInArea(event, selectedArea))
      : events;

    console.log('Отфильтрованные события:', filteredEvents);

    filteredEvents.forEach(event => {
      const marker = createMarker(
        [event.lng, event.lat],
        '#ff69b4',
        `<h3>${event.title || 'Событие'}</h3>
         ${userLocation ? getDistanceText(userLocation, event) : ''}`
      );
      markers.current.events.push(marker);
    });
  }, [events, selectedArea, userLocation, mode, mapLoaded]);

  // Отображение точек сбора
  useEffect(() => {
    if (!map.current || !mapLoaded || mode !== 'gathering') return;

    clearAllMarkers();

    gatheringPoints.forEach(point => {
      const marker = createMarker(
        [point.lng, point.lat],
        'green',
        `<h3>${point.title || 'Точка сбора'}</h3>
         ${point.address ? `<p>${point.address}</p>` : ''}
         ${userLocation ? getDistanceText(userLocation, point) : ''}
         <button class="route-btn" data-lng="${point.lng}" data-lat="${point.lat}">
           Построить маршрут
         </button>`
      );

      marker.getElement().addEventListener('click', () => {
        setTimeout(() => {
          document.querySelectorAll('.route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const target = e.target as HTMLElement;
              if (userLocation) {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${target.dataset.lat},${target.dataset.lng}`,
                  '_blank'
                );
              }
            });
          });
        }, 100);
      });

      markers.current.gatheringPoints.push(marker);
    });
  }, [gatheringPoints, userLocation, mode, mapLoaded]);

  const createMarker = (lnglat: [number, number], color: string, popupHtml: string) => {
    const el = document.createElement('div');
    el.className = 'map-marker';
    el.style.backgroundColor = color;
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);

    return new mapboxgl.Marker(el)
      .setLngLat(lnglat)
      .setPopup(popup)
      .addTo(map.current!);
  };

  const getDistanceText = (userLoc: Location, point: { lng: number; lat: number }) => {
    const distance = turf.distance(
      turf.point([userLoc.lng, userLoc.lat]),
      turf.point([point.lng, point.lat]),
      { units: 'kilometers' }
    );
    return `<p>${distance < 1
      ? `${Math.round(distance * 1000)} м от вас`
      : `${distance.toFixed(1)} км от вас`}</p>`;
  };

  const isInArea = (point: { lng: number; lat: number }, area: Feature<Polygon>) => {
    console.log('Проверка точки:', point, 'внутри полигона:', area);
    return turf.booleanPointInPolygon(
      turf.point([point.lng, point.lat]),
      area
    );
  };

  // Исправленная функция для отображения радиусов ЧС
  const updateEmergencyRadii = (emergenciesData: Emergency[]) => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'emergencies-radius';
    const layerId = 'emergencies-radius-layer';

    // Удаляем существующий слой и источник
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    if (emergenciesData.length === 0) return;

    const geoJsonData = createGeoJSONCircle(emergenciesData);
    console.log('GeoJSON для радиусов:', geoJsonData);

    // Добавляем новый источник
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: geoJsonData
    });

    // Добавляем слой для отображения кругов
    map.current.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': 'rgba(255, 0, 0, 0.2)',
        'fill-outline-color': 'red'
      }
    });
  };

  const createGeoJSONCircle = (emergenciesData: Emergency[]): GeoJSON.FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: emergenciesData.map(emergency => {
        // Конвертируем радиус из метров в километры для turf.circle
        const radiusInKm = emergency.radius / 1000;
        const circle = turf.circle([emergency.lng, emergency.lat], radiusInKm, {
          steps: 64,
          units: 'kilometers'
        });
        
        console.log(`Создание круга для ${emergency.title}: центр [${emergency.lng}, ${emergency.lat}], радиус ${radiusInKm}км`);
        
        return {
          ...circle,
          properties: { 
            id: emergency.id, 
            radius: emergency.radius,
            title: emergency.title 
          }
        };
      })
    };
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainer} style={{
        width: '100%',
        height: '600px',
      }} />

      {/* Отладочная информация */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md z-10 text-xs">
          <div>Режим: {mode}</div>
          <div>События: {events.length}</div>
          <div>ЧС: {emergencies.length}</div>
          <div>Карта загружена: {mapLoaded ? 'Да' : 'Нет'}</div>
          {userLocation && (
            <div>Пользователь: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Map;