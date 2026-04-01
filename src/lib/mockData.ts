import { PatientLocation, FallDetectionStatus, RecognitionEvent, KnownPerson, DeviceStatus, Alert, GeofenceZone } from './types';

const BASE_LAT = 13.0827;
const BASE_LNG = 80.2707;

const randomOffset = () => (Math.random() - 0.5) * 0.002;

export const getPatientLocation = (): PatientLocation => ({
  lat: BASE_LAT + randomOffset(),
  lng: BASE_LNG + randomOffset(),
  timestamp: new Date().toISOString(),
  speed: Math.random() * 3,
});

export const getFallDetectionStatus = (): FallDetectionStatus => ({
  status: Math.random() > 0.9 ? 'fall_detected' : 'safe',
  timestamp: new Date().toISOString(),
  accelerometerData: {
    x: +(Math.random() * 2 - 1).toFixed(2),
    y: +(Math.random() * 2 - 1).toFixed(2),
    z: +(9.8 + Math.random() * 0.5 - 0.25).toFixed(2),
  },
});

export const getDeviceStatus = (): DeviceStatus => ({
  camera: Math.random() > 0.05,
  gps: Math.random() > 0.05,
  gsm: Math.random() > 0.1,
  accelerometer: Math.random() > 0.05,
  lastChecked: new Date().toISOString(),
});

const familyPhotos = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
];

export const knownPersons: KnownPerson[] = [
  { id: '1', name: 'Priya Sharma', relation: 'Daughter', photoUrl: familyPhotos[0], addedAt: '2025-12-01T10:00:00Z' },
  { id: '2', name: 'Dr. Rajesh Kumar', relation: 'Doctor', photoUrl: familyPhotos[1], addedAt: '2025-12-02T14:30:00Z' },
  { id: '3', name: 'Anita Devi', relation: 'Wife', photoUrl: familyPhotos[2], addedAt: '2025-11-28T09:00:00Z' },
  { id: '4', name: 'Vikram Sharma', relation: 'Son', photoUrl: familyPhotos[3], addedAt: '2025-12-05T16:00:00Z' },
  { id: '5', name: 'Nurse Meera', relation: 'Caretaker', photoUrl: familyPhotos[4], addedAt: '2025-12-10T08:00:00Z' },
];

export const getLastRecognitionEvent = (): RecognitionEvent => {
  const person = knownPersons[Math.floor(Math.random() * knownPersons.length)];
  return {
    id: crypto.randomUUID(),
    personName: person.name,
    relation: person.relation,
    photoUrl: person.photoUrl,
    timestamp: new Date().toISOString(),
    confidence: +(0.75 + Math.random() * 0.24).toFixed(2),
  };
};

export const getRecognitionHistory = (): RecognitionEvent[] => {
  const events: RecognitionEvent[] = [];
  for (let i = 0; i < 20; i++) {
    const person = knownPersons[Math.floor(Math.random() * knownPersons.length)];
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 30 - Math.floor(Math.random() * 15));
    events.push({
      id: crypto.randomUUID(),
      personName: person.name,
      relation: person.relation,
      photoUrl: person.photoUrl,
      timestamp: date.toISOString(),
      confidence: +(0.7 + Math.random() * 0.29).toFixed(2),
    });
  }
  return events;
};

const alertTypes: Alert['type'][] = ['fall', 'unknown_person', 'geofence_breach'];
const alertMessages: Record<Alert['type'], string> = {
  fall: 'Fall detected — patient may need assistance',
  unknown_person: 'Unknown person detected near patient',
  geofence_breach: 'Patient has left the safe zone',
};

export const getAlerts = (): Alert[] => {
  const alerts: Alert[] = [];
  for (let i = 0; i < 30; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const date = new Date();
    date.setHours(date.getHours() - i * 2 - Math.floor(Math.random() * 3));
    alerts.push({
      id: crypto.randomUUID(),
      type,
      timestamp: date.toISOString(),
      lat: BASE_LAT + randomOffset(),
      lng: BASE_LNG + randomOffset(),
      status: Math.random() > 0.3 ? 'sent' : 'acknowledged',
      message: alertMessages[type],
    });
  }
  return alerts;
};

export const geofenceZone: GeofenceZone = {
  center: { lat: BASE_LAT, lng: BASE_LNG },
  radiusMeters: 200,
};

export const patientInfo = {
  name: 'Ramesh Sharma',
  age: 72,
  condition: "Alzheimer's — Stage 3",
  caretaker: 'Priya Sharma',
};
