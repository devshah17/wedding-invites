import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Invitation } from '@/models/Invitation';

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const invitation = await Invitation.findOneAndUpdate(
      { code },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    ).lean();

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invitation });
  } catch (error: unknown) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Invite identifier is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(code)
      ? { $or: [{ code }, { _id: code }] }
      : { code };

    const deleted = await Invitation.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Invitation deleted' });
  } catch (error: unknown) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}
