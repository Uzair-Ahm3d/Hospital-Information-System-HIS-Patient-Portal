'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, ArrowLeftRight } from 'lucide-react';
import PatientTransfersForm from './patient-transfers-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface PatientTransfer {
  PT_ID: number;
  PT_PAT_NUMBER: string;
  PT_PAT_NAME: string;
  PT_FROM_WARD: string;
  PT_TO_WARD: string;
  PT_REASON: string;
  PT_TRANSFER_DATE: string;
  PT_AUTHORIZED_BY: string;
  PT_STATUS: string;
}

export default function PatientTransfersClient() {
  const [transfers, setTransfers] = useState<PatientTransfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<PatientTransfer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<PatientTransfer | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  useEffect(() => {
    const filtered = transfers.filter(transfer =>
      transfer.PT_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      transfer.PT_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      transfer.PT_FROM_WARD?.toLowerCase().includes(search.toLowerCase()) ||
      transfer.PT_TO_WARD?.toLowerCase().includes(search.toLowerCase()) ||
      transfer.PT_STATUS?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTransfers(filtered);
  }, [search, transfers]);

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/patient-transfers');
      if (!response.ok) throw new Error('Failed to fetch transfers');
      const data = await response.json();
      setTransfers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast.error('Failed to load patient transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transfer record?')) return;

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

  const handleEdit = (transfer: PatientTransfer) => {
    setEditingTransfer(transfer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransfer(null);
  };

  const handleSuccess = () => {
    fetchTransfers();
    handleCloseForm();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      Pending: 'badge-warning',
      Completed: 'badge-success',
      Cancelled: 'badge-danger',
      'In Progress': 'badge-info',
    };

    return (
      <span className={`badge ${statusColors[status] || 'badge-info'}`}>
        {status}
      </span>
    );
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
            <ArrowLeftRight className="w-8 h-8 text-sky-400" />
            Patient Transfers
          </h1>
          <p className="text-muted mt-1">
            Manage patient transfer records to other facilities
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Transfer
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
          placeholder="Search by patient name, number, hospital, or status..."
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
                <th>Patient Name</th>
                <th>Patient Number</th>
                <th>From Ward</th>
                <th>To Ward</th>
                <th>Transfer Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted">
                      {search ? 'No transfers found matching your search' : 'No transfers found'}
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((transfer, index) => (
                    <motion.tr
                      key={transfer.PT_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-semibold">{transfer.PT_PAT_NAME || 'N/A'}</td>
                      <td className="font-medium">{transfer.PT_PAT_NUMBER || 'N/A'}</td>
                      <td>{transfer.PT_FROM_WARD || 'N/A'}</td>
                      <td>{transfer.PT_TO_WARD || 'N/A'}</td>
                      <td>{formatDate(transfer.PT_TRANSFER_DATE)}</td>
                      <td>{getStatusBadge(transfer.PT_STATUS)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(transfer)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transfer.PT_ID)}
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
        Showing {filteredTransfers.length} of {transfers.length} transfers
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <PatientTransfersForm
            transfer={editingTransfer}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
