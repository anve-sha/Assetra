
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { equipment, requests, technicians } from '@/lib/data';
import type { MaintenanceRequest } from '@/lib/types';

const schema = z.object({
  subject: z.string().min(3),
  equipmentId: z.string().min(1),
  scheduledDate: z.date(),
  priority: z.enum(['High', 'Medium', 'Low']),
});

type Input = z.infer<typeof schema>;
type ReturnType = {
  data?: MaintenanceRequest;
  error?: string;
};

export async function schedulePreventiveTask(input: Input): Promise<ReturnType> {
  const validatedInput = schema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }

  const { subject, equipmentId, scheduledDate, priority } = validatedInput.data;

  const targetEquipment = equipment.find((e) => e.id === equipmentId);

  if (!targetEquipment) {
    return { error: 'Equipment not found.' };
  }
  
  // In a real app, you'd have more complex logic for technician assignment
  const assignedTechnician = technicians.find(t => t.id === targetEquipment.defaultTechnicianId) || technicians[0];

  const newRequest: MaintenanceRequest = {
    id: `req-${Date.now()}`, // Simple ID generation
    subject,
    equipmentId,
    teamId: targetEquipment.maintenanceTeamId,
    technicianId: assignedTechnician.id,
    type: 'preventive',
    status: 'new',
    priority,
    scheduledDate,
    duration: 0,
    rootCause: '',
    createdBy: 'Manager', // Assuming manager is creating it
  };

  try {
    // In a real app, you would save this to a database.
    // Here we just push it to the mock data array.
    requests.unshift(newRequest);

    // Revalidate paths to update UI
    revalidatePath('/calendar');
    revalidatePath('/requests');

    return { data: newRequest };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to schedule task: ${errorMessage}` };
  }
}
