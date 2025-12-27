import { KanbanBoard } from '@/components/requests/kanban-board';
import { requests, equipment, technicians } from '@/lib/data';
import { AppShell } from '@/components/layout/app-shell';
import { AddRequestButton } from '@/components/requests/add-request-button';

export default function RequestsPage() {
  const enrichedRequests = requests.map(req => {
    const eq = equipment.find(e => e.id === req.equipmentId);
    const tech = technicians.find(t => t.id === req.technicianId);
    return {
      ...req,
      equipmentName: eq?.name || 'Unknown Equipment',
      technicianName: tech?.name || 'Unassigned',
    };
  });

  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Maintenance Requests</h2>
            <p className="text-muted-foreground">
              Manage all your maintenance tasks.
            </p>
          </div>
          <AddRequestButton allEquipment={equipment} />
        </div>
        <KanbanBoard initialRequests={enrichedRequests} allEquipment={equipment} />
      </div>
    </AppShell>
  );
}
