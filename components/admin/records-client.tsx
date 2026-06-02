'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, FileText } from 'lucide-react';
import RecordsForm from './records-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_NAME: string;
  MDR_PAT_ADR: string;
  MDR_PAT_AGE: string;
  MDR_PAT_AILMENT: string;
  MDR_PAT_NUMBER: string;
  MDR_DOC_NUMBER: string;
  MDR_PAT_PRESCR: string;
  MDR_DIAGNOSIS: string;
  MDR_TREATMENT_PLAN: string;
  MDR_DATE_REC: string;
  PRES_MEDICATION?: string;
  PRES_DOSAGE?: string;
  PRES_FREQUENCY?: string;
}

export default function RecordsClient() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter(record =>
      record.MDR_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      record.MDR_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      record.MDR_NUMBER?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [search, records]);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return;

    try {
      const response = await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete record');

      toast.success('Medical record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete medical record');
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleSuccess = () => {
    fetchRecords();
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <FileText className="w-8 h-8 text-sky-500" />
            Medical Records
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage patient medical records and diagnoses
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Medical Record
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
          placeholder="Search by patient name, patient number, or doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-hospital pl-12"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card-hospital overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table-hospital">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient Number</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Prescription</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">
                      {search ? 'No medical records found matching your search' : 'No medical records found'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record.MDR_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{record.MDR_PAT_NAME}</td>
                      <td>{record.MDR_PAT_NUMBER}</td>
                      <td>{record.MDR_DOC_NUMBER || 'N/A'}</td>
                      <td className="max-w-xs truncate">{record.MDR_DIAGNOSIS || 'N/A'}</td>
                      <td className="max-w-xs truncate">{record.MDR_TREATMENT_PLAN || 'N/A'}</td>
                      <td className="max-w-xs truncate">
                        {record.PRES_MEDICATION 
                          ? `${record.PRES_MEDICATION} - ${record.PRES_DOSAGE || ''} ${record.PRES_FREQUENCY || ''}`.trim()
                          : record.MDR_PAT_PRESCR || 'N/A'
                        }
                      </td>
                      <td>{formatDate(record.MDR_DATE_REC)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.MDR_ID)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        className="text-sm text-slate-600 dark:text-slate-400"
      >
        Showing {filteredRecords.length} of {records.length} medical records
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <RecordsForm
            record={editingRecord}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
