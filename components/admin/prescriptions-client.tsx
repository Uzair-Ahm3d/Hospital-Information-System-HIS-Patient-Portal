'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, FileText } from 'lucide-react';
import PrescriptionsForm from './prescriptions-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

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

export default function PrescriptionsClient() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const filtered = prescriptions.filter(prescription =>
      prescription.PRES_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      prescription.PRES_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      prescription.PRES_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      prescription.PRES_MEDICATION?.toLowerCase().includes(search.toLowerCase()) ||
      prescription.PRES_DOC_NAME?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  }, [search, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
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

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPrescription(null);
  };

  const handleSuccess = () => {
    fetchPrescriptions();
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-heading flex items-center gap-3">
            <FileText className="w-8 h-8 text-sky-400" />
            Prescription Management
          </h1>
          <p className="text-muted mt-1">
            Manage patient prescriptions and instructions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Prescription
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name, number, prescription number, or ailment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-hospital pl-12"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table-hospital">
            <thead>
              <tr>
                <th>Prescription #</th>
                <th>Patient Name</th>
                <th>Patient #</th>
                <th>Doctor</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted">
                      {search ? 'No prescriptions found matching your search' : 'No prescriptions found'}
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription, index) => (
                    <motion.tr
                      key={prescription.PRES_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{prescription.PRES_NUMBER || 'N/A'}</td>
                      <td className="font-semibold">{prescription.PRES_PAT_NAME || 'N/A'}</td>
                      <td>{prescription.PRES_PAT_NUMBER || 'N/A'}</td>
                      <td>{prescription.PRES_DOC_NAME || 'N/A'}</td>
                      <td className="max-w-xs truncate">{prescription.PRES_MEDICATION || 'N/A'}</td>
                      <td>{prescription.PRES_DOSAGE || 'N/A'}</td>
                      <td>
                        <span className={`badge ${
                          prescription.PRES_STATUS === 'Active' ? 'badge-success' :
                          prescription.PRES_STATUS === 'Completed' ? 'badge-info' :
                          prescription.PRES_STATUS === 'Cancelled' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                          {prescription.PRES_STATUS || 'N/A'}
                        </span>
                      </td>
                      <td>{formatDate(prescription.PRES_DATE)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(prescription)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prescription.PRES_ID)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted"
      >
        Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <PrescriptionsForm
            prescription={editingPrescription}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
