'use server';

import {
  equipmentHealthScore,
  type EquipmentHealthScoreInput,
  type EquipmentHealthScoreOutput,
} from '@/ai/flows/equipment-health-score';
import { z } from 'zod';

const schema = z.object({
  breakdownFrequency: z.number(),
  overdueTasks: z.number(),
});

type ReturnType = {
  data?: EquipmentHealthScoreOutput | null;
  error?: string;
}

export async function getHealthScore(
  input: EquipmentHealthScoreInput
): Promise<ReturnType> {
  const validatedInput = schema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const output = await equipmentHealthScore(validatedInput.data);
    return { data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to calculate health score: ${errorMessage}` };
  }
}
