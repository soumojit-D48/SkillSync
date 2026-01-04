'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetProgressLogsQuery } from '@/store/api/progressApi';

interface TodaysFocusProps {
  dailyGoal: number;
  todayTime: number;
  todayLogged: boolean;
  isLoading?: boolean;
}

export function TodaysFocus({ dailyGoal, todayTime, todayLogged, isLoading }: TodaysFocusProps) {
  // Get today's logs to show skills practiced
  const today = new Date().toISOString().split('T')[0];
  const { data: todayLogs } = useGetProgressLogsQuery({
    start_date: today,
    end_date: today,
    page: 1,
    page_size: 10,
  });

  const progressPercentage = Math.min((todayTime / dailyGoal) * 100, 100);
  const uniqueSkills = Array.from(new Set(todayLogs?.logs.map(log => log.skill_name) || []));

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
      >
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-muted rounded mb-4" />
          <div className="h-4 w-32 bg-muted rounded mb-6" />
          <div className="h-2 bg-muted rounded" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Today's Focus</h2>
            <p className="text-sm text-muted-foreground">
              {todayLogged ? "You've learned for 1h today!" : "Let's start learning!"}
            </p>
          </div>
        </div>
        <Link href="/progress/log">
          <Button size="sm" className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
            Log
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Daily Goal Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Daily goal: {dailyGoal} minutes</span>
          <span className="font-bold text-blue-500">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
          >
            {progressPercentage >= 100 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                ✓
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Skills practiced today */}
      {uniqueSkills.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Skills practiced today:</p>
          <div className="flex flex-wrap gap-2">
            {uniqueSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 text-sm font-medium hover:border-blue-500/50 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {uniqueSkills.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">No skills practiced today yet</p>
          <p className="text-muted-foreground/70 text-xs mt-1">Start logging your progress!</p>
        </div>
      )}
    </motion.div>
  );
}