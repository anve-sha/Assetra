'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Equipment, MaintenanceRequest, Team, Technician } from '@/lib/types';
import { teams, technicians } from '@/lib/data';
import { reportIssue } from '@/actions/report-issue';
import { schedulePreventiveTask } from '@/actions/schedule-preventive-task';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters long.'),
  equipmentId: z.string().min(1, 'Please select an equipment.'),
  type: z.enum(['corrective', 'preventive']),
  scheduledDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  allEquipment: Equipment[];
  onSuccess: (newRequest: MaintenanceRequest) => void;
  initialEquipmentId?: string;
}

export function AddRequestModal({
  isOpen,
  onClose,
  allEquipment,
  onSuccess,
  initialEquipmentId,
}: AddRequestModalProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [assignedTeam, setAssignedTeam] = useState<Team | null>(null);
  const [assignedTechnician, setAssignedTechnician] = useState<Technician | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      equipmentId: initialEquipmentId || '',
      type: 'corrective',
      scheduledDate: undefined,
    },
  });

  const selectedType = form.watch('type');
  const selectedEquipmentId = form.watch('equipmentId');

  useEffect(() => {
    if (initialEquipmentId) {
      form.setValue('equipmentId', initialEquipmentId);
    }
  }, [initialEquipmentId, form]);

  useEffect(() => {
    if (selectedEquipmentId) {
      const equipment = allEquipment.find((eq) => eq.id === selectedEquipmentId);
      if (equipment) {
        setSelectedEquipment(equipment);
        const team = teams.find((t) => t.id === equipment.maintenanceTeamId);
        setAssignedTeam(team || null);
        const tech = technicians.find((t) => t.id === equipment.defaultTechnicianId);
        setAssignedTechnician(tech || null);
      }
    } else {
      setSelectedEquipment(null);
      setAssignedTeam(null);
      setAssignedTechnician(null);
    }
  }, [selectedEquipmentId, allEquipment]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const commonPayload = {
        subject: values.subject,
        equipmentId: values.equipmentId,
        priority: 'Medium' as 'Medium', // Defaulting priority
      };

      let result;
      if (values.type === 'preventive') {
        if (!values.scheduledDate) {
          toast({ title: 'Error', description: 'Scheduled date is required for preventive tasks.', variant: 'destructive' });
          return;
        }
        result = await schedulePreventiveTask({ ...commonPayload, scheduledDate: values.scheduledDate });
      } else {
        result = await reportIssue({ ...commonPayload, createdBy: 'User' });
      }

      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else if (result.data) {
        toast({ title: 'Success', description: 'Maintenance request created successfully.' });
        onSuccess(result.data);
        handleClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new maintenance request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Strange noise from main motor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an equipment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allEquipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Request Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="corrective" />
                        </FormControl>
                        <FormLabel className="font-normal">Corrective</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="preventive" />
                        </FormControl>
                        <FormLabel className="font-normal">Preventive</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedEquipment && (
              <div className="space-y-2 rounded-md border bg-muted/50 p-3">
                 <p className="text-xs text-muted-foreground">Auto-assigned based on equipment:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Team:</span> {assignedTeam?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Technician:</span> {assignedTechnician?.name || 'N/A'}
                  </div>
                </div>
              </div>
            )}
            
            {selectedType === 'preventive' && (
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Scheduled Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
