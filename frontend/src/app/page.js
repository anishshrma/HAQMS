'use client';

import Link from 'next/link';
import { Activity, ShieldAlert, MonitorPlay, Users, CalendarDays, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full text-center mt-12 sm:mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 animate-pulse">
          <Activity className="h-4 w-4" />
          Live Queue Tracking Enabled
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          HAQMS
        </h1>
        <p className="text-xl sm:text-2xl font-bold mt-2 text-slate-700 dark:text-slate-200">
          Hospital Appointment & Queue Management System
        </p>
        
        <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Welcome to the HAQMS testing environment. This portal serves as a deliberately flawed, 
          fully functional reference application designed to evaluate software engineering candidates.
        </p>

        {/* Action Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Card 1: Staff Portal */}
          <Link href="/login" className="group">
            <div className="glass p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-left hover:border-teal-500/50 hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl w-fit group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Staff Portal
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                Access your specialized dashboard. Supports role-based workflows for Administrators, Doctors, and Receptionists.
              </p>
            </div>
          </Link>

          {/* Card 2: Public Queue Monitor */}
          <Link href="/queue" className="group">
            <div className="glass p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-left hover:border-teal-500/50 hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl w-fit group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Live Public Monitor
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                Real-time active queue board tracking patient check-ins and calling tokens by physician. Built with live refresh.
              </p>
            </div>
          </Link>
        </div>

        {/* Assessment Notice Box */}
        <div className="mt-16 glass max-w-xl mx-auto p-6 rounded-2xl border border-rose-500/20 shadow-md flex gap-4 text-left">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg h-fit">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Assessment Environment Notice</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              This repository contains critical architectural, database performance, frontend memory, and security bugs. 
              Your evaluation criteria will measure your ability to identify, trace, profile, and fix these issues systematically.
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center text-slate-400 dark:text-slate-500 text-xs mt-12">
        HAQMS v1.0.0-deliberate-bugs &copy; {new Date().getFullYear()} Candidate Evaluation Framework.
      </footer>
    </div>
  );
}
