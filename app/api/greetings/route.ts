import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Greeting } from '@/models/Greeting';

export async function GET() {
  try {
    await connectToDatabase();
    const greetings = await Greeting.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, greetings });
  } catch (error: unknown) {
    console.error('Error fetching greetings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch greetings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, relationship, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your name' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please write your wishes or advice' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newGreeting = await Greeting.create({
      name: name.trim(),
      relationship: (relationship && typeof relationship === 'string' && relationship.trim()) || 'Well Wisher',
      message: message.trim(),
      likes: 0,
    });

    return NextResponse.json(
      { success: true, greeting: newGreeting },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error saving greeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save greeting' },
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
