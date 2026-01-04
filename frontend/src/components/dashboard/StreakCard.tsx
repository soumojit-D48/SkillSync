
'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  todayLogged: boolean;
  isLoading?: boolean;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  todayLogged,
  isLoading,
}: StreakCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-xl bg-gradient-to-br from-warning/10 to-orange-500/5 border border-warning/20"
      >
        <div className="animate-pulse">
          <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
          <div className="h-8 w-24 bg-muted rounded mb-2" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </motion.div>
    );
  }

  const isOnFire = currentStreak >= 7;
  const isGettingHot = currentStreak >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={cn(
        'p-6 rounded-xl border transition-all duration-300',
        isOnFire
          ? 'bg-gradient-to-br from-warning/20 to-orange-500/10 border-warning/40 shadow-lg shadow-warning/20'
          : isGettingHot
          ? 'bg-gradient-to-br from-warning/10 to-orange-500/5 border-warning/30'
          : 'bg-gradient-to-br from-warning/5 to-orange-500/5 border-warning/20'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-14 w-14 rounded-xl flex items-center justify-center transition-all',
              isOnFire
                ? 'bg-warning/30 animate-pulse'
                : isGettingHot
                ? 'bg-warning/20'
                : 'bg-warning/10'
            )}
          >
            <Flame
              className={cn(
                'h-8 w-8',
                isOnFire ? 'text-warning animate-bounce' : 'text-warning'
              )}
            />
          </div>
          {isOnFire && (
            <div className="flex flex-col">
              <span className="text-2xl">🔥</span>
              <span className="text-xs font-medium text-warning">On Fire!</span>
            </div>
          )}
        </div>
        {todayLogged && (
          <div className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
            ✓ Today
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
          <p className="text-4xl font-bold text-warning">
            {currentStreak}
            <span className="text-xl ml-1">days</span>
          </p>
        </div>

        {currentStreak > 0 && (
          <div className="flex items-center gap-2 text-sm">
            {isOnFire ? (
              <span className="text-warning font-medium">
                🎉 Amazing! Keep the momentum going!
              </span>
            ) : isGettingHot ? (
              <span className="text-warning font-medium">
                🌟 You're building great habits!
              </span>
            ) : (
              <span className="text-muted-foreground">
                Keep it up! You're doing great!
              </span>
            )}
          </div>
        )}

        {currentStreak === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Start your streak today!</span>
          </div>
        )}

        <div className="pt-3 border-t border-warning/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-warning" />
            <span>Best Streak</span>
          </div>
          <span className="text-lg font-bold text-warning">{longestStreak} days</span>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentStreak > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress to milestone</span>
            <span>
              {currentStreak}/
              {currentStreak < 7 ? '7' : currentStreak < 30 ? '30' : '100'}
            </span>
          </div>
          <div className="h-2 bg-warning/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  currentStreak < 7
                    ? (currentStreak / 7) * 100
                    : currentStreak < 30
                    ? (currentStreak / 30) * 100
                    : (currentStreak / 100) * 100
                }%`,
              }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-warning to-orange-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}


