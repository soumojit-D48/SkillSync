
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Clock, FileText, Sparkles, Save, Loader2 } from 'lucide-react';
import { Skill } from '@/store/api/skillsApi';
import { ProgressLog } from '@/store/api/progressApi';

interface ProgressFormProps {
  skills: Skill[];
  initialData?: ProgressLog;
  isLoading?: boolean;
  onSubmit: (data: {
    skill_id: number;
    date: string;
    time_spent: number;
    description?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export function ProgressForm({
  skills,
  initialData,
  isLoading,
  onSubmit,
  onCancel,
}: ProgressFormProps) {
  const [formData, setFormData] = useState({
    skill_id: initialData?.skill_id || 0,
    date: initialData?.date || new Date().toISOString().split('T')[0],
    hours: initialData ? Math.floor(initialData.time_spent / 60) : 0,
    minutes: initialData ? initialData.time_spent % 60 : 0,
    description: initialData?.description || '',
    notes: initialData?.notes || '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.skill_id) {
      setError('Please select a skill');
      return;
    }

    if (formData.hours === 0 && formData.minutes === 0) {
      setError('Time spent must be greater than 0');
      return;
    }

    const totalMinutes = formData.hours * 60 + formData.minutes;

    onSubmit({
      skill_id: formData.skill_id,
      date: formData.date,
      time_spent: totalMinutes,
      description: formData.description.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });
  };

  const isFormValid = formData.skill_id > 0 && (formData.hours > 0 || formData.minutes > 0);

  const selectedSkill = skills.find(s => s.id === formData.skill_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Skill Selection */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <label className="block text-sm font-medium mb-2">
          Skill <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select
            required
            value={formData.skill_id}
            onChange={(e) => setFormData({ ...formData, skill_id: parseInt(e.target.value) })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          >
            <option value={0}>Select a skill...</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <label className="block text-sm font-medium mb-2">
          Date <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            required
            value={formData.date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Time Spent */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <label className="block text-sm font-medium mb-2">
          Time Spent <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-2">Hours</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                min="0"
                max="24"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-2">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={formData.minutes}
              onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>
        {(formData.hours > 0 || formData.minutes > 0) && (
          <p className="text-sm text-primary mt-2">
            Total: {formData.hours}h {formData.minutes}m
          </p>
        )}
      </div>

      {/* Description */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <label className="block text-sm font-medium mb-2">
          What did you learn? <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <textarea
            rows={3}
            placeholder="e.g., Learned about React hooks and state management"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <label className="block text-sm font-medium mb-2">
          Additional Notes <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any challenges, insights, or resources you used..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Preview Card */}
      {isFormValid && selectedSkill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Preview</h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">{selectedSkill.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(formData.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm font-medium text-primary">
              {formData.hours}h {formData.minutes}m
            </p>
            {formData.description && (
              <p className="text-sm text-muted-foreground">{formData.description}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
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
              {initialData ? 'Updating...' : 'Logging...'}
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              {initialData ? 'Update Progress' : 'Log Progress'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
