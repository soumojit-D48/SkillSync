
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Target,
  FileText,
  TrendingUp,
  Save,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SkillLevel, useCreateSkillMutation } from '@/store/api/skillsApi';

const levels = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', icon: '🌿', description: 'Building experience' },
  { value: 'advanced', label: 'Advanced', icon: '🌳', description: 'Strong proficiency' },
  { value: 'expert', label: 'Expert', icon: '🏆', description: 'Mastery level' },
];

export default function CreateSkillPage() {
  const router = useRouter();
  const [createSkill, { isLoading }] = useCreateSkillMutation();
  
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    current_level: 'beginner',
    target_level: 'intermediate',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }

    if (formData.current_level === formData.target_level) {
      setError('Target level must be different from current level');
      return;
    }

    const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levelOrder.indexOf(formData.current_level);
    const targetIndex = levelOrder.indexOf(formData.target_level);
    
    if (targetIndex <= currentIndex) {
      setError('Target level must be higher than current level');
      return;
    }

    try {
      const result = await createSkill({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        current_level: formData.current_level as SkillLevel,
        target_level: formData.target_level as SkillLevel,
      }).unwrap();

      router.push(`/skills/${result.id}`);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create skill. Please try again.');
    }
  };

  const getLevelIcon = (level: string) => {
    return levels.find(l => l.value === level)?.icon || '🎯';
  };

  const isFormValid = formData.name.trim() && 
                      formData.current_level && 
                      formData.target_level &&
                      formData.current_level !== formData.target_level;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/skills">
        <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </button>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Add New Skill</h1>
        <p className="text-muted-foreground">
          Start tracking a new skill in your learning journey
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
        >
          <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-destructive text-xs">!</span>
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Skill Name */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <label className="block text-sm font-medium mb-2">
            Skill Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              required
              placeholder="e.g., React, Python, Photography..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <textarea
              rows={4}
              placeholder="What do you want to learn about this skill?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Levels Section */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Skill Levels</h2>
          </div>

          {/* Current Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Current Level <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {levels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, current_level: level.value })}
                  disabled={isLoading}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.current_level === level.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{level.icon}</span>
                    <span className="font-semibold">{level.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
              <span className="text-sm text-muted-foreground">Progress to</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Target Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Target Level <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {levels.map((level) => {
                const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
                const currentIndex = levelOrder.indexOf(formData.current_level);
                const thisIndex = levelOrder.indexOf(level.value);
                const isDisabled = thisIndex <= currentIndex;

                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => !isDisabled && setFormData({ ...formData, target_level: level.value })}
                    disabled={isLoading || isDisabled}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isDisabled ? 'opacity-40 cursor-not-allowed' : ''
                    } ${
                      !isDisabled && formData.target_level === level.value
                        ? 'border-success bg-success/10'
                        : !isDisabled && 'border-border hover:border-success/50 bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{level.icon}</span>
                      <span className="font-semibold">{level.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Target level must be higher than your current level
            </p>
          </div>
        </div>

        {/* Preview Card */}
        {isFormValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Preview</h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xl font-bold mb-1">{formData.name}</h4>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <span>{getLevelIcon(formData.current_level)}</span>
                  <span className="capitalize">{formData.current_level}</span>
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="flex items-center gap-1">
                  <span>{getLevelIcon(formData.target_level)}</span>
                  <span className="capitalize">{formData.target_level}</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-info rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Create Skill
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}