
'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResourceType } from '@/store/api/resourcesAndSummaries';
import { Skill } from '@/store/api/skillsApi';

interface ResourceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  skillFilter: number | 'all';
  setSkillFilter: (filter: number | 'all') => void;
  typeFilter: ResourceType | 'all';
  setTypeFilter: (filter: ResourceType | 'all') => void;
  statusFilter: 'all' | 'completed' | 'incomplete';
  setStatusFilter: (filter: 'all' | 'completed' | 'incomplete') => void;
  skills: Skill[];
}

const resourceTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'course', label: 'Courses' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'book', label: 'Books' },
  { value: 'other', label: 'Other' },
];

export function ResourceFilters({
  searchQuery,
  setSearchQuery,
  skillFilter,
  setSkillFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  skills,
}: ResourceFiltersProps) {
  return (
    <>
      {/* Search and Dropdowns */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Skill Filter */}
        <div>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
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

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ResourceType | 'all')}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            statusFilter === 'all'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('incomplete')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            statusFilter === 'incomplete'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          In Progress
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            statusFilter === 'completed'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Completed
        </button>
      </div>
    </>
  );
}