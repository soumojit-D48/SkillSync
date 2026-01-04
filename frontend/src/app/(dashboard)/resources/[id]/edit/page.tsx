
'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/resources/ResourseForm';
import { useGetResourceQuery } from '@/store/api/resourcesAndSummaries';

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = use(params);
  const resourceId = parseInt(id);

  const { data: resource, isLoading, error } = useGetResourceQuery(resourceId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/resources">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-lg text-destructive mb-4">Resource not found</p>
          <Link href="/resources">
            <Button variant="outline">Return to Resources</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/resources">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Resource</h1>
        <p className="text-muted-foreground">
          Update your learning resource details
        </p>
      </div>

      {/* Form */}
      <ResourceForm mode="edit" resource={resource} />
    </div>
  );
}