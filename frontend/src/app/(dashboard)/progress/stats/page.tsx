
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Flame,
  Target,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  useGetOverallStatsQuery,
  useGetWeeklyStatsQuery,
  useGetProgressLogsQuery 
} from '@/store/api/progressApi';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressStatsPage() {
  // Fetch overall stats
  const { data: statsData, isLoading: isLoadingStats } = useGetOverallStatsQuery();
  const { data: weeklyData, isLoading: isLoadingWeekly } = useGetWeeklyStatsQuery();
  const { data: progressLogs } = useGetProgressLogsQuery();

  console.log();
  

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calculate skill distribution from progress logs
  const getSkillDistribution = () => {
    if (!progressLogs?.logs) return { labels: [], data: [], colors: [] };

    const skillTimes: Record<string, number> = {};
    
    progressLogs.logs.forEach(log => {
      const skillName = log.skill_name || 'Unknown';
      skillTimes[skillName] = (skillTimes[skillName] || 0) + log.time_spent;
    });

    const sortedSkills = Object.entries(skillTimes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6); // Top 6 skills

    const colors = [
      '#6366f1', // primary
      '#f59e0b', // warning/orange
      '#10b981', // success/green
      '#3b82f6', // info/blue
      '#a855f7', // purple
      '#ec4899', // pink
    ];

    return {
      labels: sortedSkills.map(([name]) => name),
      data: sortedSkills.map(([, time]) => (time / 60).toFixed(1)),
      colors: colors.slice(0, sortedSkills.length),
    };
  };

  const skillDistribution = getSkillDistribution();

  // Weekly bar chart data
  const weeklyChartData = {
    labels: (weeklyData?.daily_breakdown || []).map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Minutes',
        data: (weeklyData?.daily_breakdown || []).map(d => d.total_time),
        backgroundColor: '#22d3ee',
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22d3ee',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${formatMinutes(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value: any) => formatMinutes(value),
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  };

  // Doughnut chart data
  const doughnutData = {
    labels: skillDistribution.labels,
    datasets: [
      {
        data: skillDistribution.data,
        backgroundColor: skillDistribution.colors,
        borderWidth: 0,
        spacing: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366f1',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}h`;
          },
        },
      },
    },
    cutout: '70%',
  };

  if (isLoadingStats || isLoadingWeekly) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!statsData || !weeklyData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 px-4">
        <Link href="/progress">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Progress
          </Button>
        </Link>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <p className="text-muted-foreground">No statistics available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* Back Button */}
      <Link href="/progress">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Progress
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-muted-foreground">
          Your learning analytics and insights
        </p>
      </div>

      {/* Stats Cards - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Flame className="h-6 w-6 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
          <p className="text-3xl font-bold">{statsData.current_streak}d</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-info" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
          <p className="text-3xl font-bold">{statsData.longest_streak}d</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Time</p>
          <p className="text-3xl font-bold">{formatMinutes(statsData.total_time)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
          <p className="text-3xl font-bold">{statsData.total_logs}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Weekly Activity</h2>
          </div>
          <div className="h-[300px]">
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        </motion.div>

        {/* Time by Skill Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Time by Skill</h2>
          </div>
          {skillDistribution.labels.length > 0 ? (
            <div className="h-[300px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <p>No skill data available yet</p>
                <Link href="/progress/log" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    Log Your First Session
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}