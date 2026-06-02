'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PrescriptionForm } from './prescription-form';

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PRES_PAT_NAME: string;
  PRES_DOC_NUMBER: string;
  PRES_DOC_NAME: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DATE: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
}

export default function DoctorPrescriptionsClient() {
  const searchParams = useSearchParams();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | undefined>();

  useEffect(() => {
    fetchPrescriptions();
    // Auto-open form if action=add in URL
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchPrescriptions = async () => {
    try {
      // Get current doctor
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorNumber(doctor.DOC_NUMBER);

      // Fetch prescriptions
      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/prescriptions`);
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const response = await fetch(`/api/prescriptions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete prescription');

      toast.success('Prescription deleted successfully');
      fetchPrescriptions();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription');
    }
  };

  const handleFormSuccess = () => {
    fetchPrescriptions();
    setEditingPrescription(undefined);
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
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Prescriptions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">{prescriptions.length} prescriptions • Managing medications</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingPrescription(undefined); setFormOpen(true); }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Prescription
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20 border-2 border-dashed border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Prescriptions Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start managing patient medications by creating your first prescription.</p>
            <Button 
              onClick={() => { setEditingPrescription(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Prescription
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          {prescriptions.map((prescription) => (
            <Card key={prescription.PRES_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 p-3.5 flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Prescription #{prescription.PRES_NUMBER}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Patient: <span className="font-semibold text-gray-900 dark:text-white">{prescription.PRES_PAT_NAME}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    prescription.PRES_STATUS === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-600' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
                  }`}>
                    {prescription.PRES_STATUS}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(prescription)}
                    className="border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 transition-all"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(prescription.PRES_ID)}
                    className="border-2 border-red-200 hover:bg-red-100 hover:border-red-400 dark:border-red-800 dark:hover:bg-red-900/30 dark:hover:border-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(prescription.PRES_DATE)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Medication</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{prescription.PRES_MEDICATION}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Dosage</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{prescription.PRES_DOSAGE}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Frequency</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{prescription.PRES_FREQUENCY}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Duration</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{prescription.PRES_DURATION}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Refills</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{prescription.PRES_REFILLS_REMAINING}</p>
                  </div>
                </div>
                {prescription.PRES_NOTES && (
                  <div className="mt-5 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-3 tracking-wider">Notes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{prescription.PRES_NOTES}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PrescriptionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPrescription(undefined);
        }}
        onSuccess={handleFormSuccess}
        prescription={editingPrescription}
        doctorNumber={doctorNumber}
      />
    </div>
  );
}
