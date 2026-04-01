export interface PatientLocation {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
}

export interface FallDetectionStatus {
  status: 'safe' | 'fall_detected';
  timestamp: string;
  accelerometerData: { x: number; y: number; z: number };
}

export interface RecognitionEvent {
  id: string;
  personName: string;
  relation: string;
  photoUrl: string;
  timestamp: string;
  confidence: number;
}

export interface KnownPerson {
  id: string;
  name: string;
  relation: string;
  photoUrl: string;
  addedAt: string;
}

export interface DeviceStatus {
  camera: boolean;
  gps: boolean;
  gsm: boolean;
  accelerometer: boolean;
  lastChecked: string;
}

export interface Alert {
  id: string;
  type: 'fall' | 'unknown_person' | 'geofence_breach';
  timestamp: string;
  lat: number;
  lng: number;
  status: 'sent' | 'acknowledged';
  message: string;
}

export interface GeofenceZone {
  center: { lat: number; lng: number };
  radiusMeters: number;
}
