
'use client';

import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Resource } from '@/store/api/resourcesAndSummaries';

interface ResourceCardProps {
  resource: Resource;
  index: number;
  onToggleComplete: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'course': return '🎓';
    case 'documentation': return '📖';
    case 'article': return '📄';
    case 'video': return '🎥';
    case 'book': return '📚';
    default: return '📎';
  }
};

const getResourceColor = (type: string) => {
  switch (type) {
    case 'course': return 'bg-primary/10 text-primary border-primary/20';
    case 'documentation': return 'bg-info/10 text-info border-info/20';
    case 'article': return 'bg-success/10 text-success border-success/20';
    case 'video': return 'bg-warning/10 text-warning border-warning/20';
    case 'book': return 'bg-destructive/10 text-destructive border-destructive/20';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export function ResourceCard({ 
  resource, 
  index, 
  onToggleComplete, 
  onDelete 
}: ResourceCardProps) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">
          {getResourceIcon(resource.resource_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border capitalize',
                  getResourceColor(resource.resource_type)
                )}>
                  {resource.resource_type}
                </span>
                {resource.skill_name && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {resource.skill_name}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => onToggleComplete(resource.id, resource.is_completed)}
              className="flex-shrink-0 ml-2 transition-colors hover:scale-110"
            >
              {resource.is_completed ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              )}
            </button>
          </div>

          {resource.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {resource.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            {resource.url && (
              <>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View Resource
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <Link href={`/resources/${resource.id}/edit`}>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Edit2 className="h-3 w-3 inline mr-1" />
                Edit
              </button>
            </Link>
            <span className="text-muted-foreground">•</span>
            <button 
              onClick={() => onDelete(resource.id)}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="h-3 w-3 inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}