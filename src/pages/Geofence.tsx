import { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, ShieldAlert } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusCard } from '@/components/StatusCard';
import { PatientMap } from '@/components/PatientMap';
import { Badge } from '@/components/ui/badge';
import { getPatientLocation, geofenceZone } from '@/lib/mockData';
import type { PatientLocation } from '@/lib/types';

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Geofence() {
  const [location, setLocation] = useState<PatientLocation>(getPatientLocation());

  useEffect(() => {
    const interval = setInterval(() => setLocation(getPatientLocation()), 5000);
    return () => clearInterval(interval);
  }, []);

  const distance = getDistanceMeters(location.lat, location.lng, geofenceZone.center.lat, geofenceZone.center.lng);
  const isInside = distance <= geofenceZone.radiusMeters;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading">Geofence View</h2>
          <p className="text-muted-foreground text-sm">Safe zone boundary and patient position</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <StatusCard title="Safe Zone Map" icon={MapPin}>
              <PatientMap lat={location.lat} lng={location.lng} geofence={geofenceZone} className="h-[500px]" />
            </StatusCard>
          </div>

          <div className="space-y-6">
            <StatusCard title="Zone Status" icon={isInside ? ShieldCheck : ShieldAlert}>
              <div className="text-center py-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  isInside ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {isInside ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                </div>
                <p className={`text-lg font-bold font-heading ${isInside ? 'text-success' : 'text-destructive'}`}>
                  {isInside ? 'Inside Safe Zone' : 'Outside Safe Zone!'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {distance.toFixed(0)}m from center
                </p>
              </div>
            </StatusCard>

            <StatusCard title="Zone Details" icon={MapPin}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Radius</span>
                  <span className="font-medium">{geofenceZone.radiusMeters}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Center</span>
                  <span className="font-mono text-xs">{geofenceZone.center.lat.toFixed(4)}, {geofenceZone.center.lng.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={isInside ? 'default' : 'destructive'} className="text-[10px]">
                    {isInside ? 'Safe' : 'Alert'}
                  </Badge>
                </div>
              </div>
            </StatusCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
