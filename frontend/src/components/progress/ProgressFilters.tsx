
'use client';

import { Skill } from '@/store/api/skillsApi';

interface ProgressFiltersProps {
  skillFilter: number | 'all';
  dateFilter: 'all' | 'today' | 'week' | 'month';
  skills: Skill[];
  onSkillChange: (skillId: number | 'all') => void;
  onDateChange: (period: 'all' | 'today' | 'week' | 'month') => void;
}

export function ProgressFilters({
  skillFilter,
  dateFilter,
  skills,
  onSkillChange,
  onDateChange,
}: ProgressFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Filter by Skill</label>
        <select
          value={skillFilter}
          onChange={(e) => onSkillChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Skills</option>
          {skills.map(skill => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Filter by Date</label>
        <select
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value as any)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
}