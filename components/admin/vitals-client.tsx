'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Activity } from 'lucide-react';
import VitalsForm from './vitals-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Vitals {
  VIT_ID: number;
  VIT_PAT_NUMBER: string;
  VIT_PAT_NAME: string;
  VIT_BODYTEMP: number;
  VIT_HEARTPULSE: number;
  VIT_RESPIRATION: number;
  VIT_WEIGHT: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_OXYGEN_SAT: number;
  VIT_RECORDED_BY: string;
  VIT_RECORDED_DATE: string;
}

export default function VitalsClient() {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [filteredVitals, setFilteredVitals] = useState<Vitals[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVitals, setEditingVitals] = useState<Vitals | null>(null);

  useEffect(() => {
    fetchVitals();
  }, []);

  useEffect(() => {
    const filtered = vitals.filter(vital =>
      vital.VIT_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      vital.VIT_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      vital.VIT_RECORDED_BY?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVitals(filtered);
  }, [search, vitals]);

  const fetchVitals = async () => {
    try {
      const response = await fetch('/api/vitals');
      if (!response.ok) throw new Error('Failed to fetch vitals');
      const data = await response.json();
      setVitals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vitals:', error);
      toast.error('Failed to load vitals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vitals record?')) return;

    try {
      const response = await fetch(`/api/vitals?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete vitals');

      toast.success('Vitals record deleted successfully');
      fetchVitals();
    } catch (error) {
      console.error('Error deleting vitals:', error);
      toast.error('Failed to delete vitals record');
    }
  };

  const handleEdit = (vital: Vitals) => {
    setEditingVitals(vital);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVitals(null);
  };

  const handleSuccess = () => {
    fetchVitals();
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
            <Activity className="w-8 h-8 text-sky-500" />
            Patient Vitals
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor and track patient vital signs
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vitals Record
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
          placeholder="Search by patient name or number..."
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
                <th>Patient Number</th>
                <th>Patient Name</th>
                <th>Temperature (°C)</th>
                <th>Heart Pulse</th>
                <th>Blood Pressure</th>
                <th>Respiration</th>
                <th>Weight (kg)</th>
                <th>Oxygen Sat (%)</th>
                <th>Recorded By</th>
                <th>Date Recorded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredVitals.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-slate-500">
                      {search ? 'No vitals found matching your search' : 'No vitals records found'}
                    </td>
                  </tr>
                ) : (
                  filteredVitals.map((vital, index) => (
                    <motion.tr
                      key={vital.VIT_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{vital.VIT_PAT_NUMBER}</td>
                      <td>{vital.VIT_PAT_NAME}</td>
                      <td>{vital.VIT_BODYTEMP || 'N/A'}</td>
                      <td>{vital.VIT_HEARTPULSE || 'N/A'}</td>
                      <td>{vital.VIT_BLOOD_PRESSURE || 'N/A'}</td>
                      <td>{vital.VIT_RESPIRATION || 'N/A'}</td>
                      <td>{vital.VIT_WEIGHT || 'N/A'}</td>
                      <td>{vital.VIT_OXYGEN_SAT || 'N/A'}</td>
                      <td>{vital.VIT_RECORDED_BY || 'N/A'}</td>
                      <td>{formatDate(vital.VIT_RECORDED_DATE)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(vital)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(vital.VIT_ID)}
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
        Showing {filteredVitals.length} of {vitals.length} vitals records
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <VitalsForm
            vitals={editingVitals}
            open={showForm}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
