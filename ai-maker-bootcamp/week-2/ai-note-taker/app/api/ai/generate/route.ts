import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, title } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a more detailed prompt for note generation
    const systemPrompt = `You are a helpful AI assistant that generates well-structured notes. 
Generate clear, concise, and organized notes based on the user's request. 
Format the content in a way that's easy to read and understand.`;

    const userPrompt = title 
      ? `Generate a note about "${title}". ${prompt}`
      : prompt;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: generatedContent,
      title: title || extractTitle(generatedContent),
    });
  } catch (error) {
    console.error('Error generating note:', error);
    return NextResponse.json(
      { error: 'Failed to generate note. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to extract title from content
function extractTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim();
  // Remove markdown headers if present
  const title = firstLine.replace(/^#+\s*/, '').substring(0, 100);
  return title || 'AI Generated Note';
}

