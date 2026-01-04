
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Flame,
  Trash2,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetSummaryQuery,
  useDeleteSummaryMutation,
  formatTimeMinutes,
} from '@/store/api/resourcesAndSummaries';
import {
  StatCard,
  TopSkillHighlight,
  SkillsBreakdownList,
  DailyActivityChart,
  SkillsBreakdownChart,
  LoadingState,
  ErrorState,
} from '@/components/summaries';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SummaryDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const summaryId = Number(id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data,
    isLoading,
    error,
  } = useGetSummaryQuery({
    id: summaryId,
    with_details: true,
  });

  const [deleteSummary, { isLoading: isDeleting }] = useDeleteSummaryMutation();

  const handleDelete = async () => {
    try {
      await deleteSummary(summaryId).unwrap();
      router.push('/summaries');
    } catch (error) {
      console.error('Failed to delete summary:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/summaries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summaries
          </Button>
        </Link>
        <LoadingState message="Loading summary..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/summaries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summaries
          </Button>
        </Link>
        <ErrorState
          title="Failed to load summary"
          error={error}
        />
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/summaries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summaries
          </Button>
        </Link>
        <div className="p-12 rounded-xl bg-card border border-border text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Summary not found</h3>
          <p className="text-muted-foreground mb-6">
            This summary may have been deleted or doesn't exist.
          </p>
          <Link href="/summaries">
            <Button>Back to Summaries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysActive = data.daily_breakdown.filter(d => d.time_spent > 0).length;
  const topSkillData = data.skills_breakdown.find(s => s.skill_name === data.top_skill);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/summaries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summaries
          </Button>
        </Link>
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Delete Summary?</h3>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete this weekly summary. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Summary'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-info/10 border border-primary/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Week of {new Date(data.week_start).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h1>
            <p className="text-lg text-muted-foreground">
              {new Date(data.week_start).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(data.week_end).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        {data.summary_text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-lg leading-relaxed">{data.summary_text}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total Time"
          value={formatTimeMinutes(data.total_hours)}
          color="primary"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label="Daily Average"
          value={formatTimeMinutes(data.average_daily_time)}
          color="success"
          delay={0.2}
        />
        <StatCard
          icon={Flame}
          label="Days Active"
          value={`${daysActive}/7`}
          subtitle={`${Math.round((daysActive / 7) * 100)}% of week`}
          color="warning"
          delay={0.3}
        />
        <StatCard
          icon={Target}
          label="Skills Practiced"
          value={data.skills_worked_on}
          subtitle={data.top_skill ? `Top: ${data.top_skill}` : undefined}
          color="info"
          delay={0.4}
        />
      </div>

      {/* Top Skill Highlight */}
      {data.top_skill && (
        <TopSkillHighlight 
          topSkill={data.top_skill} 
          topSkillTime={topSkillData?.time_spent}
        />
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DailyActivityChart 
          dailyBreakdown={data.daily_breakdown}
          title="Daily Activity"
        />
        <SkillsBreakdownChart 
          skillsBreakdown={data.skills_breakdown}
          title="Time by Skill"
        />
      </div>

      {/* Skills List */}
      <SkillsBreakdownList 
        skillsBreakdown={data.skills_breakdown}
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          Created on {new Date(data.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <Link href="/summaries">
          <Button variant="outline">
            View All Summaries
          </Button>
        </Link>
      </div>
    </div>
  );
}