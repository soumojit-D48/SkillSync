
'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, Flame, Clock } from 'lucide-react';
import { useGetDashboardQuery } from '@/store/api/userApi';
import {
  useGetOverallStatsQuery,
  useGetWeeklyStatsQuery,
  useGetProgressLogsQuery,
} from '@/store/api/progressApi';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { StreakCard } from '@/components/dashboard/StreakCard';

export default function DashboardPage() {
  // Fetch data from API
  const { data: dashboard, isLoading: dashboardLoading } = useGetDashboardQuery();
  const { data: overallStats, isLoading: statsLoading } = useGetOverallStatsQuery();
  const { data: weeklyStats, isLoading: weeklyLoading } = useGetWeeklyStatsQuery();
  const { data: progressLogs, isLoading: logsLoading } = useGetProgressLogsQuery({
    page: 1,
    page_size: 5,
  });

  console.log(dashboard, "dashboard");
  console.log(overallStats, "overallStats");
  console.log(weeklyStats, "weeklyStats");
  console.log(progressLogs, "progressLogs");
  

  // Prepare stats cards data
  const stats = [
    {
      label: 'Total Skills',
      value: dashboard?.total_skills || 0,
      change: `${dashboard?.active_skills || 0} active`,
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: 'neutral' as const,
    },
    {
      label: 'Active Skills',
      value: dashboard?.active_skills || 0,
      change: 'Currently learning',
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      trend: 'up' as const,
    },
    {
      label: 'Current Streak',
      value: `${overallStats?.current_streak || 0} days`,
      change: overallStats?.current_streak ? 'Keep it up!' : 'Start today!',
      icon: Flame,
      color: 'text-warning',
      bg: 'bg-warning/10',
      trend: overallStats?.current_streak ? ('up' as const) : ('neutral' as const),
    },
    {
      label: 'Total Time',
      value: `${Math.floor((overallStats?.total_time || 0) / 60)}h`,
      change: `+${Math.floor((overallStats?.this_week_time || 0) / 60)}h this week`,
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/10',
      trend: 'up' as const,
    },
  ];

  console.log(overallStats?.this_week_time);
  
  // Check if logged today
  const today = new Date().toISOString().split('T')[0];
  const todayLogged = progressLogs?.logs.some((log) => log.date === today) || false;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            {dashboard?.profile?.username || 'User'}
          </span>
          ! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's your learning progress overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StatsCards stats={stats} isLoading={dashboardLoading || statsLoading} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart - Takes 2 columns */}
        <WeeklyChart
          data={weeklyStats?.daily_breakdown || []}
          totalTime={weeklyStats?.total_time || 0}
          isLoading={weeklyLoading}
        />

        {/* Quick Actions - Takes 1 column */}
        <QuickActions />
      </div>

      {/* Secondary Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity logs={progressLogs?.logs || []} isLoading={logsLoading} />
        </div>

        {/* Streak Card - Takes 1 column */}
        <StreakCard
          currentStreak={overallStats?.current_streak || 0}
          longestStreak={overallStats?.longest_streak || 0}
          todayLogged={todayLogged}
          isLoading={statsLoading}
        />
      </div>
    </div>
  );
}






















// // app/dashboard/page.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { Target, CheckCircle2, Flame, Clock } from 'lucide-react';
// import { useGetDashboardQuery } from '@/store/api/userApi';
// import {
//   useGetOverallStatsQuery,
//   useGetWeeklyStatsQuery,
//   useGetProgressLogsQuery,
// } from '@/store/api/progressApi';
// import { StatsCards } from '@/components/dashboard/StatsCards';
// import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
// import { QuickActions } from '@/components/dashboard/QuickActions';
// import { RecentActivity } from '@/components/dashboard/RecentActivity';
// import { StreakCard } from '@/components/dashboard/StreakCard';
// import { TodaysFocus } from '@/components/dashboard/TodaysFocus';

// export default function DashboardPage() {
//   // Fetch data from API
//   const { data: dashboard, isLoading: dashboardLoading } = useGetDashboardQuery();
//   const { data: overallStats, isLoading: statsLoading } = useGetOverallStatsQuery();
//   const { data: weeklyStats, isLoading: weeklyLoading } = useGetWeeklyStatsQuery();
//   const { data: progressLogs, isLoading: logsLoading } = useGetProgressLogsQuery({
//     page: 1,
//     page_size: 5,
//   });

//   // Prepare stats cards data
//   const stats = [
//     {
//       label: 'Total Skills',
//       value: dashboard?.total_skills || 0,
//       change: `${dashboard?.active_skills || 0} active`,
//       icon: Target,
//       color: 'text-primary',
//       bg: 'bg-primary/10',
//       trend: 'neutral' as const,
//     },
//     {
//       label: 'Active Skills',
//       value: dashboard?.active_skills || 0,
//       change: 'Currently learning',
//       icon: CheckCircle2,
//       color: 'text-success',
//       bg: 'bg-success/10',
//       trend: 'up' as const,
//     },
//     {
//       label: 'Current Streak',
//       value: `${overallStats?.current_streak || 0} days`,
//       change: overallStats?.current_streak ? 'Keep it up!' : 'Start today!',
//       icon: Flame,
//       color: 'text-warning',
//       bg: 'bg-warning/10',
//       trend: overallStats?.current_streak ? ('up' as const) : ('neutral' as const),
//     },
//     {
//       label: 'Total Time',
//       value: `${Math.floor((overallStats?.total_time || 0) / 60)}h`,
//       change: `+${Math.floor((overallStats?.this_week_time || 0) / 60)}h this week`,
//       icon: Clock,
//       color: 'text-info',
//       bg: 'bg-info/10',
//       trend: 'up' as const,
//     },
//   ];

//   // Check if logged today
//   const today = new Date().toISOString().split('T')[0];
//   const todayLogged = progressLogs?.logs.some((log) => log.date === today) || false;

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 p-6">
//       {/* Welcome Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <h1 className="text-4xl font-bold mb-2">
//           Welcome back,{' '}
//           <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
//             {dashboard?.profile?.username || 'User'}
//           </span>
//           ! 👋
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Here's your learning progress overview
//         </p>
//       </motion.div>

//       {/* Stats Grid */}
//       <StatsCards stats={stats} isLoading={dashboardLoading || statsLoading} />

//       {/* Today's Focus Section */}
//       <TodaysFocus 
//         dailyGoal={60} 
//         todayTime={overallStats?.today_time || 0}
//         todayLogged={todayLogged}
//         isLoading={statsLoading}
//       />

//       {/* Main Content Grid */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Weekly Chart - Takes 2 columns */}
//         <WeeklyChart
//           data={weeklyStats?.daily_breakdown || []}
//           totalTime={weeklyStats?.total_time || 0}
//           isLoading={weeklyLoading}
//         />

//         {/* Quick Actions - Takes 1 column */}
//         <QuickActions />
//       </div>

//       {/* Secondary Content Grid */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Recent Activity - Takes 2 columns */}
//         <div className="lg:col-span-2">
//           <RecentActivity logs={progressLogs?.logs || []} isLoading={logsLoading} />
//         </div>

//         {/* Streak Card - Takes 1 column */}
//         <StreakCard
//           currentStreak={overallStats?.current_streak || 0}
//           longestStreak={overallStats?.longest_streak || 0}
//           todayLogged={todayLogged}
//           isLoading={statsLoading}
//         />
//       </div>
//     </div>
//   );
// }