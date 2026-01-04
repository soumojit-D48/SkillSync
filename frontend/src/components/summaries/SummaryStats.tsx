
// 'use client';

// import { motion } from 'framer-motion';
// import { Calendar, Clock, Trophy, BarChart3 } from 'lucide-react';
// import { SummaryStats as StatsType, formatTimeMinutes } from '@/store/api/resourcesAndSummaries';

// interface SummaryStatsProps {
//   stats?: StatsType;
// }

// const StatCard = ({ icon: Icon, label, value, subtitle, color, delay = 0 }) => {
//   const colorClasses = {
//     primary: 'from-blue-500 to-indigo-600',
//     success: 'from-green-500 to-emerald-600',
//     warning: 'from-orange-500 to-amber-600',
//     info: 'from-cyan-500 to-blue-600',
//   };

//   const iconColorClasses = {
//     primary: 'text-blue-500',
//     success: 'text-green-500',
//     warning: 'text-orange-500',
//     info: 'text-cyan-500',
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay }}
//       whileHover={{ scale: 1.02, y: -4 }}
//       className="relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
//     >
//       <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />
//       <div className="relative">
//         <div className="flex items-center justify-between mb-3">
//           <Icon className={`h-8 w-8 ${iconColorClasses[color]}`} />
//         </div>
//         <p className="text-sm text-gray-600 mb-1">{label}</p>
//         <p className="text-3xl font-bold text-gray-900">{value}</p>
//         {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//       </div>
//     </motion.div>
//   );
// };

// export default function SummaryStats({ stats }: SummaryStatsProps) {
//   if (!stats) {
//     return null;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <StatCard
//         icon={Calendar}
//         label="Total Weeks"
//         value={stats.total_weeks_tracked}
//         color="primary"
//         delay={0}
//       />
//       <StatCard
//         icon={Clock}
//         label="Avg Time/Week"
//         value={formatTimeMinutes(stats.average_weekly_time)}
//         color="success"
//         delay={0.1}
//       />
//       <StatCard
//         icon={Trophy}
//         label="Best Week"
//         value={formatTimeMinutes(stats.most_productive_week_time)}
//         subtitle={stats.most_productive_week 
//           ? new Date(stats.most_productive_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//           : undefined
//         }
//         color="warning"
//         delay={0.2}
//       />
//       <StatCard
//         icon={BarChart3}
//         label="Total Summaries"
//         value={stats.total_summaries}
//         color="info"
//         delay={0.3}
//       />
//     </div>
//   );
// }