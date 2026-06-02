'use client';

import { motion } from 'framer-motion';
import { Activity, Calendar, Thermometer, HeartPulse, Weight, Wind, Droplets, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Vital {
  VIT_ID: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_OXYGEN_SAT: number;
  VIT_RESPIRATION: number;
  VIT_WEIGHT: number;
  VIT_RECORDED_DATE: string;
  VIT_RECORDED_BY: string;
}

interface VitalsClientProps {
  vitals: Vital[];
}

export default function VitalsClient({ vitals }: VitalsClientProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border-2 border-rose-200 dark:border-rose-800 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Vital Signs
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your vital sign measurements
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {vitals.length}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vitals Grid */}
      {vitals.length === 0 ? (
        <Card className="p-12 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20 border-2 border-rose-200 dark:border-rose-800 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 mx-auto mb-6 flex items-center justify-center shadow-md">
              <Activity className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No vital signs recorded yet</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {vitals.map((vital, index) => (
            <motion.div
              key={vital.VIT_ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Vital Signs Record
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {vital.VIT_RECORDED_DATE
                        ? new Date(vital.VIT_RECORDED_DATE).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </div>
                  </div>
                  {vital.VIT_RECORDED_BY && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>Recorded by: {vital.VIT_RECORDED_BY}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Temperature</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_BODYTEMP ? `${vital.VIT_BODYTEMP}°F` : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Blood Pressure</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_BLOOD_PRESSURE || 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <HeartPulse className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Heart Rate</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_HEARTPULSE ? `${vital.VIT_HEARTPULSE} bpm` : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">O₂ Saturation</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_OXYGEN_SAT ? `${vital.VIT_OXYGEN_SAT}%` : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-teal-200 dark:border-teal-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Respiration</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_RESPIRATION ? `${vital.VIT_RESPIRATION} /min` : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Weight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Weight</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {vital.VIT_WEIGHT ? `${vital.VIT_WEIGHT} lbs` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
