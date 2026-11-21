import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { RSVP } from '@/models/RSVP';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RSVP ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deleted = await RSVP.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'RSVP not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'RSVP deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete RSVP' },
      { status: 500 }
    );
  }
}
