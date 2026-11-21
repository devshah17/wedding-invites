import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { RSVP } from '@/models/RSVP';

export async function GET() {
  try {
    await connectToDatabase();
    const rsvps = await RSVP.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, rsvps });
  } catch (error: unknown) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, mobile, totalAttendees, eventAttendance, message } = body;

    if (!guestName || typeof guestName !== 'string' || !guestName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide guest name' },
        { status: 400 }
      );
    }

    const cleanMobile = typeof mobile === 'string' ? mobile.trim() : '';
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid mobile number' },
        { status: 400 }
      );
    }

    const attendeesCount = Math.max(1, Number(totalAttendees) || 1);

    await connectToDatabase();

    const rsvp = await RSVP.findOneAndUpdate(
      { mobile: cleanMobile },
      {
        guestName: guestName.trim(),
        mobile: cleanMobile,
        totalAttendees: attendeesCount,
        eventAttendance: eventAttendance || {},
        message: typeof message === 'string' ? message.trim() : '',
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ success: true, rsvp }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error saving RSVP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save RSVP' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
