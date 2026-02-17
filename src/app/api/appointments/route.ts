import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    orderBy: { dateTime: 'asc' },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        dateTime: new Date(data.dateTime),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...updateData,
        dateTime: new Date(updateData.dateTime),
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
