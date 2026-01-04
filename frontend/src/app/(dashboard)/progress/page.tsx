
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Clock,
  BarChart3,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { 
  useGetProgressLogsQuery,
  useDeleteProgressLogMutation 
} from '@/store/api/progressApi';
import { useGetSkillsQuery } from '@/store/api/skillsApi';
import { StatsCards } from '@/components/progress/StatsCards';
import { ProgressLogCard } from '@/components/progress/ProgressLogCards';
import { ProgressFilters } from '@/components/progress/ProgressFilters';

export default function ProgressPage() {
  const [skillFilter, setSkillFilter] = useState<number | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const { data: progressData, isLoading: isLoadingProgress } = useGetProgressLogsQuery({
    skill_id: skillFilter !== 'all' ? skillFilter : undefined,
  });

  const { data: skillsData } = useGetSkillsQuery();
  const [deleteProgressLog] = useDeleteProgressLogMutation();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this progress log?')) {
      try {
        await deleteProgressLog(id).unwrap();
      } catch (error) {
        console.error('Failed to delete progress log:', error);
      }
    }
  };

  const filteredLogs = (progressData?.logs || []).filter(log => {
    if (dateFilter === 'all') return true;
    
    const logDate = new Date(log.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      const logDateOnly = new Date(logDate);
      logDateOnly.setHours(0, 0, 0, 0);
      return logDateOnly.getTime() === today.getTime();
    }

    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }

    if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return logDate >= monthAgo;
    }

    return true;
  });

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const totalTime = filteredLogs.reduce((acc, log) => acc + log.time_spent, 0);
  const averageTime = filteredLogs.length > 0 ? Math.round(totalTime / filteredLogs.length) : 0;

  const stats = [
    {
      label: 'Total Logs',
      value: filteredLogs.length,
      icon: Calendar,
      gradient: 'from-primary to-primary',
    },
    {
      label: 'Total Time',
      value: formatMinutes(totalTime),
      icon: Clock,
      gradient: 'from-info to-info',
    },
    {
      label: 'Average/Session',
      value: averageTime > 0 ? formatMinutes(averageTime) : '0h',
      icon: TrendingUp,
      gradient: 'from-success to-success',
    },
  ];

  if (isLoadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Progress History
          </h1>
          <p className="text-muted-foreground text-lg">
            Track all your learning sessions
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/progress/stats">
            <button className="px-5 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              View Stats
            </button>
          </Link>
          <Link href="/progress/log">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 text-white">
              <Plus className="h-5 w-5" />
              Log Progress
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsCards stats={stats} isLoading={isLoadingProgress} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProgressFilters
          skillFilter={skillFilter}
          dateFilter={dateFilter}
          skills={skillsData?.skills || []}
          onSkillChange={setSkillFilter}
          onDateChange={setDateFilter}
        />
      </motion.div>

      {/* Progress Logs */}
      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No progress logs yet</h3>
          <p className="text-muted-foreground mb-6">
            Start tracking your learning journey today!
          </p>
          <Link href="/progress/log">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 mx-auto text-white">
              <Plus className="h-5 w-5" />
              Log Your First Session
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <ProgressLogCard
              key={log.id}
              log={log}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
