import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const result = streamText({
      model: openai('gpt-4o'),
      system: 'You are a helpful assistant that can analyze images and provide detailed descriptions.',
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Multi-modal API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}