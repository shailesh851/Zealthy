import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
  }

  const prescriptions = await prisma.prescription.findMany({
    where: { patientId },
    orderBy: { refillDate: 'asc' },
  });

  return NextResponse.json(prescriptions);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const prescription = await prisma.prescription.create({
      data: {
        ...data,
        refillDate: new Date(data.refillDate),
      },
    });
    return NextResponse.json(prescription);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        ...updateData,
        refillDate: new Date(updateData.refillDate),
      },
    });

    return NextResponse.json(prescription);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Prescription ID required' }, { status: 400 });
    }

    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete prescription' }, { status: 500 });
  }
}
