
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  requests,
  teams,
} from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import { RequestsByTeamChart } from '@/components/dashboard/requests-by-team-chart';
import { EquipmentHealthChart } from '@/components/dashboard/equipment-health-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Chatbot } from '@/components/support/chatbot';
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  New: 'bg-blue-500',
  'In Progress': 'bg-yellow-500',
};

export default function DashboardPage() {
  const openRequests = 18;
  const overdueTasks = 7;
  const totalTeams = teams.length;
  
  const recentRequests = [...requests]
    .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
    .slice(0, 5);

  return (
    <AppShell>
    <div className="flex-1 space-y-6 pt-6 p-4 sm:p-6">
       <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Requests"
          value={openRequests.toString()}
          accentColor="border-l-blue-500"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.toString()}
          accentColor="border-l-red-500"
        />
        <StatCard
          title="Total Teams"
          value={totalTeams.toString()}
          accentColor="border-l-yellow-500"
        />
        <StatCard
          title="Overall Health"
          value="Good"
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          accentColor="border-l-green-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Requests by Team</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <RequestsByTeamChart />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Equipment Health Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <EquipmentHealthChart />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Recent Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Scheduled</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentRequests.map((request) => (
                        <TableRow key={request.id} className="table-row-border hover:bg-transparent">
                        <TableCell className="py-3 font-medium">{request.subject}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", statusColors[request.status.replace('_', ' ')] || 'bg-gray-400')} />
                            <span className="capitalize">{request.status.replace('_', ' ')}</span>
                            </div>
                        </TableCell>
                        <TableCell className="py-3 capitalize">{request.type}</TableCell>
                        <TableCell className="py-3 hidden md:table-cell">
                            {new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
    <Chatbot />
    </AppShell>
  );
}
