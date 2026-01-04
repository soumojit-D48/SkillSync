
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetSummariesQuery,
  useGetSummaryStatsQuery,
  formatTimeMinutes,
} from '@/store/api/resourcesAndSummaries';
import {
  StatCard,
  SummaryCard,
  EmptyState,
  LoadingState,
  ErrorState,
  WeeklyProgressTrend,
} from '@/components/summaries';

export default function SummariesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch summaries list
  const {
    data: summariesData,
    isLoading: summariesLoading,
    error: summariesError,
    refetch: refetchSummaries,
  } = useGetSummariesQuery({
    page: currentPage,
    page_size: pageSize,
  });

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useGetSummaryStatsQuery();

  // Calculate trend (comparing to average)
  const weekTrend = useMemo(() => {
    if (!summariesData?.summaries.length || !statsData) return undefined;
    
    const latestWeek = summariesData.summaries[0];
    const avg = statsData.average_weekly_time;
    
    if (avg === 0) return undefined;
    return Math.round(((latestWeek.total_hours - avg) / avg) * 100);
  }, [summariesData, statsData]);

  // Loading state
  if (summariesLoading && !summariesData) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <LoadingState message="Loading summaries..." />
      </div>
    );
  }

  // Error state
  if (summariesError) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <ErrorState
          title="Failed to load summaries"
          error={summariesError}
          onRetry={refetchSummaries}
        />
      </div>
    );
  }

  const summaries = summariesData?.summaries || [];
  const hasNextPage = summariesData ? currentPage < summariesData.total_pages : false;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="max-w-7xl mx-auto space-y-8 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Weekly Summaries
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your learning journey week by week
          </p>
        </div>
        <Link href="/summaries/current">
          <Button variant="gradient" size="lg" className="shadow-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            View Current Week
          </Button>
        </Link>
      </div>

      {/* Stats Overview - Added mb-12 for larger gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-5">
        <StatCard
          icon={Calendar}
          label="Total Weeks"
          value={statsData?.total_weeks_tracked || 0}
          color="primary"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Avg Weekly Time"
          value={statsData ? formatTimeMinutes(statsData.average_weekly_time) : '0m'}
          color="info"
          trend={weekTrend}
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label="Best Week"
          value={statsData?.most_productive_week_time 
            ? formatTimeMinutes(statsData.most_productive_week_time)
            : '0m'}
          subtitle={statsData?.most_productive_week 
            ? new Date(statsData.most_productive_week).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            : undefined}
          color="success"
          delay={0.2}
        />
        <StatCard
          icon={Award}
          label="Total Summaries"
          value={statsData?.total_summaries || 0}
          color="warning"
          delay={0.3}
        />
      </div>

      {/* Weekly Progress Trend - Added mb-12 for gap after chart */}
      {summaries.length > 2 && (
        <div className="mb-12">
          <WeeklyProgressTrend summaries={summaries} />
        </div>
      )}

      {/* Summaries List - Added mt-12 for gap before list */}
      {summaries.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No summaries yet"
          description="Start tracking your learning activities to generate weekly summaries automatically. Check back at the end of each week!"
          action={
            <Link href="/summaries/current">
              <Button variant="gradient" size="lg">
                <Sparkles className="h-5 w-5 mr-2" />
                View Current Week
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">All Summaries</h2>
              <p className="text-sm text-muted-foreground">
                {summariesData?.total || 0} total summaries
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((summary, index) => (
                <SummaryCard
                  key={summary.id}
                  summary={summary}
                  onClick={() => router.push(`/summaries/${summary.id}`)}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>

          {/* Pagination - Added mt-12 for gap above pagination */}
          {summariesData && summariesData.total_pages > 1 && (
            <div className="flex items-center justify-between pt-8 mt-12 border-t">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{summariesData.total_pages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!hasPrevPage || summariesLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!hasNextPage || summariesLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}