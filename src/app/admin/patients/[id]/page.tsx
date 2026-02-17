'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  appointments: Appointment[];
  prescriptions: Prescription[];
}

interface Appointment {
  id: string;
  providerName: string;
  dateTime: string;
  repeatSchedule: string | null;
  endDate: string | null;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule: string;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  const [appointmentForm, setAppointmentForm] = useState({
    providerName: '',
    dateTime: '',
    repeatSchedule: '',
    endDate: '',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicationName: '',
    dosage: '',
    quantity: '',
    refillDate: '',
    refillSchedule: '',
  });

  useEffect(() => {
    fetchPatient();
  }, [params.id]);

  const fetchPatient = async () => {
    const res = await fetch(`/api/patients?id=${params.id}`);
    const data = await res.json();
    setPatient(data);
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingAppointment ? '/api/appointments' : '/api/appointments';
    const method = editingAppointment ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(editingAppointment && { id: editingAppointment.id }),
        patientId: params.id,
        ...appointmentForm,
        repeatSchedule: appointmentForm.repeatSchedule || null,
        endDate: appointmentForm.endDate || null,
      }),
    });

    setShowAppointmentForm(false);
    setEditingAppointment(null);
    setAppointmentForm({ providerName: '', dateTime: '', repeatSchedule: '', endDate: '' });
    fetchPatient();
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPrescription ? '/api/prescriptions' : '/api/prescriptions';
    const method = editingPrescription ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(editingPrescription && { id: editingPrescription.id }),
        patientId: params.id,
        ...prescriptionForm,
        quantity: parseInt(prescriptionForm.quantity),
      }),
    });

    setShowPrescriptionForm(false);
    setEditingPrescription(null);
    setPrescriptionForm({ medicationName: '', dosage: '', quantity: '', refillDate: '', refillSchedule: '' });
    fetchPatient();
  };

  const deleteAppointment = async (id: string) => {
    if (confirm('Delete this appointment?')) {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      fetchPatient();
    }
  };

  const deletePrescription = async (id: string) => {
    if (confirm('Delete this prescription?')) {
      await fetch(`/api/prescriptions?id=${id}`, { method: 'DELETE' });
      fetchPatient();
    }
  };

  const editAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      providerName: appointment.providerName,
      dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
      repeatSchedule: appointment.repeatSchedule || '',
      endDate: appointment.endDate ? new Date(appointment.endDate).toISOString().slice(0, 10) : '',
    });
    setShowAppointmentForm(true);
  };

  const editPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setPrescriptionForm({
      medicationName: prescription.medicationName,
      dosage: prescription.dosage,
      quantity: prescription.quantity.toString(),
      refillDate: new Date(prescription.refillDate).toISOString().slice(0, 10),
      refillSchedule: prescription.refillSchedule,
    });
    setShowPrescriptionForm(true);
  };

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Patients
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold mb-4">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Email:</strong> {patient.email}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
            <div><strong>Address:</strong> {patient.address}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <button
                onClick={() => {
                  setShowAppointmentForm(!showAppointmentForm);
                  setEditingAppointment(null);
                  setAppointmentForm({ providerName: '', dateTime: '', repeatSchedule: '', endDate: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                {showAppointmentForm ? 'Cancel' : 'Add Appointment'}
              </button>
            </div>

            {showAppointmentForm && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="font-bold mb-3">{editingAppointment ? 'Edit' : 'New'} Appointment</h3>
                <form onSubmit={handleAppointmentSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Provider Name</label>
                    <input
                      type="text"
                      value={appointmentForm.providerName}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, providerName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={appointmentForm.dateTime}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, dateTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Repeat Schedule</label>
                    <select
                      value={appointmentForm.repeatSchedule}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, repeatSchedule: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  {appointmentForm.repeatSchedule && (
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                      <input
                        type="date"
                        value={appointmentForm.endDate}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, endDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    {editingAppointment ? 'Update' : 'Create'} Appointment
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {patient.appointments.map((apt) => (
                <div key={apt.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{apt.providerName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(apt.dateTime).toLocaleString()}
                      </div>
                      {apt.repeatSchedule && (
                        <div className="text-sm text-blue-600">Repeats: {apt.repeatSchedule}</div>
                      )}
                      {apt.endDate && (
                        <div className="text-sm text-gray-500">Until: {new Date(apt.endDate).toLocaleDateString()}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editAppointment(apt)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Prescriptions</h2>
              <button
                onClick={() => {
                  setShowPrescriptionForm(!showPrescriptionForm);
                  setEditingPrescription(null);
                  setPrescriptionForm({ medicationName: '', dosage: '', quantity: '', refillDate: '', refillSchedule: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                {showPrescriptionForm ? 'Cancel' : 'Add Prescription'}
              </button>
            </div>

            {showPrescriptionForm && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="font-bold mb-3">{editingPrescription ? 'Edit' : 'New'} Prescription</h3>
                <form onSubmit={handlePrescriptionSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Medication Name</label>
                    <input
                      type="text"
                      value={prescriptionForm.medicationName}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicationName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dosage</label>
                    <input
                      type="text"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={prescriptionForm.quantity}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Refill Date</label>
                    <input
                      type="date"
                      value={prescriptionForm.refillDate}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, refillDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Refill Schedule</label>
                    <select
                      value={prescriptionForm.refillSchedule}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, refillSchedule: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    {editingPrescription ? 'Update' : 'Create'} Prescription
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {patient.prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{rx.medicationName}</div>
                      <div className="text-sm text-gray-600">
                        {rx.dosage} - Qty: {rx.quantity}
                      </div>
                      <div className="text-sm text-gray-600">
                        Refill: {new Date(rx.refillDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-blue-600">Schedule: {rx.refillSchedule}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editPrescription(rx)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePrescription(rx.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
