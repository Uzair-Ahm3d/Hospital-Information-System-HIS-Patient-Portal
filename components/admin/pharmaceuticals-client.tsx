'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Pill } from 'lucide-react';
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
import { PharmaceuticalForm } from './pharmaceutical-form';
import { toast } from 'sonner';

interface Pharmaceutical {
  PHAR_ID: number;
  PHAR_NAME: string;
  PHAR_BCODE: string;
  PHAR_DESC: string;
  PHAR_QTY: number;
  PHAR_CAT: string;
  PHAR_VENDOR: string;
}

export default function PharmaceuticalsClient() {
  const [pharmaceuticals, setPharmaceuticals] = useState<Pharmaceutical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pharmaceutical | undefined>();

  const fetchPharmaceuticals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pharmaceuticals');
      
      if (!res.ok) {
        throw new Error('Failed to fetch pharmaceuticals');
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setPharmaceuticals(data);
      } else {
        console.error('Invalid data format:', data);
        setPharmaceuticals([]);
        toast({
          title: 'Error',
          description: data.error || 'Failed to load pharmaceuticals',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching pharmaceuticals:', error);
      setPharmaceuticals([]);
      toast({
        title: 'Error',
        description: 'Failed to load pharmaceuticals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaceuticals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this pharmaceutical?')) return;

    try {
      const res = await fetch(`/api/pharmaceuticals?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete pharmaceutical');

      toast.success('Pharmaceutical deleted successfully');
      fetchPharmaceuticals();
    } catch {
      toast.error('Failed to delete pharmaceutical');
    }
  }

  function handleEdit(item: Pharmaceutical) {
    setSelectedItem(item);
    setFormOpen(true);
  }

  function handleAddNew() {
    setSelectedItem(undefined);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    toast.success(`Pharmaceutical ${selectedItem ? 'updated' : 'added'} successfully`);
    fetchPharmaceuticals();
  }

  const filteredItems = pharmaceuticals.filter((item) =>
    `${item.PHAR_NAME} ${item.PHAR_VENDOR} ${item.PHAR_CAT}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );



  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-heading">
              Pharmaceuticals
            </h1>
            <p className="text-muted mt-1">Manage medicine inventory and vendors</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-glass p-4 animate-slide-in-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <Input
                placeholder="Search by product name or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-hospital pl-10 h-11"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card overflow-hidden animate-slide-in-up">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-sky-600 dark:text-sky-400" />
                <p className="text-body font-medium">Loading pharmaceuticals...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-2">
                <p className="text-body font-medium text-lg">No pharmaceuticals found</p>
                <p className="text-muted text-sm">Try adjusting your search or add a new product</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Barcode</th>
                      <th>Category</th>
                      <th>Vendor</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  <AnimatePresence>
                    {filteredItems.map((item, index) => (
                      <motion.tr
                        key={item.PHAR_ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-sky-400" />
                            {item.PHAR_NAME}
                          </div>
                        </td>
                        <td className="font-mono text-sm">{item.PHAR_BCODE}</td>
                        <td>
                          <Badge className="badge badge-purple">
                            {item.PHAR_CAT}
                          </Badge>
                        </td>
                        <td>{item.PHAR_VENDOR}</td>
                        <td>
                          <Badge
                            className={
                              item.PHAR_QTY > 50
                                ? 'badge badge-success'
                                : 'badge badge-danger'
                            }
                          >
                            {item.PHAR_QTY} units
                          </Badge>
                        </td>
                        <td className="text-sm max-w-xs truncate">
                          {item.PHAR_DESC || 'N/A'}
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all hover-lift"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(item.PHAR_ID)}
                              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all hover-lift"
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
          </Card>
        </motion.div>
      </div>

      <PharmaceuticalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        pharmaceutical={selectedItem}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
