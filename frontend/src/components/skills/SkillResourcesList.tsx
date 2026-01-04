

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ExternalLink, Plus, Loader2 } from 'lucide-react';
import type { Resource } from '@/store/api/resourcesAndSummaries';

interface SkillResourcesListProps {
  resources: Resource[];
  skillId: number;
  isLoading: boolean;
  onToggleCompleted: (resourceId: number, currentStatus: boolean) => void;
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

export function SkillResourcesList({ 
  resources, 
  skillId, 
  isLoading, 
  onToggleCompleted 
}: SkillResourcesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No resources added yet</p>
        <Link href={`/resources/new?skill=${skillId}`}>
          <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add Your First Resource
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">{getResourceIcon(resource.resource_type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {resource.resource_type}
                  </p>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {resource.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onToggleCompleted(resource.id, resource.is_completed)}
                  className="flex-shrink-0"
                >
                  <CheckCircle2 
                    className={`h-5 w-5 transition-colors ${
                      resource.is_completed ? 'text-success' : 'text-muted-foreground hover:text-success'
                    }`}
                  />
                </button>
              </div>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View Resource
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}