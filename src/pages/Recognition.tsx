import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusCard } from '@/components/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { knownPersons, getRecognitionHistory } from '@/lib/mockData';
import type { KnownPerson, RecognitionEvent } from '@/lib/types';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Recognition() {
  const [persons, setPersons] = useState<KnownPerson[]>(knownPersons);
  const [history] = useState<RecognitionEvent[]>(getRecognitionHistory());
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation) return;
    const newPerson: KnownPerson = {
      id: crypto.randomUUID(),
      name,
      relation,
      photoUrl: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=150`,
      addedAt: new Date().toISOString(),
    };
    setPersons([...persons, newPerson]);
    setName('');
    setRelation('');
    setPhotoUrl('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading">Person Recognition</h2>
          <p className="text-muted-foreground text-sm">Manage known persons and view recognition history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <StatusCard title="Add Person" icon={UserPlus}>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input id="name" placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="relation" className="text-xs">Relation</Label>
                <Input id="relation" placeholder="e.g. Daughter" value={relation} onChange={(e) => setRelation(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="photo" className="text-xs">Photo URL (optional)</Label>
                <Input id="photo" placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Add Person</Button>
            </form>
          </StatusCard>

          {/* Known Persons Grid */}
          <div className="lg:col-span-2">
            <StatusCard title="Known Persons" icon={Users}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {persons.map((person, i) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
                      <div className="aspect-square relative">
                        <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-3 text-center">
                        <p className="font-semibold text-sm text-foreground">{person.name}</p>
                        <Badge variant="secondary" className="text-[10px] mt-1">{person.relation}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </StatusCard>
          </div>
        </div>

        {/* Recognition History */}
        <StatusCard title="Recognition History" icon={Clock}>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Relation</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <img src={event.photoUrl} alt={event.personName} className="w-8 h-8 rounded-full object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{event.personName}</TableCell>
                    <TableCell className="text-muted-foreground">{event.relation}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(event.timestamp)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={event.confidence > 0.9 ? 'default' : 'secondary'} className="text-[10px]">
                        {(event.confidence * 100).toFixed(0)}%
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
