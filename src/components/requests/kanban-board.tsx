'use client';

import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MaintenanceRequest, UserRole, Equipment } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { AddRequestModal } from './add-request-modal';
import { technicians } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from '@/hooks/use-mobile';


type EnrichedRequest = MaintenanceRequest & {
  equipmentName: string;
  technicianName: string;
};

const columns = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'repaired', title: 'Repaired', color: 'bg-green-500' },
  { id: 'scrap', title: 'Scrap', color: 'bg-red-500' },
] as const;

type ColumnId = (typeof columns)[number]['id'];

const KanbanCard = ({
  request,
  isDragging,
  role,
}: {
  request: EnrichedRequest;
  isDragging: boolean;
  role: UserRole;
}) => {
  const slaDate = new Date(request.scheduledDate);
  slaDate.setDate(slaDate.getDate() + 2); // Example: SLA is 2 days after scheduled
  const isOverdue = new Date() > slaDate && (request.status === 'new' || request.status === 'in_progress');

  const priorityBorder: Record<string, string> = {
    High: 'border-l-red-500',
    Medium: 'border-l-yellow-500',
    Low: 'border-l-blue-500',
  };
  
  const getCardInfo = () => {
    switch (request.status) {
      case 'new':
      case 'in_progress':
        return (
          <>
            <p>Assigned to: <span className="font-medium">{request.technicianName}</span></p>
            <p>Due: <span className="font-medium text-red-600">{new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span></p>
          </>
        );
      case 'repaired':
         return (
          <>
            <p>Completed by: <span className="font-medium">{request.technicianName}</span></p>
            <p>Fixed on: <span className="font-medium">{new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span></p>
          </>
        );
      case 'scrap':
        return (
          <>
            <p>Reviewed by: <span className="font-medium">{request.technicianName}</span></p>
            <p>Scrapped on: <span className="font-medium">{new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span></p>
          </>
        );
      default:
        return null;
    }
  }


  return (
    <Card
      className={cn(
        'mb-4 cursor-grab active:cursor-grabbing border-l-4 shadow-sm hover:shadow-lg transition-shadow bg-card',
        isDragging && 'opacity-50',
        priorityBorder[request.priority] || 'border-l-gray-300'
      )}
      draggable={role !== 'Employee'}
      onDragStart={(e) => {
        if(role === 'Employee') return;
        e.dataTransfer.setData('text/plain', request.id);
      }}
    >
      <CardContent className="p-4 space-y-2">
        <div>
            <p className="font-semibold text-base leading-tight">{request.subject}</p>
            <p className="text-sm text-muted-foreground">{request.equipmentName}</p>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
            {getCardInfo()}
        </div>

         {isOverdue && (
            <div className="flex items-center gap-1 text-xs text-red-600 font-semibold pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>SLA Overdue</span>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({
  title,
  requests,
  columnId,
  draggedItemId,
  onDrop,
  role,
  color,
}: {
  title: string;
  requests: EnrichedRequest[];
  columnId: ColumnId;
  draggedItemId: string | null;
  onDrop: (columnId: ColumnId) => void;
  role: UserRole;
  color: string;
}) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className='flex-1'
      onDragOver={(e) => {
        if(role === 'Employee') return;
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => {
        setIsOver(false);
      }}
      onDrop={(e) => {
        if(role === 'Employee') return;
        e.preventDefault();
        onDrop(columnId);
        setIsOver(false);
      }}
    >
        <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-3 h-3 rounded-full", color)}></div>
            <h3 className="font-semibold text-lg capitalize">{title.replace('_', ' ')}</h3>
            <Badge variant="secondary" className="font-semibold">{requests.length}</Badge>
        </div>
        <div className={cn(
            'p-1 rounded-lg transition-colors min-h-[500px]',
            isOver && 'bg-slate-200/50 dark:bg-slate-800/50'
        )}>
            {requests.map((req) => (
            <KanbanCard
                key={req.id}
                request={req}
                isDragging={draggedItemId === req.id}
                role={role}
            />
            ))}
      </div>
    </div>
  );
};

export function KanbanBoard({
  initialRequests,
  allEquipment,
}: {
  initialRequests: EnrichedRequest[];
  allEquipment: Equipment[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const role: UserRole = 'Manager'; // Default to manager view
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDrop = (columnId: ColumnId) => {
    if (!draggedItemId) return;
    
    setRequests((prev) =>
      prev.map((req) =>
        req.id === draggedItemId ? { ...req, status: columnId } : req
      )
    );
    setDraggedItemId(null);
  };

  const handleRequestAdded = (newRequest: MaintenanceRequest) => {
    const tech = technicians.find(t => t.id === newRequest.technicianId);
    const eq = allEquipment.find(e => e.id === newRequest.equipmentId);

    const enrichedNewRequest: EnrichedRequest = {
      ...newRequest,
      equipmentName: eq?.name || 'Unknown',
      technicianName: tech?.name || 'Unassigned',
    };
    setRequests(prev => [enrichedNewRequest, ...prev]);
  };

  const requestsByColumn = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = requests.filter((req) => req.status === col.id);
      return acc;
    }, {} as Record<ColumnId, EnrichedRequest[]>);
  }, [requests]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  if (isMobile) {
    return (
      <>
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {columns.map(col => (
               <TabsTrigger key={col.id} value={col.id} className="capitalize">
                {col.title.replace('_', ' ')} ({requestsByColumn[col.id].length})
              </TabsTrigger>
            ))}
          </TabsList>
           {columns.map(col => (
             <TabsContent key={col.id} value={col.id} className="mt-4">
                <div className='space-y-4'>
                {requestsByColumn[col.id].map((req) => (
                  <KanbanCard
                    key={req.id}
                    request={req}
                    isDragging={false}
                    role={role}
                  />
                ))}
                </div>
              </TabsContent>
           ))}
        </Tabs>
        <AddRequestModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            allEquipment={allEquipment}
            onSuccess={handleRequestAdded}
        />
      </>
    )
  }

  return (
    <>
    <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        onDragStart={(e) => {
            if(role === 'Employee') return;
            const target = e.target as HTMLElement;
            const draggableElement = target.closest('[draggable="true"]');
            if (draggableElement) {
                const id = e.dataTransfer.getData('text/plain');
                setDraggedItemId(id);
            }
        }}
        onDragEnd={() => setDraggedItemId(null)}
    >
        {columns.map((col) => (
        <KanbanColumn
            key={col.id}
            title={col.title}
            columnId={col.id}
            requests={requestsByColumn[col.id]}
            draggedItemId={draggedItemId}
            onDrop={handleDrop}
            role={role}
            color={col.color}
        />
        ))}
    </div>
    <AddRequestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        allEquipment={allEquipment}
        onSuccess={handleRequestAdded}
      />
    </>
  );
}
