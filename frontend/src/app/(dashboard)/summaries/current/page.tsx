
'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Flame,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetCurrentWeekSummaryQuery,
  useGenerateSummaryMutation,
  formatTimeMinutes,
  getCurrentWeekStart,
} from '@/store/api/resourcesAndSummaries';
import {
  StatCard,
  TopSkillHighlight,
  SkillsBreakdownList,
  DailyActivityChart,
  SkillsBreakdownChart,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/components/summaries';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CurrentWeekPage() {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetCurrentWeekSummaryQuery();

  const [generateSummary] = useGenerateSummaryMutation();

  const handleRegenerate = async () => {
    if (!data) return;
    
    try {
      setIsRegenerating(true);
      await generateSummary({
        week_start: data.week_start,
        force_regenerate: true,
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error('Failed to regenerate summary:', error);
    } finally {
      setIsRegenerating(false);
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
        <LoadingState message="Loading this week's summary..." />
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
          onRetry={refetch}
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
        <EmptyState
          icon={Calendar}
          title="No data for this week yet"
          description="Start logging your learning activities to see your weekly summary here. Data will update automatically as you track your progress."
          action={
            <Link href="/dashboard">
              <Button variant="gradient">
                Go to Dashboard
              </Button>
            </Link>
          }
        />
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
          onClick={handleRegenerate}
          disabled={isRegenerating}
          size="sm"
          variant="outline"
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Summary
            </>
          )}
        </Button>
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-info/10 border border-primary/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">This Week's Progress</h1>
            <p className="text-lg text-muted-foreground">
              {new Date(data.week_start).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(data.week_end).toLocaleDateString('en-US', {
                month: 'long',
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
          title="Daily Activity This Week"
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

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          Summary generated on {new Date(data.created_at).toLocaleDateString('en-US', {
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