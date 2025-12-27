import type { MaintenanceRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function MaintenanceHistory({ items }: { items: MaintenanceRequest[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No maintenance history found.
      </p>
    );
  }

  const sortedItems = [...items].sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  
  const statusColors: { [key: string]: string } = {
    new: 'border-status-new-text',
    in_progress: 'border-status-progress-text',
    repaired: 'border-status-repaired-text',
    scrap: 'border-status-scrap-text',
  };

  const statusBadgeColors: { [key: string]: string } = {
    new: 'bg-status-new-bg text-status-new-text',
    in_progress: 'bg-status-progress-bg text-status-progress-text',
    repaired: 'bg-status-repaired-bg text-status-repaired-text',
    scrap: 'bg-status-scrap-bg text-status-scrap-text',
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
      <div className="space-y-8">
        {sortedItems.map((item) => (
          <div key={item.id} className="relative flex items-start">
            <div className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-background border-2 ${statusColors[item.status]} -translate-x-1/2`}></div>
            <div className="ml-6 w-full">
              <div className="flex justify-between items-center">
                <p className="font-medium">{item.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {item.scheduledDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Type: <Badge variant="secondary" className='capitalize font-medium'>{item.type}</Badge> | Status: <Badge variant="outline" className={cn('capitalize font-semibold border-0', statusBadgeColors[item.status])}>{item.status.replace('_', ' ')}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
