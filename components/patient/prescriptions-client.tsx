'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Pill, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DOC_NAME: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
  PRES_DATE: string;
}

interface PrescriptionsClientProps {
  prescriptions: Prescription[];
}

export default function PrescriptionsClient({ prescriptions }: PrescriptionsClientProps) {
  const [search, setSearch] = useState('');

  const filteredPrescriptions = prescriptions.filter((pres) =>
    pres.PRES_MEDICATION?.toLowerCase().includes(search.toLowerCase()) ||
    pres.PRES_DOC_NAME?.toLowerCase().includes(search.toLowerCase()) 
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-800 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
        };
      case 'completed':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-800 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  My Prescriptions
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {prescriptions.length}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by medication, doctor, or prescription number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
        />
      </div>

      {/* Prescriptions Grid */}
      {filteredPrescriptions.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <Pill className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {search ? 'No prescriptions match your search' : 'No prescriptions yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPrescriptions.map((prescription, index) => {
            const statusColors = getStatusColor(prescription.PRES_STATUS);
            return (
              <motion.div
                key={prescription.PRES_ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center shadow-sm">
                          <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {prescription.PRES_MEDICATION}
                          </CardTitle>
                         
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {prescription.PRES_STATUS || 'Active'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dosage</p>
                        <p className="font-bold text-gray-900 dark:text-white">{prescription.PRES_DOSAGE || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Frequency</p>
                        <p className="font-bold text-gray-900 dark:text-white">{prescription.PRES_FREQUENCY || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                        <p className="font-bold text-gray-900 dark:text-white">{prescription.PRES_DURATION || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refills</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {prescription.PRES_REFILLS_REMAINING !== undefined ? prescription.PRES_REFILLS_REMAINING : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Prescribed by</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Dr. {prescription.PRES_DOC_NAME || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date Prescribed</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {prescription.PRES_DATE
                              ? new Date(prescription.PRES_DATE).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {prescription.PRES_NOTES && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          Additional Notes
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{prescription.PRES_NOTES}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
