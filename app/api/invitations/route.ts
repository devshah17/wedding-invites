import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Invitation } from '@/models/Invitation';

function generateInviteCode(guestName: string): string {
  const cleanName = guestName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 20);

  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return cleanName ? `${cleanName}-${randomSuffix}` : `invite-${randomSuffix}`;
}

export async function GET() {
  try {
    await connectToDatabase();
    const invitations = await Invitation.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, invitations });
  } catch (error: unknown) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, events, note } = body;

    if (!guestName || typeof guestName !== 'string' || !guestName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Guest name is required' },
        { status: 400 }
      );
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one ceremony to invite to' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Ensure unique code
    let code = generateInviteCode(guestName.trim());
    let exists = await Invitation.findOne({ code });
    let attempts = 0;
    while (exists && attempts < 5) {
      code = generateInviteCode(guestName.trim());
      exists = await Invitation.findOne({ code });
      attempts++;
    }

    const newInvitation = await Invitation.create({
      code,
      guestName: guestName.trim(),
      events,
      note: typeof note === 'string' ? note.trim() : '',
      views: 0,
      status: 'invited',
    });

    return NextResponse.json(
      { success: true, invitation: newInvitation },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create personalized invitation' },
      { status: 500 }
    );
  }
}
