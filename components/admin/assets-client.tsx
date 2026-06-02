'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Package } from 'lucide-react';
import AssetsForm from './assets-form';
import { toast } from 'sonner';

interface Asset {
  ASST_ID: number;
  ASST_NAME: string;
  ASST_DESC: string;
  ASST_VENDOR: string;
  ASST_STATUS: string;
  ASST_DEPT: string;
}

export default function AssetsClient() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const filtered = assets.filter(asset =>
      asset.ASST_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      asset.ASST_DEPT?.toLowerCase().includes(search.toLowerCase()) ||
      asset.ASST_VENDOR?.toLowerCase().includes(search.toLowerCase()) ||
      asset.ASST_STATUS?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [search, assets]);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      toast.success('Asset deleted successfully');
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleSuccess = () => {
    fetchAssets();
    handleCloseForm();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      Active: 'badge-success',
      Maintenance: 'badge-warning',
      Retired: 'badge-info',
      Damaged: 'badge-danger',
      Functioning: 'badge-success',
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
            <Package className="w-8 h-8 text-sky-400" />
            Asset Management
          </h1>
          <p className="text-muted mt-1">
            Track and manage hospital assets and equipment
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Asset
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
          placeholder="Search by asset name, category, department, or serial number..."
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
                <th>Asset Name</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      {search ? 'No assets found matching your search' : 'No assets found'}
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset, index) => (
                    <motion.tr
                      key={asset.ASST_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium">{asset.ASST_NAME || 'N/A'}</td>
                      <td className="max-w-xs truncate">{asset.ASST_DESC || 'N/A'}</td>
                      <td>{asset.ASST_VENDOR || 'N/A'}</td>
                      <td>{asset.ASST_DEPT || 'N/A'}</td>
                      <td>{getStatusBadge(asset.ASST_STATUS)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(asset)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset.ASST_ID)}
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
        Showing {filteredAssets.length} of {assets.length} assets
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <AssetsForm
            asset={editingAsset}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
