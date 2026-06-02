'use client';

import { motion } from 'framer-motion';
import { Activity, Heart } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Animated pulse rings */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl"
          />
          
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl"
          />

          {/* Main icon container */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative w-32 h-32 bg-linear-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-16 h-16 text-white" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Orbiting activity icon */}
          <motion.div
            animate={{
              rotate: [0, -360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold text-white">
            Loading HMS
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
            ))}
          </div>
          <p className="text-slate-400 text-sm">
            Please wait while we load your data
          </p>
        </motion.div>
      </div>
    </div>
  );
}
