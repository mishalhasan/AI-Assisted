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
    const { text, title } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a helpful AI assistant that creates concise, well-structured summaries of voice transcripts or notes.
Create a clear summary that captures the key points and main ideas.
Format the summary in a way that's easy to read and understand.`;

    const userPrompt = title
      ? `Summarize the following transcript about "${title}":\n\n${text}`
      : `Summarize the following transcript:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const summary = completion.choices[0]?.message?.content || '';

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    // Extract title from transcript if not provided
    const extractedTitle = title || extractTitleFromText(text);

    return NextResponse.json({
      summary,
      title: extractedTitle,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to extract title from text
function extractTitleFromText(text: string): string {
  // Take first sentence or first 100 characters
  const firstSentence = text.split(/[.!?]/)[0].trim();
  const title = firstSentence.substring(0, 100);
  return title || 'Voice Note';
}

