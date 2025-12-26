
import { baseApi } from './baseApi';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillStatus = 'active' | 'paused' | 'completed';

export interface Skill {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  target_level: SkillLevel;
  current_level: SkillLevel;
  status: SkillStatus;
  total_hours: number;
  created_at: string;
  updated_at?: string;
}

export interface SkillWithStats extends Skill {
  progress_count: number;
  resource_count: number;
  last_practiced?: string;
  streak_days: number;
}

export interface SkillCreateRequest {
  name: string;
  description?: string;
  target_level: SkillLevel;
  current_level: SkillLevel;
}

export interface SkillUpdateRequest {
  name?: string;
  description?: string;
  target_level?: SkillLevel;
  current_level?: SkillLevel;
  status?: SkillStatus;
}

export interface SkillsListResponse {
  skills: Skill[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SkillStatsResponse {
  total_skills: number;
  active_skills: number;
  paused_skills: number;
  completed_skills: number;
  total_learning_time: number;
}

export interface SkillsQueryParams {
  status?: SkillStatus;
  current_level?: SkillLevel;
  target_level?: SkillLevel;
  search?: string;
  page?: number;
  page_size?: number;
}

export const skillsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query<SkillsListResponse, SkillsQueryParams | void>({
      query: (params) => ({
        url: '/skills/',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.skills.map(({ id }) => ({ type: 'Skills' as const, id })),
              { type: 'Skills', id: 'LIST' },
            ]
          : [{ type: 'Skills', id: 'LIST' }],
    }),

    getSkill: builder.query<SkillWithStats, { id: number; with_stats?: boolean }>({
      query: ({ id, with_stats = true }) => ({
        url: `/skills/${id}`,
        params: { with_stats },
      }),
      providesTags: (result, error, { id }) => [{ type: 'Skills', id }],
    }),

    createSkill: builder.mutation<Skill, SkillCreateRequest>({
      query: (data) => ({
        url: '/skills/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Skills', id: 'LIST' }],
    }),

    updateSkill: builder.mutation<Skill, { id: number; data: SkillUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/skills/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Skills', id },
        { type: 'Skills', id: 'LIST' },
      ],
    }),

    deleteSkill: builder.mutation<void, number>({
      query: (id) => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Skills', id: 'LIST' }],
    }),

    getSkillStats: builder.query<SkillStatsResponse, void>({
      query: () => '/skills/stats',
      providesTags: ['Skills'],
    }),

    bulkUpdateSkills: builder.mutation<
      { updated_count: number; new_status: string },
      { skill_ids: number[]; status: SkillStatus }
    >({
      query: (data) => ({
        url: '/skills/bulk-update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Skills', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useGetSkillQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillStatsQuery,
  useBulkUpdateSkillsMutation,
} = skillsApi;