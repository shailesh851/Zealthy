'use client';
export const dynamic = "force-dynamic";


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule: string;
}

export default function PortalPrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      router.push('/');
      return;
    }
    const patient = await res.json();

    const rxRes = await fetch(`/api/prescriptions?patientId=${patient.id}`);
    const allPrescriptions = await rxRes.json();

    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const upcoming = allPrescriptions.filter((rx: Prescription) => {
      const refillDate = new Date(rx.refillDate);
      return refillDate >= now && refillDate <= threeMonthsFromNow;
    });

    setPrescriptions(upcoming);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/portal" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">All Prescriptions (Next 3 Months)</h1>

        {prescriptions.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">No prescription refills in the next 3 months</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{rx.medicationName}</h3>
                    <div className="text-gray-600 mb-1">
                      <strong>Dosage:</strong> {rx.dosage}
                    </div>
                    <div className="text-gray-600 mb-1">
                      <strong>Quantity:</strong> {rx.quantity}
                    </div>
                    <div className="text-gray-600 mb-1">
                      <strong>Refill Date:</strong> {new Date(rx.refillDate).toLocaleDateString()}
                    </div>
                    <div className="text-blue-600">
                      <strong>Refill Schedule:</strong> {rx.refillSchedule}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.ceil((new Date(rx.refillDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until refill
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
