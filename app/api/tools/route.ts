import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: 'What is the weather like today in San Francisco?',
      tools: {
        getWeather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
      },
    });

    return new Response(JSON.stringify({ text }));
  } catch (error) {
    console.error('Tools API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}