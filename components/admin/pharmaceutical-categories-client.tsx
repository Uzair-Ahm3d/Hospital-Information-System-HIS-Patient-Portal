'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Tags } from 'lucide-react';
import PharmaceuticalCategoriesForm from './pharmaceutical-categories-form';
import { toast } from 'sonner';

interface PharmaceuticalCategory {
  PHARM_CAT_ID: number;
  PHARM_CAT_NAME: string;
  PHARM_CAT_VENDOR: string;
  PHARM_CAT_DESC: string;
}

export default function PharmaceuticalCategoriesClient() {
  const [categories, setCategories] = useState<PharmaceuticalCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<PharmaceuticalCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PharmaceuticalCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.PHARM_CAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      category.PHARM_CAT_VENDOR?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pharmaceutical-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load pharmaceutical categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/pharmaceutical-categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleEdit = (category: PharmaceuticalCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories();
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
            <Tags className="w-8 h-8 text-sky-400" />
            Pharmaceutical Categories
          </h1>
          <p className="text-muted mt-1">
            Manage pharmaceutical drug categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Category
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
          placeholder="Search by category name or vendor..."
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
                <th>Category Name</th>
                <th>Vendor</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted">
                      {search ? 'No categories found matching your search' : 'No categories found'}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => (
                    <motion.tr
                      key={category.PHARM_CAT_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-semibold">{category.PHARM_CAT_NAME || 'N/A'}</td>
                      <td>{category.PHARM_CAT_VENDOR || 'N/A'}</td>
                      <td className="max-w-md truncate">{category.PHARM_CAT_DESC || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.PHARM_CAT_ID)}
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
        Showing {filteredCategories.length} of {categories.length} categories
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <PharmaceuticalCategoriesForm
            category={editingCategory}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
