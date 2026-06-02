'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Wrench } from 'lucide-react';
import EquipmentsForm from './equipments-form';
import { toast } from 'sonner';

interface Equipment {
  EQP_ID: number;
  EQP_CODE: string;
  EQP_NAME: string;
  EQP_VENDOR: string;
  EQP_DESC: string;
  EQP_DEPT: string;
  EQP_STATUS: string;
  EQP_QTY: string;
}

export default function EquipmentsClient() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
    const filtered = equipments.filter(equipment =>
      equipment.EQP_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      equipment.EQP_CODE?.toLowerCase().includes(search.toLowerCase()) ||
      equipment.EQP_VENDOR?.toLowerCase().includes(search.toLowerCase()) ||
      equipment.EQP_DEPT?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEquipments(filtered);
  }, [search, equipments]);

  const fetchEquipments = async () => {
    try {
      const response = await fetch('/api/equipments');
      if (!response.ok) throw new Error('Failed to fetch equipments');
      const data = await response.json();
      setEquipments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      toast.error('Failed to load equipments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      const response = await fetch(`/api/equipments?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete equipment');

      toast.success('Equipment deleted successfully');
      fetchEquipments();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const handleSuccess = () => {
    fetchEquipments();
    handleCloseForm();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      Functioning: 'badge-success',
      Maintenance: 'badge-warning',
      Broken: 'badge-danger',
      Retired: 'badge-info',
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
            <Wrench className="w-8 h-8 text-sky-400" />
            Equipment Management
          </h1>
          <p className="text-muted mt-1">
            Track and manage hospital equipment inventory
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Equipment
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
          placeholder="Search by equipment name, code, vendor, or department..."
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
                <th>Code</th>
                <th>Equipment Name</th>
                <th>Vendor</th>
                <th>Department</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredEquipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted">
                      {search ? 'No equipment found matching your search' : 'No equipment found'}
                    </td>
                  </tr>
                ) : (
                  filteredEquipments.map((equipment, index) => (
                    <motion.tr
                      key={equipment.EQP_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{equipment.EQP_CODE || 'N/A'}</td>
                      <td className="font-semibold">{equipment.EQP_NAME || 'N/A'}</td>
                      <td>{equipment.EQP_VENDOR || 'N/A'}</td>
                      <td>{equipment.EQP_DEPT || 'N/A'}</td>
                      <td>{equipment.EQP_QTY || '0'}</td>
                      <td>{getStatusBadge(equipment.EQP_STATUS)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(equipment)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(equipment.EQP_ID)}
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
        Showing {filteredEquipments.length} of {equipments.length} equipment items
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <EquipmentsForm
            equipment={editingEquipment}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
