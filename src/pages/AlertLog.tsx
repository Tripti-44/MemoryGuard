import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusCard } from '@/components/StatusCard';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAlerts } from '@/lib/mockData';
import type { Alert } from '@/lib/types';

const alertTypeLabels: Record<Alert['type'], string> = {
  fall: 'Fall Detected',
  unknown_person: 'Unknown Person',
  geofence_breach: 'Geofence Breach',
};

const alertTypeColors: Record<Alert['type'], string> = {
  fall: 'bg-destructive text-destructive-foreground',
  unknown_person: 'bg-warning text-warning-foreground',
  geofence_breach: 'bg-primary text-primary-foreground',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AlertLog() {
  const [alerts] = useState<Alert[]>(getAlerts());
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return alerts;
    return alerts.filter((a) => a.type === typeFilter);
  }, [alerts, typeFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading">Alert Log</h2>
            <p className="text-muted-foreground text-sm">Complete history of all patient alerts</p>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="fall">Fall Detected</SelectItem>
              <SelectItem value="unknown_person">Unknown Person</SelectItem>
              <SelectItem value="geofence_breach">Geofence Breach</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <StatusCard title={`Alerts (${filtered.length})`} icon={AlertTriangle}>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>GPS</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge className={`text-[10px] ${alertTypeColors[alert.type]}`}>
                        {alertTypeLabels[alert.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{alert.message}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(alert.timestamp)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={alert.status === 'acknowledged' ? 'default' : 'secondary'} className="text-[10px]">
                        {alert.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </StatusCard>
      </div>
    </DashboardLayout>
  );
}
