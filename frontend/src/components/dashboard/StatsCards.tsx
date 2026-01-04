
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface StatsCardsProps {
  stats: StatCard[];
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-card border border-border animate-pulse"
          >
            <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
            <div className="h-8 w-20 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded mb-1" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                stat.bg
              )}
            >
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
            {stat.trend && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  stat.trend === 'up' && 'bg-success/10 text-success',
                  stat.trend === 'down' && 'bg-destructive/10 text-destructive',
                  stat.trend === 'neutral' && 'bg-muted text-muted-foreground'
                )}
              >
                {stat.trend === 'up' && '↑'}
                {stat.trend === 'down' && '↓'}
                {stat.trend === 'neutral' && '→'}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold mb-1 transition-colors group-hover:text-primary">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          {stat.change && (
            <p className="text-xs text-primary font-medium">{stat.change}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}



