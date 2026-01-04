
'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { 
  useGetSkillQuery, 
  useDeleteSkillMutation 
} from '@/store/api/skillsApi';
import { useGetProgressLogsQuery } from '@/store/api/progressApi';
import { 
  useGetResourcesQuery,
  useMarkResourceCompletedMutation 
} from '@/store/api/resourcesAndSummaries';
import { SkillDetailHeader } from '@/components/skills/SkillDetailHeader';
import { SkillProgressLogs } from '@/components/skills/SkillProgressLogs';
import { SkillResourcesList } from '@/components/skills/SkillResourcesList';

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const skillId = parseInt(resolvedParams.id);
  const [activeTab, setActiveTab] = useState<'progress' | 'resources'>('progress');

  const { data: skillData, isLoading: isLoadingSkill, error: skillError } = useGetSkillQuery(
    { id: skillId, with_stats: true },
    { skip: !skillId }
  );

  const { data: progressData, isLoading: isLoadingProgress } = useGetProgressLogsQuery(
    { skill_id: skillId },
    { skip: !skillId }
  );

  const { data: resourcesData, isLoading: isLoadingResources } = useGetResourcesQuery(
    { skill_id: skillId },
    { skip: !skillId }
  );

  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();
  const [markResourceCompleted] = useMarkResourceCompletedMutation();

  const handleDeleteSkill = async () => {
    if (!skillId) return;
    if (confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      try {
        await deleteSkill(skillId).unwrap();
        router.push('/skills');
      } catch (error) {
        console.error('Failed to delete skill:', error);
      }
    }
  };

  const handleToggleResourceCompleted = async (resourceId: number, currentStatus: boolean) => {
    try {
      await markResourceCompleted({ 
        id: resourceId, 
        completed: !currentStatus 
      }).unwrap();
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  if (isLoadingSkill || !skillId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (skillError || !skillData) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/skills">
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </button>
        </Link>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <p className="text-muted-foreground">Skill not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/skills">
        <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </button>
      </Link>

      {/* Header */}
      <SkillDetailHeader 
        skill={skillData} 
        onDelete={handleDeleteSkill}
        isDeleting={isDeleting}
      />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <Link href={`/progress/log?skill=${skillId}`} className="flex-1">
          <button className="w-full px-6 py-4 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 text-white">
            <Plus className="h-5 w-5" />
            Log Progress
          </button>
        </Link>
        <Link href={`/resources/new?skill=${skillId}`} className="flex-1">
          <button className="w-full px-6 py-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted font-semibold transition-all flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            Add Resource
          </button>
        </Link>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-border"
      >
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Progress Logs ({progressData?.logs.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'resources'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Resources ({resourcesData?.resources.length || 0})
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'progress' && (
        <SkillProgressLogs 
          logs={progressData?.logs || []}
          skillId={skillId}
          isLoading={isLoadingProgress}
        />
      )}

      {activeTab === 'resources' && (
        <SkillResourcesList 
          resources={resourcesData?.resources || []}
          skillId={skillId}
          isLoading={isLoadingResources}
          onToggleCompleted={handleToggleResourceCompleted}
        />
      )}
    </div>
  );
}