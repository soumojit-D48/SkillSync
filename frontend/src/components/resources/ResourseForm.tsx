
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Save,
  Loader2,
  Link2,
  FileText,
  Type,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  useCreateResourceMutation, 
  useUpdateResourceMutation,
  type ResourceType,
  type Resource 
} from '@/store/api/resourcesAndSummaries';
import { useGetSkillsQuery } from '@/store/api/skillsApi';

interface ResourceFormProps {
  resource?: Resource;
  mode: 'create' | 'edit';
}

const resourceTypes: { value: ResourceType | ''; label: string }[] = [
  { value: '', label: 'Select type...' },
  { value: 'course', label: '🎓 Course' },
  { value: 'documentation', label: '📖 Documentation' },
  { value: 'article', label: '📄 Article' },
  { value: 'video', label: '🎥 Video' },
  { value: 'book', label: '📚 Book' },
  { value: 'other', label: '📎 Other' },
];

export function ResourceForm({ resource, mode }: ResourceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    skill_id: resource?.skill_id.toString() || '',
    title: resource?.title || '',
    url: resource?.url || '',
    resource_type: (resource?.resource_type || '') as ResourceType | '',
    description: resource?.description || '',
  });

  // Fetch skills for dropdown
  const { data: skillsData, isLoading: skillsLoading } = useGetSkillsQuery({ 
    page: 1, 
    page_size: 100 
  });

  // Mutations
  const [createResource, { isLoading: isCreating }] = useCreateResourceMutation();
  const [updateResource, { isLoading: isUpdating }] = useUpdateResourceMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.skill_id || !formData.title || !formData.resource_type) {
      return;
    }

    try {
      if (mode === 'create') {
        await createResource({
          skill_id: Number(formData.skill_id),
          title: formData.title,
          url: formData.url || undefined,
          resource_type: formData.resource_type as ResourceType,
          description: formData.description || undefined,
        }).unwrap();
      } else {
        await updateResource({
          id: resource!.id,
          data: {
            title: formData.title,
            url: formData.url || undefined,
            resource_type: formData.resource_type as ResourceType,
            description: formData.description || undefined,
          },
        }).unwrap();
      }

      router.push('/resources');
    } catch (error) {
      console.error(`Failed to ${mode} resource:`, error);
      alert(`Failed to ${mode} resource. Please try again.`);
    }
  };

  const isFormValid = formData.skill_id && formData.title && formData.resource_type;

  const getResourceEmoji = (type: ResourceType | '') => {
    switch (type) {
      case 'course': return '🎓';
      case 'documentation': return '📖';
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'book': return '📚';
      case 'other': return '📎';
      default: return '';
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="p-6 rounded-xl bg-card border border-border space-y-6"
    >
      {/* Skill Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Skill <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select
            required
            value={formData.skill_id}
            onChange={(e) => setFormData({ ...formData, skill_id: e.target.value })}
            disabled={skillsLoading || mode === 'edit'}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          >
            <option value="">
              {skillsLoading ? 'Loading skills...' : 'Select a skill'}
            </option>
            {skillsData?.skills.map(skill => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
        {mode === 'create' && skillsData?.skills.length === 0 && !skillsLoading && (
          <p className="text-sm text-muted-foreground mt-2">
            No skills found. <a href="/skills/new" className="text-primary hover:underline">Create a skill first</a>
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            required
            placeholder="e.g., React Documentation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          URL <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Resource Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Type <span className="text-destructive">*</span>
        </label>
        <select
          required
          value={formData.resource_type}
          onChange={(e) => setFormData({ ...formData, resource_type: e.target.value as ResourceType | '' })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {resourceTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <textarea
            rows={4}
            placeholder="Brief description of the resource..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Preview Card */}
      {isFormValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-lg bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {getResourceEmoji(formData.resource_type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{formData.title}</h3>
              <p className="text-sm text-muted-foreground mb-1 capitalize">
                {formData.resource_type} • {skillsData?.skills.find(s => s.id.toString() === formData.skill_id)?.name}
              </p>
              {formData.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="flex-1"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              {mode === 'create' ? 'Add Resource' : 'Update Resource'}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}