'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Calendar, FileText, Search, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Lab {
  LAB_ID: number;
  LAB_NUMBER: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_STATUS: string;
  LAB_DATE_REC: string;
  LAB_COMPLETED_DATE: string;
  LAB_PAT_AILMENT: string;
}

interface LaboratoryClientProps {
  labs: Lab[];
}

export default function LaboratoryClient({ labs }: LaboratoryClientProps) {
  const [search, setSearch] = useState('');

  const filteredLabs = labs.filter((lab) =>
    lab.LAB_NUMBER?.toLowerCase().includes(search.toLowerCase()) ||
    lab.LAB_PAT_TESTS?.toLowerCase().includes(search.toLowerCase()) ||
    lab.LAB_STATUS?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-800 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
        };
      case 'pending':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
        };
      case 'in progress':
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
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <FlaskConical className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Lab Results
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredLabs.length} test{filteredLabs.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {labs.length}
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
          placeholder="Search by test number, test type, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 rounded-xl"
        />
      </div>

      {/* Lab Results Grid */}
      {filteredLabs.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <FlaskConical className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {search ? 'No lab results match your search' : 'No lab results yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredLabs.map((lab, index) => {
            const statusColors = getStatusColor(lab.LAB_STATUS);
            return (
              <motion.div
                key={lab.LAB_ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                          <FlaskConical className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {lab.LAB_NUMBER}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {lab.LAB_PAT_TESTS || 'Lab Test'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {lab.LAB_STATUS || 'Pending'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date Requested</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {lab.LAB_DATE_REC
                              ? new Date(lab.LAB_DATE_REC).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {lab.LAB_COMPLETED_DATE && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Date Completed</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Date(lab.LAB_COMPLETED_DATE).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {lab.LAB_PAT_AILMENT && (
                      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Ailment</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{lab.LAB_PAT_AILMENT}</p>
                      </div>
                    )}

                    {lab.LAB_PAT_RESULTS && (
                      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Results</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{lab.LAB_PAT_RESULTS}</p>
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
