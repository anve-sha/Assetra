'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating the equipment health score.
 *
 * - equipmentHealthScore - A function that calculates the equipment health score.
 * - EquipmentHealthScoreInput - The input type for the equipmentHealthScore function.
 * - EquipmentHealthScoreOutput - The return type for the equipmentHealthScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EquipmentHealthScoreInputSchema = z.object({
  breakdownFrequency: z
    .number()
    .describe('The number of breakdowns the equipment has experienced.'),
  overdueTasks: z
    .number()
    .describe('The number of overdue maintenance tasks for the equipment.'),
});
export type EquipmentHealthScoreInput = z.infer<typeof EquipmentHealthScoreInputSchema>;

const EquipmentHealthScoreOutputSchema = z.object({
  healthScore: z
    .string()
    .describe(
      "The overall health score of the equipment, which must be 'Good', 'Warning', or 'Critical'."
    ),
});
export type EquipmentHealthScoreOutput = z.infer<typeof EquipmentHealthScoreOutputSchema>;

export async function equipmentHealthScore(
  input: EquipmentHealthScoreInput
): Promise<EquipmentHealthScoreOutput> {
  return equipmentHealthScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'equipmentHealthScorePrompt',
  input: {schema: EquipmentHealthScoreInputSchema},
  output: {schema: EquipmentHealthScoreOutputSchema},
  prompt: `You are an AI assistant that determines the health score of a piece of equipment.

  Consider the following factors when determining the equipment's health score:

  - Breakdown Frequency: The number of times the equipment has broken down.
  - Overdue Tasks: The number of maintenance tasks that are overdue for the equipment.

  Based on these factors, determine the overall health score of the equipment. The health score should be one of the following values: 'Good', 'Warning', or 'Critical'.

  Here's how to determine the health score:

  - If the breakdown frequency is low (0-1) and there are no overdue tasks, the health score is 'Good'.
  - If the breakdown frequency is moderate (2-3) or there are some overdue tasks (1-2), the health score is 'Warning'.
  - If the breakdown frequency is high (4+) or there are many overdue tasks (3+), the health score is 'Critical'.

  Breakdown Frequency: {{{breakdownFrequency}}}
  Overdue Tasks: {{{overdueTasks}}}

  Health Score:`,
});

const equipmentHealthScoreFlow = ai.defineFlow(
  {
    name: 'equipmentHealthScoreFlow',
    inputSchema: EquipmentHealthScoreInputSchema,
    outputSchema: EquipmentHealthScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
