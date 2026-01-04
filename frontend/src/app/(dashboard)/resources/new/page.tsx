
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/resources/ResourseForm';

export default function AddResourcePage() {
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
        <h1 className="text-3xl font-bold mb-2">Add Resource</h1>
        <p className="text-muted-foreground">
          Add a new learning resource to your library
        </p>
      </div>

      {/* Form */}
      <ResourceForm mode="create" />
    </div>
  );
}