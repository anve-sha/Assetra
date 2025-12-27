'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit } from 'lucide-react';
import type { Equipment, MaintenanceRequest, Team, Technician } from '@/lib/types';
import { MaintenanceHistory } from './maintenance-history';
import { getHealthScore } from '@/actions/get-health-score';
import { useToast } from '@/hooks/use-toast';
import { AddRequestModal } from '@/components/requests/add-request-modal';
import { equipment as allEquipment } from '@/lib/data';
import { cn } from '@/lib/utils';


type HealthScore = 'Good' | 'Warning' | 'Critical' | null;

export function EquipmentDetailClient({
  equipment,
  maintenanceHistory,
  team,
  defaultTechnician
}: {
  equipment: Equipment;
  maintenanceHistory: MaintenanceRequest[];
  team?: Team;
  defaultTechnician?: Technician;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [healthScore, setHealthScore] = useState<HealthScore>(null);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);


  const breakdownFrequency = maintenanceHistory.filter(
    (r) => r.type === 'corrective' && r.status !== 'new'
  ).length;
  const overdueTasks = maintenanceHistory.filter(
    (r) =>
      (r.status === 'new' || r.status === 'in_progress') &&
      r.scheduledDate < new Date()
  ).length;

  const handleCalculateHealth = () => {
    startTransition(async () => {
      const result = await getHealthScore({ breakdownFrequency, overdueTasks });
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setHealthScore(null);
      } else if (result.data) {
        setHealthScore(result.data.healthScore as HealthScore);
        toast({
          title: 'Health Score Calculated',
          description: `AI has determined the equipment health is '${result.data.healthScore}'.`,
        });
      }
    });
  };
  
  const healthScoreColors: Record<string, string> = {
    Good: 'bg-status-repaired-bg text-status-repaired-text',
    Warning: 'bg-status-progress-bg text-status-progress-text',
    Critical: 'bg-status-scrap-bg text-status-scrap-text',
  };
  
  const statusClasses = equipment.isScrapped ? 'bg-status-scrap-bg text-status-scrap-text' : 'bg-status-repaired-bg text-status-repaired-text';


  return (
    <>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p>{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p>{equipment.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Employee</p>
                <p>{equipment.assignedEmployee}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance Team</p>
                <p>{team?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Default Technician</p>
                <p>{defaultTechnician?.name || 'N/A'}</p>
              </div>
            </div>
            <Separator />
             <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <Badge variant={"outline"} className={cn('border-0 font-semibold', statusClasses)}>
                   {equipment.isScrapped ? 'Scrapped' : 'Active'}
                </Badge>
              </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceHistory items={maintenanceHistory} />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative h-60 w-full">
            <Image
              src={equipment.imageUrl}
              alt={equipment.name}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={equipment.imageHint}
            />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipment Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Breakdown Frequency</span>
                <span className="font-medium">{breakdownFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overdue Tasks</span>
                <span className="font-medium">{overdueTasks}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Health Score</span>
              {healthScore ? (
                <Badge className={cn('text-base font-semibold border-0', healthScoreColors[healthScore])}>
                  {healthScore}
                </Badge>
              ) : (
                <Badge variant="outline">Not Calculated</Badge>
              )}
            </div>
            <Button
              onClick={handleCalculateHealth}
              disabled={isPending}
              className="w-full"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              {isPending ? 'Calculating...' : 'Calculate with AI'}
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
            <Button 
                className="w-full" 
                disabled={equipment.isScrapped}
                onClick={() => setIsReportIssueOpen(true)}
            >
                Report Issue
            </Button>
            </CardContent>
        </Card>
      </div>
    </div>
    <AddRequestModal
        isOpen={isReportIssueOpen}
        onClose={() => setIsReportIssueOpen(false)}
        allEquipment={allEquipment}
        onSuccess={() => {
          setIsReportIssueOpen(false);
          // A full refresh is a simple way to ensure all data is up to date
          window.location.reload();
        }}
        initialEquipmentId={equipment.id}
      />
    </>
  );
}
