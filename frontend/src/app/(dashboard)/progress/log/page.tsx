
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useGetSkillsQuery } from '@/store/api/skillsApi';
import { useCreateProgressLogMutation } from '@/store/api/progressApi';
import { ProgressForm } from '@/components/progress/ProgressForm';

export default function LogProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSkillId = searchParams.get('skill');

  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkillsQuery();
  const [createProgressLog, { isLoading: isCreating }] = useCreateProgressLogMutation();

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      await createProgressLog(data).unwrap();
      setSuccess(true);
      setTimeout(() => {
        router.push('/progress');
      }, 1500);
    } catch (error) {
      console.error('Failed to log progress:', error);
    }
  };

  if (isLoadingSkills) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
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
        <h1 className="text-3xl font-bold mb-2">Log Progress</h1>
        <p className="text-muted-foreground">
          Record your learning session and track your growth
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
          <p className="text-sm text-success">Progress logged successfully! Redirecting...</p>
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProgressForm
          skills={skillsData?.skills || []}
          isLoading={isCreating}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/progress')}
        />
      </motion.div>
    </div>
  );
}