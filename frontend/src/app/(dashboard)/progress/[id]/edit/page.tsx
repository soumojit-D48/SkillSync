
'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useGetSkillsQuery } from '@/store/api/skillsApi';
import { 
  useGetProgressLogQuery,
  useUpdateProgressLogMutation 
} from '@/store/api/progressApi';
import { ProgressForm } from '@/components/progress/ProgressForm';

export default function EditProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const logId = parseInt(resolvedParams.id);

  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkillsQuery();
  const { data: progressLog, isLoading: isLoadingLog, error: logError } = useGetProgressLogQuery(
    logId,
    { skip: !logId }
  );
  const [updateProgressLog, { isLoading: isUpdating }] = useUpdateProgressLogMutation();

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      await updateProgressLog({
        id: logId,
        data: {
          time_spent: data.time_spent,
          description: data.description,
          notes: data.notes,
        },
      }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        router.push('/progress');
      }, 1500);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (isLoadingSkills || isLoadingLog) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (logError || !progressLog) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/progress">
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Progress
          </button>
        </Link>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Progress log not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/progress">
        <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Progress
        </button>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Edit Progress Log</h1>
        <p className="text-muted-foreground">
          Update your learning session details
        </p>
      </motion.div>

      {/* Success Alert */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3"
        >
          <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-success text-xs">✓</span>
          </div>
          <p className="text-sm text-success">Progress updated successfully! Redirecting...</p>
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProgressForm
          skills={skillsData?.skills || []}
          initialData={progressLog}
          isLoading={isUpdating}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/progress')}
        />
      </motion.div>
    </div>
  );
}