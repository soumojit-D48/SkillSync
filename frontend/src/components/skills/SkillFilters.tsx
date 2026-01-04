
'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { SkillStatus } from '@/store/api/skillsApi';

interface SkillFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | SkillStatus;
  setStatusFilter: (status: 'all' | SkillStatus) => void;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

export function SkillFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: SkillFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value as 'all' | SkillStatus)}
            className={`px-5 py-3 rounded-xl font-medium transition-all ${
              statusFilter === option.value
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card text-muted-foreground hover:bg-muted border border-border'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}