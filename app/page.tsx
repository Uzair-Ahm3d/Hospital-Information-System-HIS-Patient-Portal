'use client';

import { motion } from 'framer-motion';
import { Stethoscope, Users, Activity, Shield, Heart, FileText, Calendar, Zap, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive patient records and history tracking with intelligent search',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Activity,
      title: 'Real-time Vitals',
      description: 'Monitor and track patient vital signs with live updates',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Stethoscope,
      title: 'Doctor Portal',
      description: 'Dedicated portal for medical professionals with advanced tools',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'HIPAA compliant and enterprise-grade data security',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: FileText,
      title: 'Digital Records',
      description: 'Paperless medical records with instant access anywhere',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automated appointment scheduling and management system',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated grid pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="grid-pattern fixed inset-0 dark:opacity-20"
      />
      
      {/* Combined Heartbeat ECG & Pulse Animation */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Expanding pulse circles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute rounded-full border-2 border-blue-400/30 dark:border-blue-500/40"
            style={{ width: '200px', height: '200px' }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 3.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.75,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* ECG Heartbeat Line */}
        <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" className="absolute opacity-30 dark:opacity-20">
          <defs>
            <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            d="M0,200 L200,200 L220,200 L230,180 L240,200 L250,140 L260,260 L270,200 L290,200 L1200,200"
            stroke="url(#ecg-gradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.9, 1],
            }}
          />
        </svg>
        
        {/* Central pulsing heart */}
        <motion.div
          className="absolute z-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
        >
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-24 h-24 text-red-500/40 dark:text-red-400/30 fill-red-500/30 dark:fill-red-400/20" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="border-b border-blue-200 dark:border-blue-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-blue-500/10"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-linear-to-br from-blue-600/40 to-purple-600/40 rounded-xl backdrop-blur-sm border border-blue-400/30 hover-lift">
              <Stethoscope className="w-7 h-7 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                HMS Pro
              </span>
              <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">Healthcare Excellence</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/login">
              <Button className="btn-primary px-6 py-2 rounded-lg font-semibold border-0">
                Sign In →
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block"
            >
              <div className="px-5 py-2.5 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/40 backdrop-blur-sm hover-lift shadow-lg shadow-blue-500/20">
                <span className="text-blue-700 dark:text-blue-200 text-sm font-semibold">
                  ⚡ Next-Generation Healthcare Platform
                </span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-tight"
            >
              <motion.div
                className="block text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Modern Healthcare
              </motion.div>
              <motion.div
                className="relative inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Management System
                </span>
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-lg md:text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive digital platform designed to streamline hospital operations, 
              enhance patient care, and empower healthcare professionals with real-time insights.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex justify-center items-center"
          >
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="btn-primary text-base px-10 py-6 rounded-xl font-semibold border-0 shadow-xl shadow-blue-500/30">
                  Get Started →
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center items-center pt-10"
          >
            {[
              { icon: Zap, text: 'Lightning Fast', color: 'text-yellow-600 dark:text-yellow-400' },
              { icon: Lock, text: 'Bank-Level Security', color: 'text-green-600 dark:text-green-400' },
              { icon: Shield, text: 'HIPAA Compliant', color: 'text-blue-600 dark:text-blue-400' },
            ].map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm"
                >
                  <Icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{badge.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.9 + index * 0.08, 
                  duration: 0.5,
                }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10`}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <CardContent className="relative p-7 space-y-4 z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg relative`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="mt-32 text-center relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative inline-block px-12 py-10 rounded-2xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-800/95 dark:to-slate-900/95 border border-blue-300/50 dark:border-purple-500/50 backdrop-blur-xl shadow-xl"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 mt-3">
              Ready to Transform Your Healthcare?
            </h2>
            
            <p className="text-gray-600 dark:text-slate-300 text-base mb-6 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using our platform to deliver exceptional patient care
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-5 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Bank-Level Security</span>
              </div>
            </div>
            
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="btn-primary text-base px-12 py-5 rounded-xl font-semibold border-0 shadow-lg shadow-blue-500/30">
                  Start Your Journey →
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
