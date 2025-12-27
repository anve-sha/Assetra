
'use server';

import { getSupportResponseFlow } from '@/ai/flows/support-chat-flow';

type ReturnType = {
  data?: string;
  error?: string;
}

export async function getSupportResponse(
  query: string
): Promise<ReturnType> {
  if (!query) {
    return { error: 'Invalid input. Query cannot be empty.' };
  }

  try {
    const output = await getSupportResponseFlow(query);
    return { data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `AI Assistant is currently unavailable: ${errorMessage}` };
  }
}
