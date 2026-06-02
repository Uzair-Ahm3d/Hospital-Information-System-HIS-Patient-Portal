'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Calendar, User, Clock, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_TYPE: string;
  SURG_DOC_NAME: string;
  SURG_DATE: string;
  SURG_DURATION: string;
  SURG_STATUS: string;
  SURG_NOTES: string;
}

interface SurgeriesClientProps {
  surgeries: Surgery[];
}

export default function SurgeriesClient({ surgeries }: SurgeriesClientProps) {
  const [search, setSearch] = useState('');

  const filteredSurgeries = surgeries.filter((surgery) =>
    surgery.SURG_TYPE?.toLowerCase().includes(search.toLowerCase()) ||
    surgery.SURG_DOC_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    surgery.SURG_NUMBER?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-800 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
        };
      case 'scheduled':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
        };
      case 'in progress':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
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
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Scissors className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Surgery Records
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredSurgeries.length} surger{filteredSurgeries.length !== 1 ? 'ies' : 'y'} found
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {surgeries.length}
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
          placeholder="Search by surgery type, doctor, or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl"
        />
      </div>

      {/* Surgeries Grid */}
      {filteredSurgeries.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <Scissors className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {search ? 'No surgeries match your search' : 'No surgery records yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredSurgeries.map((surgery, index) => {
            const statusColors = getStatusColor(surgery.SURG_STATUS);
            return (
              <motion.div
                key={surgery.SURG_ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-sm">
                          <Scissors className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {surgery.SURG_TYPE || 'Surgery'}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Surgery #{surgery.SURG_NUMBER}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {surgery.SURG_STATUS || 'Scheduled'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Surgeon</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Dr. {surgery.SURG_DOC_NAME || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Surgery Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {surgery.SURG_DATE
                              ? new Date(surgery.SURG_DATE).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {surgery.SURG_DURATION || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {surgery.SURG_NOTES && (
                      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Surgery Notes</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{surgery.SURG_NOTES}</p>
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
