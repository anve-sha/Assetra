import { equipment } from '@/lib/data';
import { EquipmentClientPage } from '@/components/equipment/equipment-client-page';
import { AppShell } from '@/components/layout/app-shell';

export default function EquipmentPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Equipment</h2>
        </div>
        <EquipmentClientPage allEquipment={equipment} />
      </div>
    </AppShell>
  );
}
