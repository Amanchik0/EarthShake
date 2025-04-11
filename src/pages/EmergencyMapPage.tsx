import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw";

const KazakhstanMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [67.5, 48],
      zoom: 4.5,
      maxBounds: [
        [46, 40],
        [87, 56],
      ],
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("Карта загружена!");

      map.addSource("kazakhstan-regions", {
        type: "geojson",
        data: "/data/gadm41_KAZ_1_fixed.json",
      });

      map.addLayer({
        id: "regions-layer",
        type: "fill",
        source: "kazakhstan-regions",
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#ffcc00",
            "#0080ff"
          ],
          "fill-opacity": 0.5,
          "fill-outline-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "regions-outline",
        type: "line",
        source: "kazakhstan-regions",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
      });

      map.addSource("kazakhstan-districts", {
        type: "geojson",
        data: "/data/gadm41_KAZ_2_fixed.json",
      });

      map.addLayer({
        id: "districts-layer",
        type: "fill",
        source: "kazakhstan-districts",
        paint: {
          "fill-color": "#00ff80",
          "fill-opacity": 0.5,
          "fill-outline-color": "#000000",
        },
        layout: {
          visibility: "none",
        },
      });

      map.addLayer({
        id: "districts-outline",
        type: "line",
        source: "kazakhstan-districts",
        paint: {
          "line-color": "#000000",
          "line-width": 1,
        },
        layout: {
          visibility: "none",
        },
      });

      let hoveredRegionId: number | null = null;

      map.on("mousemove", "regions-layer", (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredRegionId !== null) {
            map.setFeatureState(
              { source: "kazakhstan-regions", id: hoveredRegionId },
              { hover: false }
            );
          }
          hoveredRegionId = e.features[0].id as number;
          map.setFeatureState(
            { source: "kazakhstan-regions", id: hoveredRegionId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "regions-layer", () => {
        if (hoveredRegionId !== null) {
          map.setFeatureState(
            { source: "kazakhstan-regions", id: hoveredRegionId },
            { hover: false }
          );
        }
        hoveredRegionId = null;
      });

      const handleRegionClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (!e.features || e.features.length === 0) return;

        const regionName = e.features[0].properties?.NAME_1 ?? null;
        const coordinates = e.lngLat;

        console.log("Выбрана область:", regionName);
        console.log("Координаты клика:", coordinates);

        if (!regionName) return;

        setSelectedRegion(regionName);

        if (map.getLayer("regions-layer")) {
          map.setLayoutProperty("regions-layer", "visibility", "none");
        }

        if (map.getLayer("regions-outline")) {
          map.setLayoutProperty("regions-outline", "visibility", "none");
        }

        if (map.getLayer("districts-layer")) {
          map.setLayoutProperty("districts-layer", "visibility", "visible");
        }

        if (map.getLayer("districts-outline")) {
          map.setLayoutProperty("districts-outline", "visibility", "visible");
        }

        setTimeout(() => {
          map.easeTo({
            center: [coordinates.lng, coordinates.lat],
            zoom: 4.5,
            duration:1000
          });
        }, 500);
      };

      const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
        if (e.defaultPrevented) return;

        if (map.getLayer("regions-layer")) map.setLayoutProperty("regions-layer", "visibility", "visible");
        if (map.getLayer("regions-outline")) map.setLayoutProperty("regions-outline", "visibility", "visible");

        if (map.getLayer("districts-layer")) map.setLayoutProperty("districts-layer", "visibility", "none");
        if (map.getLayer("districts-outline")) map.setLayoutProperty("districts-outline", "visibility", "none");

        map.flyTo({
          center: [67.5, 48],
          zoom: 4.5,
        });
      };

      map.on("click", "regions-layer", handleRegionClick);
      map.on("click", handleMapClick);

      return () => {
        map.off("click", "regions-layer", handleRegionClick);
        map.off("click", handleMapClick);
      };
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: "30%", height: "20%" }} />;
};

export default KazakhstanMap;
