const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      dateOfBirth: new Date('1985-05-15'),
      phone: '555-0101',
      address: '123 Main St, Anytown, USA',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      dateOfBirth: new Date('1990-08-22'),
      phone: '555-0102',
      address: '456 Oak Ave, Somewhere, USA',
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        providerName: 'Dr. Sarah Johnson',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        repeatSchedule: 'monthly',
      },
      {
        patientId: patient1.id,
        providerName: 'Dr. Michael Chen',
        dateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        repeatSchedule: null,
      },
      {
        patientId: patient2.id,
        providerName: 'Dr. Emily Brown',
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        repeatSchedule: 'weekly',
      },
    ],
  });

  await prisma.prescription.createMany({
    data: [
      {
        patientId: patient1.id,
        medicationName: 'Lisinopril',
        dosage: '10mg',
        quantity: 30,
        refillDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        refillSchedule: 'monthly',
      },
      {
        patientId: patient1.id,
        medicationName: 'Metformin',
        dosage: '500mg',
        quantity: 60,
        refillDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        refillSchedule: 'monthly',
      },
      {
        patientId: patient2.id,
        medicationName: 'Atorvastatin',
        dosage: '20mg',
        quantity: 30,
        refillDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        refillSchedule: 'monthly',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
