
// components/skills/SkillProgressLogs.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Edit2, Plus, Loader2 } from 'lucide-react';
import type { ProgressLog } from '@/store/api/progressApi';

interface SkillProgressLogsProps {
  logs: ProgressLog[];
  skillId: number;
  isLoading: boolean;
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function SkillProgressLogs({ logs, skillId, isLoading }: SkillProgressLogsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No progress logs yet</p>
        <Link href={`/progress/log?skill=${skillId}`}>
          <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Log Your First Session
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{formatDate(log.date)}</p>
                <p className="text-sm text-primary font-medium">
                  {formatTime(log.time_spent)}
                </p>
              </div>
            </div>
            <Link href={`/progress/${log.id}/edit`}>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
            </Link>
          </div>
          {log.description && (
            <p className="text-muted-foreground mb-2">{log.description}</p>
          )}
          {log.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              📝 {log.notes}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}