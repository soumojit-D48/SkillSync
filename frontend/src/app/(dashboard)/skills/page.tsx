
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Plus, Loader2 } from 'lucide-react';
import { useGetSkillsQuery, useGetSkillStatsQuery } from '@/store/api/skillsApi';
import type { SkillStatus, Skill } from '@/store/api/skillsApi';
import { SkillStatsGrid } from '@/components/skills/SkillStatsGrid';
import { SkillFilters } from '@/components/skills/SkillFilters';
import { SkillCard } from '@/components/skills/SkillCard';

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SkillStatus>('all');

  const { data: skillsData, isLoading: skillsLoading } = useGetSkillsQuery({
    page: 1,
    page_size: 50,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const { data: stats, isLoading: statsLoading } = useGetSkillStatsQuery();

  const filteredSkills = useMemo(() => {
    if (!skillsData?.skills) return [];
    return skillsData.skills.filter((skill) => {
      const matchesSearch =
        searchQuery === '' ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || skill.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [skillsData?.skills, searchQuery, statusFilter]);

  if (skillsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Your Skills
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and master your learning journey
          </p>
        </div>
        <Link href="/skills/new">
          <button className="px-6 py-3 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 group text-white">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            Add New Skill
          </button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <SkillStatsGrid stats={stats} isLoading={statsLoading} />

      {/* Filters */}
      <SkillFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <Target className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-xl text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' ? 'No skills found' : 'No skills yet'}
          </p>
          <Link href="/skills/new">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all text-white">
              <Plus className="h-5 w-5 inline mr-2" />
              Add Your First Skill
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}