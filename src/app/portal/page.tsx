'use client';
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

interface Appointment {
  id: string;
  providerName: string;
  dateTime: string;
  repeatSchedule: string | null;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule: string;
}

export default function PortalPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [upcomingRefills, setUpcomingRefills] = useState<Prescription[]>([]);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      router.push('/');
      return;
    }
    const patientData = await res.json();
    setPatient(patientData);

    const aptsRes = await fetch(`/api/appointments?patientId=${patientData.id}`);
    const appointments = await aptsRes.json();
    
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= now && aptDate <= sevenDaysFromNow;
    });
    setUpcomingAppointments(upcoming);

    const rxRes = await fetch(`/api/prescriptions?patientId=${patientData.id}`);
    const prescriptions = await rxRes.json();
    
    const upcomingRx = prescriptions.filter((rx: Prescription) => {
      const refillDate = new Date(rx.refillDate);
      return refillDate >= now && refillDate <= sevenDaysFromNow;
    });
    setUpcomingRefills(upcomingRx);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Patient Portal</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Name:</strong> {patient.firstName} {patient.lastName}</div>
            <div><strong>Email:</strong> {patient.email}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
            <div className="col-span-2"><strong>Address:</strong> {patient.address}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upcoming Appointments (Next 7 Days)</h2>
              <Link href="/portal/appointments" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments in the next 7 days</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-semibold">{apt.providerName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(apt.dateTime).toLocaleString()}
                    </div>
                    {apt.repeatSchedule && (
                      <div className="text-sm text-blue-600">Repeats: {apt.repeatSchedule}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upcoming Refills (Next 7 Days)</h2>
              <Link href="/portal/prescriptions" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
            {upcomingRefills.length === 0 ? (
              <p className="text-gray-500">No refills due in the next 7 days</p>
            ) : (
              <div className="space-y-3">
                {upcomingRefills.map((rx) => (
                  <div key={rx.id} className="border-l-4 border-green-500 pl-4">
                    <div className="font-semibold">{rx.medicationName}</div>
                    <div className="text-sm text-gray-600">{rx.dosage} - Qty: {rx.quantity}</div>
                    <div className="text-sm text-gray-600">
                      Refill: {new Date(rx.refillDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-bold mb-2">Quick Links</h3>
          <div className="flex gap-4">
            <Link href="/portal/appointments" className="text-blue-600 hover:underline">
              View All Appointments
            </Link>
            <Link href="/portal/prescriptions" className="text-blue-600 hover:underline">
              View All Prescriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
