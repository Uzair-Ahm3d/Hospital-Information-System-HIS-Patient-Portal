'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PatientDetailModal } from './patient-detail-modal';
import { PatientForm } from './patient-form';
import { toast } from 'sonner';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_AGE: string;
  PAT_PHONE: string;
  PAT_TYPE: string;
  PAT_AILMENT: string;
  PAT_DISCHARGE_STATUS: string;
}

export default function PatientsClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      `${patient.PAT_FNAME} ${patient.PAT_LNAME} ${patient.PAT_NUMBER}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [search, patients]);

  async function fetchPatients() {
    try {
      setLoading(true);
      const res = await fetch('/api/patients');
      
      if (!res.ok) {
        throw new Error('Failed to fetch patients');
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error('Invalid data format:', data);
        setPatients([]);
        toast.error(data.error || 'Failed to load patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      const res = await fetch(`/api/patients?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete patient');

      toast.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(undefined);
  };

  const handleSuccess = () => {
    fetchPatients();
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
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-heading flex items-center gap-3">
              <Users className="w-8 h-8 text-sky-400" />
              Patient Management
            </h1>
            <p className="text-muted mt-1">
              Manage all patient records
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Patient
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
            placeholder="Search patients by name or number..."
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
                  <th>Patient #</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Ailment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-muted">
                        {search ? 'No patients found matching your search' : 'No patients found'}
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <motion.tr
                        key={patient.PAT_ID}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td 
                          className="font-medium text-sky-600 dark:text-sky-400 cursor-pointer hover:underline"
                          onClick={() => setDetailPatient(patient)}
                        >
                          {patient.PAT_NUMBER}
                        </td>
                        <td 
                          className="font-semibold cursor-pointer hover:underline"
                          onClick={() => setDetailPatient(patient)}
                        >
                          {patient.PAT_FNAME} {patient.PAT_LNAME}
                        </td>
                        <td>{patient.PAT_AGE}</td>
                        <td>{patient.PAT_PHONE}</td>
                        <td>
                          <span
                            className={`badge ${
                              patient.PAT_TYPE === 'InPatient'
                                ? 'badge-info'
                                : 'badge-success'
                            }`}
                          >
                            {patient.PAT_TYPE}
                          </span>
                        </td>
                        <td className="max-w-xs truncate">
                          {patient.PAT_AILMENT}
                        </td>
                        <td>
                          {patient.PAT_DISCHARGE_STATUS || 'Active'}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(patient)}
                              className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient.PAT_ID)}
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
          Showing {filteredPatients.length} of {patients.length} patients
        </motion.div>
      </div>

      <PatientDetailModal
        open={!!detailPatient}
        onClose={() => setDetailPatient(null)}
        patient={detailPatient}
      />

      <AnimatePresence>
        {showForm && (
          <PatientForm
            open={showForm}
            onClose={handleCloseForm}
            patient={editingPatient}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}
