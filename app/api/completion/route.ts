import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const result = streamText({
      model: openai('gpt-4o'),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Completion API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}