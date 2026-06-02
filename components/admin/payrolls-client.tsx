'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, DollarSign } from 'lucide-react';
import PayrollsForm from './payrolls-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Payroll {
  PAY_ID: number;
  PAY_NUMBER: string;
  PAY_DOC_NAME: string;
  PAY_DOC_NUMBER: string;
  PAY_DOC_EMAIL: string;
  PAY_AMOUNT: number;
  PAY_PERIOD: string;
  PAY_STATUS: string;
  PAY_DATE: string;
  PAY_METHOD: string;
}

export default function PayrollsClient() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState<Payroll[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  useEffect(() => {
    const filtered = payrolls.filter(payroll =>
      payroll.PAY_DOC_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      payroll.PAY_DOC_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      payroll.PAY_NUMBER?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPayrolls(filtered);
  }, [search, payrolls]);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch('/api/payrolls');
      if (!response.ok) throw new Error('Failed to fetch payrolls');
      const data = await response.json();
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      toast.error('Failed to load payrolls');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payroll record?')) return;

    try {
      const response = await fetch(`/api/payrolls?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete payroll');

      toast.success('Payroll record deleted successfully');
      fetchPayrolls();
    } catch (error) {
      console.error('Error deleting payroll:', error);
      toast.error('Failed to delete payroll record');
    }
  };

  const handleEdit = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayroll(null);
  };

  const handleSuccess = () => {
    fetchPayrolls();
    handleCloseForm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
            <DollarSign className="w-8 h-8 text-sky-400" />
            Payroll Management
          </h1>
          <p className="text-muted mt-1">
            Manage employee payroll and salaries
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payroll Record
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
          placeholder="Search by employee name, number, or role..."
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
                <th>Payroll #</th>
                <th>Doctor Name</th>
                <th>Doctor Number</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Period</th>
                <th>Status</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-muted">
                      {search ? 'No payroll records found matching your search' : 'No payroll records found'}
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((payroll, index) => (
                    <motion.tr
                      key={payroll.PAY_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-medium text-sky-400">{payroll.PAY_NUMBER}</td>
                      <td className="font-medium">{payroll.PAY_DOC_NAME}</td>
                      <td>{payroll.PAY_DOC_NUMBER}</td>
                      <td>{payroll.PAY_DOC_EMAIL}</td>
                      <td className="font-semibold text-sky-600 dark:text-sky-400">${payroll.PAY_AMOUNT?.toFixed(2)}</td>
                      <td>{payroll.PAY_PERIOD || 'N/A'}</td>
                      <td>
                        <span className={`badge ${payroll.PAY_STATUS === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                          {payroll.PAY_STATUS}
                        </span>
                      </td>
                      <td>{formatDate(payroll.PAY_DATE)}</td>
                      <td>{payroll.PAY_METHOD || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(payroll)}
                            className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(payroll.PAY_ID)}
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
        Showing {filteredPayrolls.length} of {payrolls.length} payroll records
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <PayrollsForm
            payroll={editingPayroll}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
