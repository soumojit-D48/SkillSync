
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressLog } from '@/store/api/progressApi';

interface ProgressLogCardProps {
  log: ProgressLog;
  index: number;
  onDelete: (id: number) => void;
}

export function ProgressLogCard({ log, index, onDelete }: ProgressLogCardProps) {
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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

  const getSkillColor = (skillName: string) => {
    const colors = [
      'bg-primary/10 text-primary',
      'bg-info/10 text-info',
      'bg-success/10 text-success',
      'bg-warning/10 text-warning',
      'bg-purple-500/10 text-purple-500',
      'bg-pink-500/10 text-pink-500',
    ];
    const hash = skillName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Skill Badge */}
        <div className={cn(
          'h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0',
          getSkillColor(log.skill_name || 'Unknown')
        )}>
          {(log.skill_name || 'U')[0].toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{log.skill_name || 'Unknown Skill'}</h3>
              {log.description && (
                <p className="text-muted-foreground">{log.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link href={`/progress/${log.id}/edit`}>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
              </Link>
              <button 
                onClick={() => onDelete(log.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {log.notes && (
            <div className="mb-3 p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                📝 {log.notes}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(log.date)}</span>
            </div>
            <div className="flex items-center gap-1 text-primary font-semibold">
              <Clock className="h-4 w-4" />
              <span>{formatMinutes(log.time_spent)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
