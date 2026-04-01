import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PatientMapProps {
  lat: number;
  lng: number;
  geofence?: { center: { lat: number; lng: number }; radiusMeters: number };
  className?: string;
}

export function PatientMap({ lat, lng, geofence, className = 'h-[400px]' }: PatientMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markerRef.current = L.marker([lat, lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup('Patient Location');

    if (geofence) {
      circleRef.current = L.circle([geofence.center.lat, geofence.center.lng], {
        radius: geofence.radiusMeters,
        color: 'hsl(217 91% 60%)',
        fillColor: 'hsl(217 91% 60%)',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '8 4',
      }).addTo(map);
    }

    mapRef.current = map;

    return () => {
      circleRef.current = null;
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const position: L.LatLngExpression = [lat, lng];
    markerRef.current.setLatLng(position);
    mapRef.current.setView(position);
  }, [lat, lng]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (geofence) {
      circleRef.current = L.circle([geofence.center.lat, geofence.center.lng], {
        radius: geofence.radiusMeters,
        color: 'hsl(217 91% 60%)',
        fillColor: 'hsl(217 91% 60%)',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '8 4',
      }).addTo(mapRef.current);
    }
  }, [geofence]);

  return <div ref={containerRef} className={`${className} rounded-lg`} aria-label="Patient location map" />;
}
