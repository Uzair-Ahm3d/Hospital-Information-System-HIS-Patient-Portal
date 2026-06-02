'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Scissors } from 'lucide-react';
import SurgeryForm from './surgery-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

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
}

export default function SurgeryClient() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [filteredSurgeries, setFilteredSurgeries] = useState<Surgery[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | null>(null);

  useEffect(() => {
    fetchSurgeries();
  }, []);

  useEffect(() => {
    const filtered = surgeries.filter(surgery =>
      surgery.SURG_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      surgery.SURG_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      surgery.SURG_DOC_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      surgery.SURG_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      surgery.SURG_TYPE?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSurgeries(filtered);
  }, [search, surgeries]);

  const fetchSurgeries = async () => {
    try {
      const response = await fetch('/api/surgery');
      if (!response.ok) throw new Error('Failed to fetch surgeries');
      const data = await response.json();
      setSurgeries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      toast.error('Failed to load surgeries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this surgery record?')) return;

    try {
      const response = await fetch(`/api/surgery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete surgery');
      }

      toast.success('Surgery record deleted successfully');
      fetchSurgeries();
    } catch (error) {
      console.error('Error deleting surgery:', error);
      toast.error('Failed to delete surgery record');
    }
  };

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  const handleSuccess = () => {
    fetchSurgeries();
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <Scissors className="w-8 h-8 text-sky-500" />
            Surgery Records
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage surgical procedures and schedules
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Surgery Record
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient, doctor, theater, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-hospital pl-12"
        />
      </motion.div>

      {/* Table */}
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
                <th>Surgery Number</th>
                <th>Patient Name</th>
                <th>Patient Number</th>
                <th>Doctor</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredSurgeries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-500">
                      {search ? 'No surgeries found matching your search' : 'No surgery records found'}
                    </td>
                  </tr>
                ) : (
                  filteredSurgeries.map((surgery, index) => (
                    <motion.tr
                      key={surgery.SURG_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium text-sky-600 dark:text-sky-400">{surgery.SURG_NUMBER}</td>
                      <td className="font-medium">{surgery.SURG_PAT_NAME}</td>
                      <td>{surgery.SURG_PAT_NUMBER}</td>
                      <td>{surgery.SURG_DOC_NAME || 'N/A'}</td>
                      <td>{surgery.SURG_TYPE}</td>
                      <td>
                        <span className={`badge ${
                          surgery.SURG_STATUS === 'Completed' ? 'badge-success' :
                          surgery.SURG_STATUS === 'In Progress' ? 'badge-info' :
                          surgery.SURG_STATUS === 'Cancelled' ? 'badge-danger' :
                          'badge-warning'
                        }`}>{surgery.SURG_STATUS}</span>
                      </td>
                      <td>{formatDate(surgery.SURG_DATE)}</td>
                      <td>{surgery.SURG_DURATION || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(surgery)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(surgery.SURG_ID)}
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

      {/* Total Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-slate-600 dark:text-slate-400"
      >
        Showing {filteredSurgeries.length} of {surgeries.length} surgery records
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <SurgeryForm
            surgery={editingSurgery}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
