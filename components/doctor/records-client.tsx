'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_NUMBER: string;
  MDR_PAT_NAME: string;
  MDR_PAT_AGE: string;
  MDR_PAT_ADR: string;
  MDR_PAT_AILMENT: string;
  MDR_PAT_PRESCR: string;
  MDR_DOC_NUMBER?: string;
  MDR_DIAGNOSIS?: string;
  MDR_TREATMENT_PLAN?: string;
  MDR_DATE_REC: string;
  IS_OWN_RECORD?: 'Y' | 'N';
}

interface RecordsClientProps {
  doctorId: string;
}

export default function RecordsClient({ doctorId }: RecordsClientProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}/records`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch medical records: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched records:', data);
      
      const recordsArray = Array.isArray(data) ? data : [];
      setRecords(recordsArray);
      setFilteredRecords(recordsArray);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
      setRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    const filtered = records.filter(record =>
      record.MDR_PAT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      record.MDR_PAT_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      record.MDR_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
      record.MDR_PAT_AILMENT?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [search, records]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Medical Records</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {filteredRecords.length} records • {filteredRecords.filter(r => r.IS_OWN_RECORD === 'Y').length} your records, {filteredRecords.filter(r => r.IS_OWN_RECORD === 'N').length} historical
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by patient name, patient number, record number, or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
        />
      </div>

      {filteredRecords.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 shadow-lg">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FileText className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {search ? 'No Records Found' : 'No Medical Records'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {search ? 'Try adjusting your search terms' : 'Medical records will appear here as they are created'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5">
          <AnimatePresence>
            {filteredRecords.map((record, index) => {
              const isOwn = record.IS_OWN_RECORD === 'Y';
              
              return (
                <motion.div
                  key={record.MDR_ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-white dark:bg-gray-800 border-2 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    isOwn ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className={`h-2 ${isOwn ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-2xl p-3.5 flex items-center justify-center shadow-lg ${
                            isOwn 
                              ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
                          }`}>
                            <FileText className={`w-7 h-7 ${isOwn ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                Record #{record.MDR_NUMBER}
                              </CardTitle>
                              {isOwn ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 shadow-sm">
                                  Your Record
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                                  Historical
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white">{record.MDR_PAT_NAME}</span>
                              <span>•</span>
                              <span>{record.MDR_PAT_NUMBER}</span>
                              <span>•</span>
                              <span>Age {record.MDR_PAT_AGE}</span>
                              <span>•</span>
                              <span>{formatDate(record.MDR_DATE_REC)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Ailment</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {record.MDR_PAT_AILMENT || 'Not specified'}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Diagnosis</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {record.MDR_DIAGNOSIS || 'Pending diagnosis'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Treatment Plan</span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">
                          {record.MDR_TREATMENT_PLAN || 'No treatment plan specified'}
                        </p>
                      </div>

                      {record.MDR_PAT_PRESCR && (
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Prescription</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">
                            {record.MDR_PAT_PRESCR}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Showing <span className="text-emerald-600 dark:text-emerald-400 font-bold">{filteredRecords.length}</span> of <span className="font-bold">{records.length}</span> records
        </div>
        {filteredRecords.length > 0 && (
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500"></div>
              <span className="text-gray-700 dark:text-gray-300">
                {filteredRecords.filter(r => r.IS_OWN_RECORD === 'Y').length} Your Records
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
              <span className="text-gray-700 dark:text-gray-300">
                {filteredRecords.filter(r => r.IS_OWN_RECORD === 'N').length} Historical
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
