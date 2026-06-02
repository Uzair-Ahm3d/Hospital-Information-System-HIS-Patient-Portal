'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileHeart, Calendar, User, FileText, Activity, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_AILMENT: string;
  MDR_DIAGNOSIS: string;
  MDR_TREATMENT_PLAN: string;
  MDR_PAT_PRESCR: string;
  MDR_DATE_REC: string;
  MDR_DOC_NUMBER: string;
  DOC_NAME: string;
  PRES_MEDICATION?: string;
  PRES_DOSAGE?: string;
  PRES_FREQUENCY?: string;
  PRES_DURATION?: string;
  PRES_NOTES?: string;
}

interface RecordsClientProps {
  records: MedicalRecord[];
}

export default function RecordsClient({ records }: RecordsClientProps) {
  const [search, setSearch] = useState('');

  const filteredRecords = records.filter((record) =>
    record.MDR_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
    record.MDR_PAT_AILMENT?.toLowerCase().includes(search.toLowerCase()) ||
    record.MDR_DIAGNOSIS?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <FileHeart className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Records
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {records.length}
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
          placeholder="Search by record number, ailment, or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl"
        />
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <FileHeart className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {search ? 'No records match your search' : 'No medical records yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.MDR_ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-sm">
                      <FileHeart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {record.MDR_NUMBER}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {record.MDR_DATE_REC
                            ? new Date(record.MDR_DATE_REC).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </span>
                        {record.DOC_NAME && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Dr. {record.DOC_NAME}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {record.MDR_PAT_AILMENT && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <p className="text-sm font-semibold text-rose-900 dark:text-rose-300">Ailment</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{record.MDR_PAT_AILMENT}</p>
                    </div>
                  )}

                  {record.MDR_DIAGNOSIS && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Diagnosis</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{record.MDR_DIAGNOSIS}</p>
                    </div>
                  )}

                  {record.MDR_TREATMENT_PLAN && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Treatment Plan</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{record.MDR_TREATMENT_PLAN}</p>
                    </div>
                  )}

                  {record.MDR_PAT_PRESCR && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Prescription ({record.MDR_PAT_PRESCR})</p>
                      </div>
                      {record.PRES_MEDICATION ? (
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div><span className="font-semibold">Medication:</span> {record.PRES_MEDICATION}</div>
                          {record.PRES_DOSAGE && <div><span className="font-semibold">Dosage:</span> {record.PRES_DOSAGE}</div>}
                          {record.PRES_FREQUENCY && <div><span className="font-semibold">Frequency:</span> {record.PRES_FREQUENCY}</div>}
                          {record.PRES_DURATION && <div><span className="font-semibold">Duration:</span> {record.PRES_DURATION}</div>}
                          {record.PRES_NOTES && <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-700"><span className="font-semibold">Notes:</span> {record.PRES_NOTES}</div>}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">Prescription details not available</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
