
'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI support chat bot.
 *
 * - getSupportResponse - A function that gets a response from the AI support bot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function getSupportResponseFlow(
  query: string
): Promise<string> {
  const supportChatFlow = ai.defineFlow(
    {
      name: 'supportChatFlow',
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (prompt) => {
      const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.5-flash',
        config: {
          // Adjust temperature for more creative/varied responses if needed
          temperature: 0.5,
        },
      });
      return llmResponse.text;
    }
  );
  
  const systemPrompt = `You are an expert AI assistant for an application called "GearGuard", a smart maintenance and asset management system. Your role is to provide helpful, concise, and friendly support to users.

  Application Features:
  - Dashboard: Overview of open requests, overdue tasks, teams, and equipment health.
  - Equipment: A list of all equipment, with details on location, status, and maintenance history. Managers can add new equipment.
  - Requests: A Kanban board showing maintenance requests (new, in progress, repaired, scrap).
  - Calendar: A monthly view of scheduled preventive maintenance tasks. Managers can schedule new tasks.
  - Roles: The app has three user roles: Manager, Technician, and Employee, each with different permissions.

  Your Task:
  - Answer user questions clearly and accurately based on the features above.
  - If a user asks something you don't know, politely say you don't have that information.
  - Keep your answers brief and to the point.
  
  User Query: "${query}"
  
  Your Answer:`;

  return await supportChatFlow(systemPrompt);
}
