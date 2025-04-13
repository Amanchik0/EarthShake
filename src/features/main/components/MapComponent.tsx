    import React, { useEffect, useRef } from "react";
    import mapboxgl from "mapbox-gl";

    mapboxgl.accessToken = "pk.eyJ1IjoiYW56b24iLCJhIjoiY202cWFhNW5qMGViaDJtc2J2eXhtZTdraCJ9.V7DT16ZhFkjt88aEWYRNiw";

    const MapComponent = ({ onRegionSelect }: { onRegionSelect: (region: string) => void }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

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

        let hoveredRegionId: number | null = null;

        map.on("mousemove", "regions-layer", (e) => {
            if (Array.isArray(e.features) && e.features.length > 0) {
            if (hoveredRegionId !== null) {
                map.setFeatureState(
                { source: "kazakhstan-regions", id: hoveredRegionId },
                { hover: false }
                );
            }
            const featureId = e.features[0].id;
            if (typeof featureId === "number") {
                hoveredRegionId = featureId;
                map.setFeatureState(
                { source: "kazakhstan-regions", id: hoveredRegionId },
                { hover: true }
                );
            }
            }
        });
        
        map.on("click", "regions-layer", (e) => {
            if (!Array.isArray(e.features) || e.features.length === 0) return;
            const regionName = e.features[0].properties?.NAME_1 || null;
            if (regionName) {
            onRegionSelect(regionName);
            }
        });
        
        
        map.on("click", "regions-layer", (e) => {
            if (!Array.isArray(e.features) || e.features.length === 0) return;
            const regionName = e.features[0].properties?.NAME_1 || null;
            if (regionName) {
            onRegionSelect(regionName);
            }
        });
        

        map.on("click", "regions-layer", (e) => {
            if (!e.features?.length) return;
            const regionName = e.features[0].properties?.NAME_1 || null;
            if (regionName) {
            onRegionSelect(regionName);
            }
        });
        });

        return () => map.remove();
    }, [onRegionSelect]);

    return <div ref={mapContainerRef} style={{ width: "100%", height: "900px" }} />;
    };

    export default MapComponent;
