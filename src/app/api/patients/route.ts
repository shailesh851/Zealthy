import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: { orderBy: { dateTime: 'asc' } },
        prescriptions: { orderBy: { refillDate: 'asc' } },
      },
    });
    return NextResponse.json(patient);
  }

  const patients = await prisma.patient.findMany({
    orderBy: { lastName: 'asc' },
    include: {
      _count: {
        select: { appointments: true, prescriptions: true },
      },
    },
  });
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const hashedPassword = await hashPassword(data.password);

    const patient = await prisma.patient.create({
      data: {
        ...data,
        password: hashedPassword,
        dateOfBirth: new Date(data.dateOfBirth),
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, password, ...updateData } = data;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...updateData,
        ...(password && { password: await hashPassword(password) }),
        ...(updateData.dateOfBirth && { dateOfBirth: new Date(updateData.dateOfBirth) }),
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}
