
'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import type { Equipment } from '@/lib/types';
import { schedulePreventiveTask } from '@/actions/schedule-preventive-task';

const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters long.'),
  equipmentId: z.string().min(1, 'Please select an equipment.'),
  priority: z.enum(['High', 'Medium', 'Low']),
});

type ScheduleTaskFormValues = z.infer<typeof formSchema>;

interface ScheduleTaskFormProps {
  scheduledDate: Date;
  allEquipment: Equipment[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleTaskForm({
  scheduledDate,
  allEquipment,
  onSuccess,
  onCancel,
}: ScheduleTaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ScheduleTaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      equipmentId: '',
      priority: 'Medium',
    },
  });

  const onSubmit = (values: ScheduleTaskFormValues) => {
    startTransition(async () => {
      const result = await schedulePreventiveTask({
        ...values,
        scheduledDate,
      });
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Task Scheduled',
          description: `Preventive maintenance for '${result.data?.subject}' has been scheduled.`,
        });
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="equipmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Annual Inspection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
