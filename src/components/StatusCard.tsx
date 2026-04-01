import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function StatusCard({ title, icon: Icon, children, className = '' }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`shadow-card hover:shadow-elevated transition-shadow ${className}`}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
          </div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
