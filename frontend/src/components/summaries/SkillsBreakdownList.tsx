
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeMinutes } from '@/store/api/resourcesAndSummaries';

interface Skill {
  skill_name: string;
  time_spent: number;
  percentage: number;
}

interface SkillsBreakdownListProps {
  skillsBreakdown: Skill[];
  showTitle?: boolean;
}

export function SkillsBreakdownList({ skillsBreakdown, showTitle = true }: SkillsBreakdownListProps) {
  if (!skillsBreakdown || skillsBreakdown.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        {showTitle && <h3 className="text-lg font-semibold mb-4">Skills Breakdown</h3>}
        <div className="text-center py-8 text-muted-foreground">
          No skills practiced yet
        </div>
      </div>
    );
  }

  const colorClasses = [
    'bg-primary',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Skills Time Breakdown</h3>
        </div>
      )}
      <div className="space-y-4">
        {skillsBreakdown.map((skill, index) => (
          <motion.div
            key={skill.skill_name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={cn('h-3 w-3 rounded-full', colorClasses[index % colorClasses.length])} />
                <span className="font-medium">{skill.skill_name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{formatTimeMinutes(skill.time_spent)}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({skill.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.percentage}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                className={cn('h-full', colorClasses[index % colorClasses.length])}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}