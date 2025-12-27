import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  icon?: ReactNode;
  accentColor?: string;
};

export function StatCard({ title, value, icon, accentColor }: StatCardProps) {
  return (
    <Card className={cn('border-l-4', accentColor)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold flex items-center gap-2">
          {value}
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
