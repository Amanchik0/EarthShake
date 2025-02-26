import React, { useEffect } from 'react';
//надо потом типы маркеров с https://developers.google.com/maps/documentation/javascript/examples/overlay-symbol-animate брать и сделать норм по ссылке норм визуал есть 
interface AdvancedMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  iconUrl?: string;
  onClick?: () => void;
}

const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({ map, position, iconUrl, onClick }) => {
  useEffect(() => {
    if (!map) return;

    const markerContent = document.createElement('div');
    markerContent.style.display = 'flex';
    markerContent.style.alignItems = 'center';
    markerContent.style.justifyContent = 'center';

    if (iconUrl) {
      const img = document.createElement('img');
      img.src = iconUrl;
      img.style.width = '32px';
      img.style.height = '32px';
      markerContent.appendChild(img);
    } else {
      markerContent.textContent = '•';
      markerContent.style.fontSize = '32px';
      markerContent.style.color = 'red';
    }

    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerContent,
    });

    if (onClick) {
      advancedMarker.addListener('click', onClick);
    }

    return () => {
      advancedMarker.remove();
    };
  }, [map, position, iconUrl, onClick]);

  return null;
};

export default AdvancedMarker;
