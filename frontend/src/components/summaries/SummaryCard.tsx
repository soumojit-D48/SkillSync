
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, Flame, ChevronRight } from 'lucide-react';
import { formatTimeMinutes } from '@/store/api/resourcesAndSummaries';

interface SummaryCardProps {
  summary: {
    id: number;
    week_start: string;
    week_end: string;
    summary_text?: string;
    total_hours: number;
    skills_worked_on: number;
    daily_breakdown?: Array<{ date: string; time_spent: number }>;
  };
  onClick: () => void;
  delay?: number;
}

export function SummaryCard({ summary, onClick, delay = 0 }: SummaryCardProps) {
  const daysActive = summary.daily_breakdown?.filter(d => d.time_spent > 0).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              Week of {new Date(summary.week_start).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(summary.week_start).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} - {new Date(summary.week_end).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      {summary.summary_text && (
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {summary.summary_text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">
            {formatTimeMinutes(summary.total_hours)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-success" />
          <span className="font-semibold">{summary.skills_worked_on}</span>
          <span className="text-muted-foreground">skills</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-warning" />
          <span className="font-semibold">{daysActive}/7</span>
          <span className="text-muted-foreground">days</span>
        </div>
      </div>
    </motion.div>
  );
}
