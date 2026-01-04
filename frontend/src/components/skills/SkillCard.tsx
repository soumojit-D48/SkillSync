
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import type { Skill } from '@/store/api/skillsApi';

interface SkillCardProps {
  skill: Skill;
  index: number;
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

const calculateProgress = (skill: Skill) => {
  const levels = { beginner: 0, intermediate: 33, advanced: 66, expert: 100 };
  const current = levels[skill.current_level] || 0;
  const target = levels[skill.target_level] || 100;
  return Math.min(100, Math.round((current / target) * 100));
};

const getLevelEmoji = (level: string) => {
  const emojis: Record<string, string> = {
    beginner: '🌱',
    intermediate: '🌿',
    advanced: '🌳',
    expert: '🏆',
  };
  return emojis[level] || '🎯';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success border-success/20';
    case 'paused':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'completed':
      return 'bg-info/10 text-info border-info/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function SkillCard({ skill, index }: SkillCardProps) {
  const progress = calculateProgress(skill);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-info/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <Link href={`/skills/${skill.id}`}>
        <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col shadow-soft hover:shadow-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {skill.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {skill.description || 'No description'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize whitespace-nowrap ${getStatusColor(skill.status)}`}>
              {skill.status}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>{getLevelEmoji(skill.current_level)}</span>
                <span className="capitalize">{skill.current_level}</span>
              </span>
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>{getLevelEmoji(skill.target_level)}</span>
                <span className="capitalize">{skill.target_level}</span>
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-primary to-info"
              />
            </div>
            <div className="text-right mt-1.5">
              <span className="text-xs font-semibold text-primary">{progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-auto">
            <div className="text-center p-2.5 rounded-lg bg-muted/30">
              <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-0.5">Time</p>
              <p className="text-sm font-semibold">{formatTime(skill.total_hours || 0)}</p>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-muted/30">
              <BarChart3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-0.5">Progress</p>
              <p className="text-sm font-semibold">{progress}%</p>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-muted/30">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-0.5">Level</p>
              <p className="text-sm font-semibold">{getLevelEmoji(skill.current_level)}</p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}