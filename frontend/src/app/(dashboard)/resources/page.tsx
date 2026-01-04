
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceCard } from '@/components/resources/ResourseCard';
import { ResourceFilters } from '@/components/resources/ResouseFilter';
import { ResourceStats } from '@/components/resources/ResourseStats';
import { 
  useGetResourcesQuery, 
  useGetResourceStatsQuery,
  useMarkResourceCompletedMutation,
  useDeleteResourceMutation,
  type ResourceType 
} from '@/store/api/resourcesAndSummaries';
import { useGetSkillsQuery } from '@/store/api/skillsApi';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Fetch resources from API
  const { data: resourcesData, isLoading: resourcesLoading } = useGetResourcesQuery({
    skill_id: skillFilter !== 'all' ? skillFilter : undefined,
    resource_type: typeFilter !== 'all' ? typeFilter : undefined,
    is_completed: statusFilter === 'completed' ? true : statusFilter === 'incomplete' ? false : undefined,
    page: 1,
    page_size: 100,
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useGetResourceStatsQuery();

  // Fetch skills for filter dropdown
  const { data: skillsData } = useGetSkillsQuery({ page: 1, page_size: 100 });

  console.log(stats, "stats");
  console.log(stats, "resourcesData");
  

  // Mutations
  const [markCompleted] = useMarkResourceCompletedMutation();
  const [deleteResource] = useDeleteResourceMutation();

  // Filter resources locally for search
  const filteredResources = useMemo(() => {
    if (!resourcesData?.resources) return [];
    
    return resourcesData.resources.filter(resource => {
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [resourcesData?.resources, searchQuery]);

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      await markCompleted({ id, completed: !currentStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id).unwrap();
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };

  const isLoading = resourcesLoading || statsLoading;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Your curated library of learning materials
          </p>
        </div>
        <Link href="/resources/new">
          <Button variant="gradient" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Resource
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <ResourceStats stats={stats} isLoading={statsLoading} />

      {/* Filters */}
      <ResourceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        skillFilter={skillFilter}
        setSkillFilter={setSkillFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        skills={skillsData?.skills || []}
      />

      {/* Resources List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground mb-4">No resources found</p>
          <Link href="/resources/new">
            <Button variant="gradient">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Resource
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ResourceCard
                resource={resource}
                index={index}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}