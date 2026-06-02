'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { VitalsForm } from './vitals-form';
import { toast } from 'sonner';

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface Vital {
  VIT_ID: number;
  VIT_PAT_NUMBER: string;
  VIT_PAT_NAME: string;
  VIT_WEIGHT: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_RESPIRATION: number;
  VIT_OXYGEN_SAT: number;
  VIT_RECORDED_BY: string;
  VIT_RECORDED_DATE: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PAT_NUMBER?: string;
}

export default function DoctorVitalsClient() {
  const searchParams = useSearchParams();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVital, setEditingVital] = useState<Vital | undefined>();

  useEffect(() => {
    fetchVitals();
    // Auto-open form if action=add in URL
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchVitals = async () => {
    try {
      // Get current doctor
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorNumber(doctor.DOC_NUMBER);

      // Fetch vitals
      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/vitals`);
      if (!response.ok) throw new Error('Failed to fetch vitals');
      const data = await response.json();
      setVitals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vital: Vital) => {
    setEditingVital(vital);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vital record?')) return;

    try {
      const response = await fetch(`/api/vitals?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete vital record');

      toast.success('Vital record deleted successfully');
      fetchVitals();
    } catch (error) {
      console.error('Error deleting vital record:', error);
      toast.error('Failed to delete vital record');
    }
  };

  const handleFormSuccess = () => {
    fetchVitals();
    setEditingVital(undefined);
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
      <div className="flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-rose-100 dark:border-rose-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/30">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Patient Vitals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">{vitals.length} records • Tracking patient health</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingVital(undefined); setFormOpen(true); }}
          className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Vitals
        </Button>
      </div>

      {vitals.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-800 dark:to-rose-950/20 border-2 border-dashed border-rose-200 dark:border-rose-800 shadow-lg">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <HeartPulse className="w-12 h-12 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Vitals Recorded</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start tracking patient health by recording vital signs.</p>
            <Button 
              onClick={() => { setEditingVital(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Record First Vital Signs
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          {vitals.map((vital) => (
            <Card key={vital.VIT_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-xl transition-all overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 p-3.5 flex items-center justify-center shadow-lg">
                    <HeartPulse className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {vital.VIT_PAT_NAME || `${vital.PAT_FNAME} ${vital.PAT_LNAME}`}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Recorded on {formatDate(vital.VIT_RECORDED_DATE)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vital)}
                    className="border-2 border-rose-200 hover:bg-rose-100 hover:border-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/30 dark:hover:border-rose-600 transition-all"
                  >
                    <Edit className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vital.VIT_ID)}
                    className="border-2 border-red-200 hover:bg-red-100 hover:border-red-400 dark:border-red-800 dark:hover:bg-red-900/30 dark:hover:border-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Temperature</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_BODYTEMP}°F</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Blood Pressure</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_BLOOD_PRESSURE}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Heart Pulse</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_HEARTPULSE} <span className="text-sm font-normal">bpm</span></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Respiration</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_RESPIRATION} <span className="text-sm font-normal">/min</span></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Oxygen Sat</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_OXYGEN_SAT}<span className="text-sm font-normal">%</span></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Weight</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{vital.VIT_WEIGHT} <span className="text-sm font-normal">lbs</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <VitalsForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingVital(undefined);
        }}
        onSuccess={handleFormSuccess}
        vital={editingVital}
        doctorNumber={doctorNumber}
      />
    </div>
  );
}
