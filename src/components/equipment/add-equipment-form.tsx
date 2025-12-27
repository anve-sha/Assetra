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
import type { Team, Technician } from '@/lib/types';
import { addEquipment } from '@/actions/add-equipment';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  serialNumber: z.string().min(3, 'Serial number must be at least 3 characters long.'),
  location: z.string().min(3, 'Location must be at least 3 characters long.'),
  department: z.string().min(3, 'Department must be at least 3 characters long.'),
  assignedEmployee: z.string().min(3, 'Assigned employee must be at least 3 characters long.'),
  maintenanceTeamId: z.string().min(1, 'Please select a maintenance team.'),
  defaultTechnicianId: z.string().min(1, 'Please select a default technician.'),
  maintenanceFrequency: z.coerce.number().min(1, 'Maintenance frequency must be at least 1.'),
});

type AddEquipmentFormValues = z.infer<typeof formSchema>;

interface AddEquipmentFormProps {
  teams: Team[];
  technicians: Technician[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddEquipmentForm({
  teams,
  technicians,
  onSuccess,
  onCancel,
}: AddEquipmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<AddEquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      serialNumber: '',
      location: '',
      department: '',
      assignedEmployee: '',
      maintenanceTeamId: '',
      defaultTechnicianId: '',
      maintenanceFrequency: 30,
    },
  });

  const onSubmit = (values: AddEquipmentFormValues) => {
    startTransition(async () => {
      const result = await addEquipment(values);
      if (result.error) {
        toast({
          title: 'Error adding equipment',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Equipment Added',
          description: `'${result.data?.name}' has been successfully added.`,
        });
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Industrial Pump X-1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SN-IPX1000-2023-01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Floor 1, Sector A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Manufacturing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedEmployee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Employee</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenanceFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Frequency (Days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenanceTeamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Team</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
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
            name="defaultTechnicianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Technician</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a technician" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Equipment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
