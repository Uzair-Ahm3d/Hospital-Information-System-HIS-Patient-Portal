'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader2, UserPlus, Edit } from 'lucide-react';
import { PatientForm } from './patient-form';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_PHONE: string;
  PAT_EMAIL: string;
  PAT_AILMENT: string;
  PAT_TYPE: string;
  PAT_DISCHARGE_STATUS: string;
  PAT_ASSIGNED_DOC: string;
  DOC_FNAME?: string;
  DOC_LNAME?: string;
}

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_NUMBER: string;
}

export default function DoctorPatientsClient() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  useEffect(() => {
    fetchDoctorAndPatients();
    // Auto-open form if action=add in URL
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchDoctorAndPatients = async () => {
    try {
      // First get the current doctor's info
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctorData = await doctorResponse.json();
      setDoctor(doctorData);

      // Then fetch patients assigned to this doctor (use DOC_NUMBER)
      const patientsResponse = await fetch(`/api/doctors/${doctorData.DOC_NUMBER}/patients`);
      if (!patientsResponse.ok) throw new Error('Failed to fetch patients');
      const patientsData = await patientsResponse.json();
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(undefined);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchDoctorAndPatients();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 -ml-px">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Patients</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {patients.length} patients • {doctor ? `Dr. ${doctor.DOC_FNAME} ${doctor.DOC_LNAME}` : 'Managing patient care'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Patient
        </Button>
      </div>

      {patients.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 shadow-lg">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Users className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Patients Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start building your patient roster by adding your first patient record.</p>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Your First Patient
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          {patients.map((patient) => (
            <Card key={patient.PAT_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl transition-all overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 p-3.5 flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {patient.PAT_FNAME} {patient.PAT_LNAME}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Patient #{patient.PAT_NUMBER}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    patient.PAT_TYPE === 'Inpatient' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600' 
                      : patient.PAT_TYPE === 'Emergency'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-2 border-red-300 dark:border-red-600'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-600'
                  }`}>
                    {patient.PAT_TYPE}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(patient)}
                    className="border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-600 transition-all"
                  >
                    <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{patient.PAT_PHONE}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Status</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{patient.PAT_DISCHARGE_STATUS || 'Active'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{patient.PAT_EMAIL || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-5 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-3 tracking-wider">Ailment</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{patient.PAT_AILMENT}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {doctor && (
        <PatientForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={handleFormSuccess}
          patient={selectedPatient}
          doctorNumber={doctor.DOC_NUMBER}
        />
      )}
    </div>
  );
}
