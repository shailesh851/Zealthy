'use client';
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  id: string;
  providerName: string;
  dateTime: string;
  repeatSchedule: string | null;
  endDate: string | null;
}

export default function PortalAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      router.push('/');
      return;
    }
    const patient = await res.json();
    setPatientId(patient.id);

    const aptsRes = await fetch(`/api/appointments?patientId=${patient.id}`);
    const allAppointments = await aptsRes.json();

    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const upcoming = allAppointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= now && aptDate <= threeMonthsFromNow;
    });

    setAppointments(upcoming);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/portal" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">All Appointments (Next 3 Months)</h1>

        {appointments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">No upcoming appointments in the next 3 months</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{apt.providerName}</h3>
                    <div className="text-gray-600 mb-1">
                      <strong>Date & Time:</strong> {new Date(apt.dateTime).toLocaleString()}
                    </div>
                    {apt.repeatSchedule && (
                      <div className="text-blue-600 mb-1">
                        <strong>Repeats:</strong> {apt.repeatSchedule}
                      </div>
                    )}
                    {apt.endDate && (
                      <div className="text-gray-500">
                        <strong>Until:</strong> {new Date(apt.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.ceil((new Date(apt.dateTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
