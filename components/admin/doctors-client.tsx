'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Mail, Stethoscope } from 'lucide-react';
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
import { DoctorForm } from './doctor-form';
import { toast } from 'sonner';

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_EMAIL: string;
  DOC_DEPT: string;
  DOC_NUMBER: string;
}

export default function DoctorsClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>();

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      const res = await fetch('/api/doctors');
      
      if (!res.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        console.error('Invalid data format:', data);
        setDoctors([]);
        toast({
          title: 'Error',
          description: data.error || 'Failed to load doctors',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      toast({
        title: 'Error',
        description: 'Failed to load doctors. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const res = await fetch(`/api/doctors?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete doctor');

      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    }
  }

  function handleEdit(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setFormOpen(true);
  }

  function handleAddNew() {
    setSelectedDoctor(undefined);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    toast.success(`Doctor ${selectedDoctor ? 'updated' : 'added'} successfully`);
    fetchDoctors();
  }

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.DOC_FNAME} ${doctor.DOC_LNAME} ${doctor.DOC_EMAIL} ${doctor.DOC_DEPT}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const deptColors: Record<string, string> = {
    Cardiology: 'badge-danger',
    Surgery: 'badge-info',
    Nursing: 'badge-success',
    Pediatrics: 'badge-warning',
    Radiology: 'badge-purple',
    Neurology: 'badge-purple',
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-heading">
              Doctors
            </h1>
            <p className="text-muted mt-1">Manage medical staff</p>
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
              <span>Add New Doctor</span>
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
                placeholder="Search doctors by name, email, or department..."
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
                <p className="text-body font-medium">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-2">
                <p className="text-body font-medium text-lg">No doctors found</p>
                <p className="text-muted text-sm">Try adjusting your search or add a new doctor</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Doctor ID</th>
                      <th className="w-56">Name</th>
                      <th className="w-64">Email</th>
                      <th className="w-48">Department</th>
                      <th className="text-right w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  <AnimatePresence>
                    {filteredDoctors.map((doctor, index) => (
                      <motion.tr
                        key={doctor.DOC_ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="font-medium text-sky-400">
                          {doctor.DOC_NUMBER}
                        </td>
                        <td>
                          <div className="flex items-center gap-2 font-medium">
                            <Stethoscope className="w-4 h-4 text-sky-400" />
                            {doctor.DOC_FNAME} {doctor.DOC_LNAME}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted" />
                            {doctor.DOC_EMAIL}
                          </div>
                        </td>
                        <td>
                          <Badge className={deptColors[doctor.DOC_DEPT] || 'badge badge-info'}>
                            {doctor.DOC_DEPT}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(doctor)}
                              className="hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all hover-lift"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(doctor.DOC_ID)}
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

      <DoctorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        doctor={selectedDoctor}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
