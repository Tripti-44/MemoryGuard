import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, UserCheck, Wifi, WifiOff, Camera, Navigation, Radio, Gauge } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PatientMap } from '@/components/PatientMap';
import { StatusCard } from '@/components/StatusCard';
import { Badge } from '@/components/ui/badge';
import { getPatientLocation, getFallDetectionStatus, getLastRecognitionEvent, getDeviceStatus, getAlerts } from '@/lib/mockData';
import type { PatientLocation, FallDetectionStatus, RecognitionEvent, DeviceStatus, Alert } from '@/lib/types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const alertTypeColors: Record<Alert['type'], string> = {
  fall: 'bg-destructive text-destructive-foreground',
  unknown_person: 'bg-warning text-warning-foreground',
  geofence_breach: 'bg-primary text-primary-foreground',
};

const deviceIcons: Record<string, React.ElementType> = {
  camera: Camera,
  gps: Navigation,
  gsm: Radio,
  accelerometer: Gauge,
};

export default function Dashboard() {
  const [location, setLocation] = useState<PatientLocation>(getPatientLocation());
  const [fallStatus, setFallStatus] = useState<FallDetectionStatus>(getFallDetectionStatus());
  const [recognition, setRecognition] = useState<RecognitionEvent>(getLastRecognitionEvent());
  const [devices, setDevices] = useState<DeviceStatus>(getDeviceStatus());
  const [alerts] = useState<Alert[]>(getAlerts().slice(0, 5));

  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(getPatientLocation());
      setFallStatus(getFallDetectionStatus());
      setDevices(getDeviceStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecognition(getLastRecognitionEvent());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading">Live Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time patient monitoring overview</p>
        </div>

        {/* Device Status */}
        <div className="flex flex-wrap gap-3">
          {(Object.keys(deviceIcons) as (keyof DeviceStatus)[]).map((key) => {
            if (key === 'lastChecked') return null;
            const online = devices[key] as boolean;
            const Icon = deviceIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  online ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="capitalize">{key}</span>
                {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              </motion.div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - takes 2 cols */}
          <div className="lg:col-span-2">
            <StatusCard title="GPS Location" icon={MapPin}>
              <PatientMap lat={location.lat} lng={location.lng} className="h-[350px]" />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                <span>Speed: {location.speed.toFixed(1)} km/h</span>
                <span>Updated: {formatTime(location.timestamp)}</span>
              </div>
            </StatusCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Fall Detection */}
            <StatusCard title="Fall Detection" icon={Activity}>
              <div className="text-center py-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  fallStatus.status === 'safe'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  <Activity className="w-8 h-8" />
                </div>
                <p className={`text-xl font-bold font-heading ${
                  fallStatus.status === 'safe' ? 'text-success' : 'text-destructive'
                }`}>
                  {fallStatus.status === 'safe' ? 'Safe' : 'Fall Detected!'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last checked: {formatTime(fallStatus.timestamp)}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>X: {fallStatus.accelerometerData.x}</div>
                  <div>Y: {fallStatus.accelerometerData.y}</div>
                  <div>Z: {fallStatus.accelerometerData.z}</div>
                </div>
              </div>
            </StatusCard>

            {/* Last Recognition */}
            <StatusCard title="Last Recognition" icon={UserCheck}>
              <div className="flex items-center gap-4">
                <img
                  src={recognition.photoUrl}
                  alt={recognition.personName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <p className="font-semibold text-foreground">{recognition.personName}</p>
                  <p className="text-xs text-muted-foreground">{recognition.relation}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(recognition.timestamp)}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">
                    {(recognition.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              </div>
            </StatusCard>
          </div>
        </div>

        {/* Recent Alerts */}
        <StatusCard title="Recent Alerts" icon={Activity}>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge className={`text-[10px] ${alertTypeColors[alert.type]}`}>
                    {alert.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-foreground">{alert.message}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {formatDateTime(alert.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </StatusCard>
      </div>
    </DashboardLayout>
  );
}
