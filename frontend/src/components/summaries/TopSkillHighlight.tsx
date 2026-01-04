
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { formatTimeMinutes } from '@/store/api/resourcesAndSummaries';

interface TopSkillHighlightProps {
  topSkill?: string;
  topSkillTime?: number;
}

export function TopSkillHighlight({ topSkill, topSkillTime }: TopSkillHighlightProps) {
  if (!topSkill) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-400/50"
    >
      <div className="flex items-center gap-3 mb-3">
        <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
          🏆 Top Skill This Week
        </h3>
      </div>
      <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
        {topSkill}
      </p>
      {topSkillTime && (
        <p className="text-lg text-yellow-700 dark:text-yellow-200">
          {formatTimeMinutes(topSkillTime)} practiced
        </p>
      )}
    </motion.div>
  );
}
