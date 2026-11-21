import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Greeting } from '@/models/Greeting';

export async function DELETE(
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
    const deleted = await Greeting.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Greeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Greeting deleted' });
  } catch (error: unknown) {
    console.error('Error deleting greeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete greeting' },
      { status: 500 }
    );
  }
}
