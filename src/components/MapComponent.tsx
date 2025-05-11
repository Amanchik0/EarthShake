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
// interface DrawEvent {
//   features: Array<Feature<Polygon, GeoJsonProperties> & { id: string }>;
// }
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
interface CircleProperties {
  radius: number;
}

interface CircleFeature extends GeoJSON.Feature<GeoJSON.Point, CircleProperties> {
  type: 'Feature';
}

interface CircleFeatureCollection extends GeoJSON.FeatureCollection<GeoJSON.Point, CircleProperties> {
  type: 'FeatureCollection';
  features: CircleFeature[];
}

interface MapProps {
  emergencies?: Emergency[];
  events?: Event[];
  gatheringPoints?: GatheringPoint[];
  selectedArea?: Feature<Polygon>; // Используем Feature из geojson
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
  
  // Все маркеры храним в ref
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
      center: [73.3673, 48.0196], // Центр Казахстана
      zoom: 5,
      antialias: true 
    });

    // Добавляем элементы управления
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Геолокация с обработчиком
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

    // Инициализация инструмента рисования
    // const Draw = require('@mapbox/mapbox-gl-draw'); по сути тоже самое что и MapboxDraw но там оказ есть прямой импорт 
    
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
    // Обработчик создания области
map.current.on('draw.create',  (e: DrawEvent)  => {
  if (e.features.length === 0) return;
  
  const drawnFeature = e.features[0];
  
  // Проверяем, что это полигон
  if (drawnFeature.geometry.type === 'Polygon') {
    onSelectArea(drawnFeature as Feature<Polygon>);
  } else {
    console.warn('Нарисован не полигон!');
    // Удаляем некорректную фигуру
    if (drawControl.current) {
      drawControl.current.delete(e.features.map(f => f.id as string));
    }
  }
});

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Очистка всех маркеров
  const clearAllMarkers = useCallback(() => {
    Object.values(markers.current).forEach(type => {
      type.forEach(marker => marker.remove());
    });
    markers.current = { emergencies: [], events: [], gatheringPoints: [] };
  }, []);

  // Обновление ЧС
  useEffect(() => {
    if (!map.current || !map.current.loaded() || mode !== 'emergencies') return;

    clearAllMarkers();
    updateEmergencyRadii(emergencies);

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
  }, [emergencies, userLocation, mode]);

  // Обновление событий
  useEffect(() => {
    if (!map.current || !map.current.loaded() || mode !== 'events') return;

    clearAllMarkers();

    const filteredEvents = selectedArea 
      ? events.filter(event => isInArea(event, selectedArea))
      : events;

    filteredEvents.forEach(event => {
      const marker = createMarker(
        [event.lng, event.lat],
        'blue',
        `<h3>${event.title || 'Событие'}</h3>
         ${userLocation ? getDistanceText(userLocation, event) : ''}`
      );
      markers.current.events.push(marker);
    });
  }, [events, selectedArea, userLocation, mode]);

  // Обновление точек сбора
  useEffect(() => {
    if (!map.current || !map.current.loaded() || mode !== 'gathering') return;

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
  }, [gatheringPoints, userLocation, mode]);

  // Вспомогательные функции
  const createMarker = (lnglat: [number, number], color: string, popupHtml: string) => {
    const el = document.createElement('div');
    el.className = 'map-marker';
    el.style.backgroundColor = color;
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';

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
    return turf.booleanPointInPolygon(
      turf.point([point.lng, point.lat]),
      area
    );
  };

const updateEmergencyRadii = (emergenciesData: Emergency[]) => {
  if (!map.current) return;

  const sourceId = 'emergencies-radius';
  const geoJsonData = createGeoJSONCircle(emergenciesData);

  if (map.current.getSource(sourceId)) {
    (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geoJsonData);
  } else {
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: geoJsonData
    });
    
    map.current.addLayer({
      id: sourceId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': ['get', 'radius'],
        'circle-color': 'rgba(255, 0, 0, 0.2)',
        'circle-stroke-color': 'red',
        'circle-stroke-width': 2
      }
    });
  }
};

  const createGeoJSONCircle = (emergenciesData: Emergency[]): CircleFeatureCollection=> {
    return {
      type: 'FeatureCollection',
      features: emergencies.map(emergency => ({
        type: 'Feature',
        properties: { radius: emergency.radius },
        geometry: {
          type: 'Point',
          coordinates: [emergency.lng, emergency.lat]
        }
      }))
    };
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainer} style={{
        width: '100%',
        height: '500px',
        border: '1px solid red' // Для визуальной проверки
      }}/>
      
      {/* Легенда */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md z-10 flex flex-col gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Чрезвычайные ситуации</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">События</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Точки сбора</span>
        </div>
      </div>
    </div>
  );
};

export default Map;