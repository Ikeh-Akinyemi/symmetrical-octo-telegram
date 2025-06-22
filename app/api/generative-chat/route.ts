import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const result = streamText({
      model: openai('gpt-4o'),
      system: 'You can generate forms and surveys based on user requests.',
      messages,
      tools: {
        generateForm: tool({
          description: 'Generate a form based on user requirements',
          parameters: z.object({
            title: z.string(),
            fields: z.array(z.object({
              name: z.string(),
              label: z.string(),
              type: z.enum(['text', 'email', 'textarea', 'select']),
              required: z.boolean(),
              options: z.array(z.object({
                value: z.string(),
                label: z.string()
              })).optional()
            }))
          }),
          execute: async (params) => params
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Generative chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}