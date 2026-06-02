'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Building2 } from 'lucide-react';
import VendorsForm from './vendors-form';
import { toast } from 'sonner';

interface Vendor {
  V_ID: number;
  V_NUMBER: string;
  V_NAME: string;
  V_ADR: string;
  V_MOBILE: string;
  V_EMAIL: string;
  V_PHONE: string;
  V_DESC: string;
}

export default function VendorsClient() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.V_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.V_EMAIL?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.V_PHONE?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.V_NUMBER?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [search, vendors]);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      const response = await fetch(`/api/vendors?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete vendor');

      toast.success('Vendor deleted successfully');
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVendor(null);
  };

  const handleSuccess = () => {
    fetchVendors();
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
            <Building2 className="w-8 h-8 text-sky-400" />
            Vendor Management
          </h1>
          <p className="text-muted mt-1">
            Manage pharmaceutical and equipment vendors
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vendor
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
          placeholder="Search by vendor name, email, phone, or number..."
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
                <th>Vendor Number</th>
                <th>Vendor Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      {search ? 'No vendors found matching your search' : 'No vendors found'}
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor, index) => (
                    <motion.tr
                      key={vendor.V_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{vendor.V_NUMBER || 'N/A'}</td>
                      <td className="font-semibold">{vendor.V_NAME || 'N/A'}</td>
                      <td className="max-w-xs truncate">{vendor.V_ADR || 'N/A'}</td>
                      <td>
                        <div className="text-sm">
                          {vendor.V_PHONE && <div>📞 {vendor.V_PHONE}</div>}
                          {vendor.V_MOBILE && <div>📱 {vendor.V_MOBILE}</div>}
                        </div>
                      </td>
                      <td>{vendor.V_EMAIL || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(vendor)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vendor.V_ID)}
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
        Showing {filteredVendors.length} of {vendors.length} vendors
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <VendorsForm
            vendor={editingVendor}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
