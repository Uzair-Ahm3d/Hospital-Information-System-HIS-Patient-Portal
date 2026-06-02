'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Syringe, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SurgeryForm } from './surgery-form';

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_PAT_NAME: string;
  SURG_PAT_NUMBER: string;
  SURG_DOC_NUMBER: string;
  SURG_DOC_NAME: string;
  SURG_TYPE: string;
  SURG_DATE: string;
  SURG_DURATION: string;
  SURG_STATUS: string;
  SURG_NOTES: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PAT_NUMBER?: string;
}

export default function DoctorSurgeriesClient() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | undefined>();

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async () => {
    try {
      // Get current doctor
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorNumber(doctor.DOC_NUMBER);

      // Fetch surgeries
      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/surgeries`);
      if (!response.ok) throw new Error('Failed to fetch surgeries');
      const data = await response.json();
      setSurgeries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this surgery?')) return;

    try {
      const response = await fetch(`/api/surgery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete surgery');

      toast.success('Surgery deleted successfully');
      fetchSurgeries();
    } catch (error) {
      console.error('Error deleting surgery:', error);
      toast.error('Failed to delete surgery');
    }
  };

  const handleFormSuccess = () => {
    fetchSurgeries();
    setEditingSurgery(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Syringe className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Surgeries</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{surgeries.length} surgical procedures</p>
              </div>
            </div>
            <Button 
              onClick={() => { setEditingSurgery(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Surgery
            </Button>
          </div>
        </CardHeader>
      </Card>

      {surgeries.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <Syringe className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-6">No surgeries scheduled yet.</p>
            <Button 
              onClick={() => { setEditingSurgery(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Surgery
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {surgeries.map((surgery) => (
            <Card key={surgery.SURG_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 rounded-xl shadow-md">
                    <Syringe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Surgery #{surgery.SURG_NUMBER}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Patient: <span className="font-semibold text-gray-900 dark:text-gray-100">{surgery.SURG_PAT_NAME || `${surgery.PAT_FNAME} ${surgery.PAT_LNAME}`}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                    surgery.SURG_STATUS === 'Completed' 
                      ? 'bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : surgery.SURG_STATUS === 'Scheduled'
                      ? 'bg-linear-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                    {surgery.SURG_STATUS}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(surgery)}
                    className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
                  >
                    <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(surgery.SURG_ID)}
                    className="border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium text-xs uppercase tracking-wide">Date</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(surgery.SURG_DATE)}
                    </p>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <span className="text-purple-600 dark:text-purple-400 font-medium text-xs uppercase tracking-wide">Surgery Type</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">{surgery.SURG_TYPE}</p>
                  </div>
                  <div className="bg-cyan-50/50 dark:bg-cyan-900/10 p-3 rounded-lg border border-cyan-100 dark:border-cyan-900/30">
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium text-xs uppercase tracking-wide">Duration</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">{surgery.SURG_DURATION || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <span className="text-blue-600 dark:text-blue-400 font-medium text-xs uppercase tracking-wide">Patient</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">{surgery.SURG_PAT_NAME || `${surgery.PAT_FNAME || ''} ${surgery.PAT_LNAME || ''}`.trim() || 'N/A'}</p>
                  </div>
                  {surgery.SURG_NOTES && (
                    <div className="col-span-2 md:col-span-3 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">Notes</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{surgery.SURG_NOTES}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SurgeryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingSurgery(undefined);
        }}
        onSuccess={handleFormSuccess}
        surgery={editingSurgery}
        doctorNumber={doctorNumber}
      />
    </div>
  );
}
