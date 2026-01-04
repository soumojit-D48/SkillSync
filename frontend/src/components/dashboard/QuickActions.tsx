
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Target, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    label: 'Log Progress',
    href: '/progress/log',
    icon: Plus,
    variant: 'default' as const,
    description: 'Record a learning session',
    gradient: true,
  },
  {
    label: 'Add New Skill',
    href: '/skills/new',
    icon: Target,
    variant: 'outline' as const,
    description: 'Start learning something new',
    color: 'blue',
  },
  {
    label: 'Add Resource',
    href: '/resources/new',
    icon: BookOpen,
    variant: 'outline' as const,
    description: 'Save learning materials',
    color: 'purple',
  },
  {
    label: 'Week Summary',
    href: '/summaries',
    icon: Calendar,
    variant: 'outline' as const,
    description: 'View weekly insights',
    color: 'emerald',
  },
  {
    label: 'View Statistics',
    href: '/progress/stats',
    icon: TrendingUp,
    variant: 'outline' as const,
    description: 'Analyze your progress',
    color: 'orange',
  },
];

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
};

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 transition-all"
    >
      <h2 className="text-lg font-semibold mb-1">Quick Actions</h2>
      <p className="text-sm text-gray-400 mb-6">
        Shortcuts to common tasks
      </p>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
          >
            <Link href={action.href}>
              <Button
                variant={action.variant}
                className={
                  action.gradient
                    ? 'w-full justify-start h-auto py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20'
                    : `w-full justify-start h-auto py-4 border-gray-800 hover:border-${action.color}-500/30 transition-all hover:scale-[1.02]`
                }
                size="lg"
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={
                      action.gradient
                        ? 'h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0'
                        : `h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[action.color as keyof typeof colorClasses]}`
                    }
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p
                      className={
                        action.gradient
                          ? 'text-xs opacity-90'
                          : 'text-xs text-gray-400'
                      }
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}