
'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Clock, Trophy, Activity, BarChart3 } from 'lucide-react';

interface SkillStatsGridProps {
  stats: {
    total_skills: number;
    active_skills: number;
    paused_skills: number;
    completed_skills: number;
    total_learning_time: number;
  } | undefined;
  isLoading?: boolean;
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}

function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <div className="text-white">{icon}</div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export function SkillStatsGrid({ stats, isLoading }: SkillStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-muted mb-3" />
            <div className="h-4 w-16 bg-muted rounded mb-1" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const avgTimePerSkill = stats?.total_skills 
    ? stats.total_learning_time / stats.total_skills 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      <StatCard
        icon={<Target className="h-5 w-5" />}
        label="Total Skills"
        value={stats?.total_skills || 0}
        // gradient="from-primary to-primary"
        gradient="from-success to-success"
      />
      <StatCard
        icon={<Zap className="h-5 w-5" />}
        label="Active"
        value={stats?.active_skills || 0}
        gradient="from-success to-success"
      />
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        label="Total Time"
        value={formatTime(stats?.total_learning_time || 0)}
        gradient="from-info to-info"
      />
      <StatCard
        icon={<Trophy className="h-5 w-5" />}
        label="Completed"
        value={stats?.completed_skills || 0}
        gradient="from-warning to-warning"
      />
      <StatCard
        icon={<Activity className="h-5 w-5" />}
        label="Paused"
        value={stats?.paused_skills || 0}
        gradient="from-secondary to-secondary"
      />
      <StatCard
        icon={<BarChart3 className="h-5 w-5" />}
        label="Avg Time"
        value={formatTime(avgTimePerSkill)}
        gradient="from-accent to-accent"
      />
    </motion.div>
  );
}