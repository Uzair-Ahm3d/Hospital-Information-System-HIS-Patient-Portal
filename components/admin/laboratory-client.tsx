'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LaboratoryForm } from './laboratory-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Laboratory {
  LAB_ID: number;
  LAB_PAT_NAME: string;
  LAB_PAT_AILMENT: string;
  LAB_PAT_NUMBER: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_NUMBER: string;
  LAB_DATE_REC: string;
}

export default function LaboratoryClient() {
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Laboratory | undefined>();

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/laboratory');
      
      if (!res.ok) {
        throw new Error('Failed to fetch laboratory records');
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setLabs(data);
      } else {
        console.error('Invalid data format:', data);
        setLabs([]);
        toast.error(data.error || 'Failed to load laboratory records');
      }
    } catch (error) {
      console.error('Error fetching labs:', error);
      setLabs([]);
      toast.error('Failed to load laboratory records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this laboratory record?')) return;

    try {
      const res = await fetch(`/api/laboratory?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete laboratory record');

      toast.success('Laboratory record deleted successfully');
      fetchLabs();
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete laboratory test');
    }
  }

  function handleEdit(lab: Laboratory) {
    setSelectedLab(lab);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setSelectedLab(undefined);
  }

  function handleSuccess() {
    handleCloseForm();
    fetchLabs();
  }

  const filteredLabs = labs.filter(lab =>
    lab.LAB_PAT_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.LAB_PAT_NUMBER.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.LAB_NUMBER.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">Laboratory Records</h1>
          <p className="text-muted mt-1">Manage patient laboratory tests and results</p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>New Lab Record</span>
        </Button>
      </div>

      <Card className="card-glass">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search by patient name, patient number, or lab number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-hospital"
            />
          </div>
        </div>
      </Card>

      <Card className="card">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-2">
              <p className="text-body font-medium text-lg">No laboratory records found</p>
              <p className="text-muted text-sm">Try adjusting your search or add a new record</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-hospital">
                <thead>
                  <tr>
                    <th>Lab #</th>
                    <th>Patient Name</th>
                    <th>Patient #</th>
                    <th>Ailment</th>
                    <th>Tests</th>
                    <th>Results</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                <AnimatePresence>
                  {filteredLabs.map((lab, index) => (
                    <motion.tr
                      key={lab.LAB_ID}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <td className="font-medium text-sky-600 dark:text-sky-400">
                        {lab.LAB_NUMBER}
                      </td>
                      <td className="font-medium">{lab.LAB_PAT_NAME}</td>
                      <td>{lab.LAB_PAT_NUMBER}</td>
                      <td className="max-w-xs truncate">{lab.LAB_PAT_AILMENT}</td>
                      <td className="max-w-xs truncate">{lab.LAB_PAT_TESTS}</td>
                      <td className="max-w-xs truncate">
                        {lab.LAB_PAT_RESULTS || (
                          <Badge className="badge badge-warning">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {formatDate(lab.LAB_DATE_REC)}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(lab)}
                            className="hover-lift"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(lab.LAB_ID)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover-lift"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {formOpen && (
          <LaboratoryForm
            open={formOpen}
            lab={selectedLab}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
