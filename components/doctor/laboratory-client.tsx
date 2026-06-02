'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube2, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { LaboratoryForm } from './laboratory-form';
import { toast } from 'sonner';

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface LabTest {
  LAB_ID: number;
  LAB_NUMBER: string;
  LAB_PAT_NUMBER: string;
  LAB_PAT_NAME: string;
  LAB_PAT_AILMENT: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_STATUS: string;
  LAB_DATE_REC: string;
  LAB_COMPLETED_DATE?: string;
  LAB_DOC_NUMBER: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  DOC_FNAME?: string;
  DOC_LNAME?: string;
}

export default function DoctorLaboratoryClient() {
  const searchParams = useSearchParams();
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingLabTest, setEditingLabTest] = useState<LabTest | undefined>();

  useEffect(() => {
    fetchLabTests();
    // Auto-open form if action=add in URL
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchLabTests = async () => {
    try {
      // Get current doctor
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorNumber(doctor.DOC_NUMBER);

      // Fetch lab tests
      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/laboratory`);
      if (!response.ok) throw new Error('Failed to fetch laboratory tests');
      const data = await response.json();
      setLabTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching laboratory tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (labTest: LabTest) => {
    setEditingLabTest(labTest);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lab test?')) return;

    try {
      const response = await fetch(`/api/laboratory?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lab test');

      toast.success('Lab test deleted successfully');
      fetchLabTests();
    } catch (error) {
      console.error('Error deleting lab test:', error);
      toast.error('Failed to delete lab test');
    }
  };

  const handleFormSuccess = () => {
    fetchLabTests();
    setEditingLabTest(undefined);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <TestTube2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laboratory Results</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{labTests.length} lab tests ordered</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingLabTest(undefined); setFormOpen(true); }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Order Lab Test
        </Button>
      </div>

      {labTests.length === 0 ? (
        <Card className="p-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mx-auto mb-6 flex items-center justify-center">
              <TestTube2 className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No lab tests ordered</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Order your first laboratory test.</p>
            <Button 
              onClick={() => { setEditingLabTest(undefined); setFormOpen(true); }}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Order Your First Lab Test
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {labTests.map((lab) => (
            <Card key={lab.LAB_ID} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-3 rounded-xl shadow-sm">
                    <TestTube2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Lab #{lab.LAB_NUMBER}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Patient: {lab.PAT_FNAME || ''} {lab.PAT_LNAME || ''} ({lab.LAB_PAT_NUMBER})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lab.LAB_STATUS === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    lab.LAB_STATUS === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    lab.LAB_STATUS === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {lab.LAB_STATUS}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(lab)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(lab.LAB_ID)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ailment:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {lab.LAB_PAT_AILMENT || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Date Ordered:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(lab.LAB_DATE_REC)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Tests Ordered:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{lab.LAB_PAT_TESTS}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Results:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{lab.LAB_PAT_RESULTS || 'Pending'}</p>
                  </div>
                  {lab.LAB_COMPLETED_DATE && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(lab.LAB_COMPLETED_DATE)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LaboratoryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingLabTest(undefined);
        }}
        onSuccess={handleFormSuccess}
        labTest={editingLabTest}
        doctorNumber={doctorNumber}
      />
    </div>
  );
}
