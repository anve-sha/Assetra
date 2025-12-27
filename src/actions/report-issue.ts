
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { equipment, requests, technicians } from '@/lib/data';
import type { MaintenanceRequest } from '@/lib/types';

const schema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters long.'),
  equipmentId: z.string().min(1),
  createdBy: z.string().min(1),
  priority: z.enum(['High', 'Medium', 'Low']),
});

type Input = z.infer<typeof schema>;
type ReturnType = {
  data?: MaintenanceRequest;
  error?: string;
};

export async function reportIssue(input: Input): Promise<ReturnType> {
  const validatedInput = schema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }

  const { subject, equipmentId, createdBy, priority } = validatedInput.data;

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
    type: 'corrective',
    status: 'new',
    priority,
    scheduledDate: new Date(), // Corrective issues are scheduled for now
    duration: 0,
    rootCause: '',
    createdBy,
  };

  try {
    // In a real app, you would save this to a database.
    requests.unshift(newRequest);

    // Revalidate paths to update UI
    revalidatePath('/requests');
    revalidatePath(`/equipment/${equipmentId}`);

    return { data: newRequest };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to report issue: ${errorMessage}` };
  }
}
