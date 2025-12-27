'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { equipment } from '@/lib/data';
import type { Equipment } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
type ReturnType = {
  data?: Equipment;
  error?: string;
};

export async function addEquipment(input: AddEquipmentFormValues): Promise<ReturnType> {
  const validatedInput = formSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }
  
  const placeholder = PlaceHolderImages.find(p => p.id === 'equipment-new');
  if (!placeholder) {
    return { error: 'Could not find placeholder image for new equipment.' };
  }

  const newEquipment: Equipment = {
    id: `equip-${Date.now()}`,
    ...validatedInput.data,
    isScrapped: false,
    imageUrl: placeholder.imageUrl,
    imageHint: placeholder.imageHint,
  };

  try {
    equipment.unshift(newEquipment);
    revalidatePath('/equipment');
    return { data: newEquipment };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to add equipment: ${errorMessage}` };
  }
}
