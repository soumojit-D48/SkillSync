
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Plus, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProgressLog } from '@/store/api/progressApi';

interface RecentActivityProps {
  logs: ProgressLog[];
  isLoading?: boolean;
}

const colorMap = [
  'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'bg-pink-500/10 text-pink-500 border-pink-500/20',
];

export function RecentActivity({ logs, isLoading }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (minutes: number) => {
    const hours = minutes / 60;
    if (hours >= 1) {
      return `${hours.toFixed(1)}h`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
      >
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gray-800 rounded mb-2" />
          <div className="h-4 w-56 bg-gray-800 rounded mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
                <div className="h-12 w-12 rounded-lg bg-gray-800" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-800 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-800 rounded" />
                </div>
                <div className="h-4 w-12 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
      >
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="font-semibold mb-2">No progress logs yet</h3>
          <p className="text-sm text-gray-400 mb-6">
            Start tracking your learning journey today!
          </p>
          <Link href="/progress/log">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Session
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-400">Your latest learning sessions</p>
        </div>
        <Link href="/progress">
          <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-500">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {logs.slice(0, 5).map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            className="group flex items-start gap-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all cursor-pointer border border-gray-800 hover:border-blue-500/30"
          >
            <div
              className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 transition-transform group-hover:scale-110 border',
                colorMap[index % colorMap.length]
              )}
            >
              {(log.skill_name || 'Unknown')[0].toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors">
                    {log.skill_name || 'Unknown Skill'}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {log.description || 'No description'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-blue-500">{formatTime(log.time_spent)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(log.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(log.time_spent)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}