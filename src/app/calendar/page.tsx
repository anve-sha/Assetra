import { MaintenanceCalendar } from '@/components/calendar/maintenance-calendar';
import { AppShell } from '@/components/layout/app-shell';

export default function CalendarPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <div className="flex items-center justify-between space-y-2 mb-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Scheduler
          </h2>
        </div>
        <div className="flex justify-center">
          <MaintenanceCalendar />
        </div>
      </div>
    </AppShell>
  );
}
