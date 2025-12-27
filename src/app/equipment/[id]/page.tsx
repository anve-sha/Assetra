import Link from 'next/link';
import { notFound } from 'next/navigation';
import { equipment, requests, technicians, teams } from '@/lib/data';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EquipmentDetailClient } from '@/components/equipment/equipment-detail-client';
import { AppShell } from '@/components/layout/app-shell';

export default async function EquipmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = equipment.find((e) => e.id === params.id);

  if (!item) {
    notFound();
  }

  const maintenanceHistory = requests.filter((r) => r.equipmentId === item.id);
  const team = teams.find((t) => t.id === item.maintenanceTeamId);
  const defaultTechnician = technicians.find(t => t.id === item.defaultTechnicianId);

  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/equipment">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{item.name}</h2>
        </div>
        <EquipmentDetailClient
          equipment={item}
          maintenanceHistory={maintenanceHistory}
          team={team}
          defaultTechnician={defaultTechnician}
        />
      </div>
    </AppShell>
  );
}
