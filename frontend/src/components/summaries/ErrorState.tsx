
'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: any;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  error, 
  onRetry 
}: ErrorStateProps) {
  const errorMessage = message || 
    (error && 'data' in error ? String(error.data) : 'An unexpected error occurred');

  return (
    <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}