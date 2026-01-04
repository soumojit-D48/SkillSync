

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Edit2, Trash2, Loader2, Clock, Flame, Calendar, TrendingUp } from 'lucide-react';
import type { SkillWithStats } from '@/store/api/skillsApi';

interface SkillDetailHeaderProps {
  skill: SkillWithStats;
  onDelete: () => void;
  isDeleting: boolean;
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

const calculateProgressPercentage = (skill: SkillWithStats) => {
  const levels = { beginner: 0, intermediate: 33, advanced: 66, expert: 100 };
  const current = levels[skill.current_level as keyof typeof levels] || 0;
  const target = levels[skill.target_level as keyof typeof levels] || 100;
  return Math.min(100, Math.round((current / target) * 100));
};

export function SkillDetailHeader({ skill, onDelete, isDeleting }: SkillDetailHeaderProps) {
  const progress = calculateProgressPercentage(skill);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-card border border-border shadow-soft"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{skill.name}</h1>
            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
              skill.status === 'active' && 'bg-success/10 text-success'
            } ${
              skill.status === 'paused' && 'bg-warning/10 text-warning'
            } ${
              skill.status === 'completed' && 'bg-info/10 text-info'
            }`}>
              {skill.status}
            </span>
          </div>
          {skill.description && (
            <p className="text-muted-foreground">{skill.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/skills/${skill.id}/edit`}>
            <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </Link>
          <button 
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive text-destructive transition-colors flex items-center gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium capitalize">
            {skill.current_level} → {skill.target_level}
          </span>
          <span className="text-sm font-bold text-primary">
            {progress}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-primary to-info"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Time</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(skill.total_hours || 0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold">{skill.streak_days || 0} days</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{skill.progress_count || 0}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-info" />
            <span className="text-sm text-muted-foreground">Last Practiced</span>
          </div>
          <p className="text-lg font-bold">
            {skill.last_practiced ? formatDate(skill.last_practiced) : 'Never'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}