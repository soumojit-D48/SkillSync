
'use client';

import { ResourceStats as ResourceStatsType } from '@/store/api/resourcesAndSummaries';

interface ResourceStatsProps {
  stats: ResourceStatsType | undefined;
  isLoading: boolean;
}

export function ResourceStats({ stats, isLoading }: ResourceStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
        <p className="text-2xl font-bold">
          {isLoading ? '...' : stats?.total_resources || 0}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Completed</p>
        <p className="text-2xl font-bold text-success">
          {isLoading ? '...' : stats?.completed_resources || 0}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">In Progress</p>
        <p className="text-2xl font-bold text-primary">
          {isLoading ? '...' : (stats?.total_resources || 0) - (stats?.completed_resources || 0)}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Progress</p>
        <p className="text-2xl font-bold text-info">
          {isLoading ? '...' : `${(stats?.completion_rate || 0).toFixed(0)}%`}
        </p>
      </div>
    </div>
  );
}