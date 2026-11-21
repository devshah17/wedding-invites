import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Greeting } from '@/models/Greeting';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Greeting ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Greeting.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Greeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch (error: unknown) {
    console.error('Error liking greeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update like' },
      { status: 500 }
    );
  }
}
