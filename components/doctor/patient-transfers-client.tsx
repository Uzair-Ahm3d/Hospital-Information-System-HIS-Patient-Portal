'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { PatientTransferForm } from './patient-transfers-form';
import { toast } from 'sonner';

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface PatientTransfer {
  PT_ID: number;
  PT_PAT_NUMBER: string;
  PT_PAT_NAME: string;
  PT_FROM_WARD: string;
  PT_TO_WARD: string;
  PT_REASON: string;
  PT_TRANSFER_DATE: string;
  PT_AUTHORIZED_BY: string;
  PT_AUTHORIZED_DOC_NAME?: string;
  PT_STATUS: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
}

export default function DoctorPatientTransfersClient() {
  const searchParams = useSearchParams();
  const [transfers, setTransfers] = useState<PatientTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<PatientTransfer | undefined>();

  useEffect(() => {
    fetchTransfers();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchTransfers = async () => {
    try {
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorName(`${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`);

      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/patient-transfers`);
      if (!response.ok) throw new Error('Failed to fetch patient transfers');
      const data = await response.json();
      setTransfers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patient transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transfer: PatientTransfer) => {
    setEditingTransfer(transfer);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/patient-transfers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transfer');

      toast.success('Transfer deleted successfully');
      fetchTransfers();
    } catch (error) {
      console.error('Error deleting transfer:', error);
      toast.error('Failed to delete transfer');
    }
  };

  const handleFormSuccess = () => {
    fetchTransfers();
    setEditingTransfer(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 -ml-px">
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <ArrowRightLeft className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Patient Transfers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">{transfers.length} transfers • Managing ward movements</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingTransfer(undefined); setFormOpen(true); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Transfer
        </Button>
      </div>

      {transfers.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20 border-2 border-dashed border-indigo-200 dark:border-indigo-800 shadow-lg">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <ArrowRightLeft className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Transfers Recorded</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start managing patient ward movements by creating your first transfer record.</p>
            <Button 
              onClick={() => { setEditingTransfer(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Transfer
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          {transfers.map((transfer) => (
            <Card key={transfer.PT_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-3.5 flex items-center justify-center shadow-lg">
                    <ArrowRightLeft className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {transfer.PT_PAT_NAME || `${transfer.PAT_FNAME} ${transfer.PAT_LNAME}`}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Patient #{transfer.PT_PAT_NUMBER}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    transfer.PT_STATUS === 'Completed' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-600' 
                      : transfer.PT_STATUS === 'Cancelled'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-2 border-red-300 dark:border-red-600'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-600'
                  }`}>
                    {transfer.PT_STATUS}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(transfer)}
                    className="border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-600 transition-all"
                  >
                    <Edit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transfer.PT_ID)}
                    className="border-2 border-red-200 hover:bg-red-100 hover:border-red-400 dark:border-red-800 dark:hover:bg-red-900/30 dark:hover:border-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900/50">
                  <div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 tracking-wider">From Ward</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{transfer.PT_FROM_WARD}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="w-6 h-6 text-indigo-400 dark:text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 tracking-wider">To Ward</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{transfer.PT_TO_WARD}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Transfer Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(transfer.PT_TRANSFER_DATE)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Authorized By</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Dr. {transfer.PT_AUTHORIZED_DOC_NAME || transfer.PT_AUTHORIZED_BY || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-5 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-3 tracking-wider">Transfer Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{transfer.PT_REASON}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {formOpen && (
        <PatientTransferForm
          transfer={editingTransfer}
          onClose={() => { setFormOpen(false); setEditingTransfer(undefined); }}
          onSuccess={handleFormSuccess}
          doctorName={doctorName}
        />
      )}
    </div>
  );
}
