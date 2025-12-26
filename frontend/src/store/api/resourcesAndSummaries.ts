import { baseApi } from './baseApi';

// ============ RESOURCES ============
export type ResourceType = 'article' | 'video' | 'book' | 'course' | 'documentation' | 'other';

export interface Resource {
  id: number;
  skill_id: number;
  skill_name?: string;
  title: string;
  url?: string;
  resource_type: ResourceType;
  description?: string;
  is_completed: boolean;
  created_at: string;
}

export interface ResourceCreate {
  skill_id: number;
  title: string;
  url?: string;
  resource_type: ResourceType;
  description?: string;
}

export interface ResourceUpdate {
  title?: string;
  url?: string;
  resource_type?: ResourceType;
  description?: string;
  is_completed?: boolean;
}

export interface ResourcesListResponse {
  resources: Resource[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ResourceStats {
  total_resources: number;
  completed_resources: number;
  by_type: Record<string, number>;
  completion_rate: number;
}

// ============ SUMMARIES ============
export interface WeeklySummary {
  id: number;
  user_id: number;
  week_start: string;
  week_end: string;
  total_hours: number;
  summary_text?: string;
  skills_worked_on: number;
  created_at: string;
}

export interface WeeklySummaryWithDetails extends WeeklySummary {
  skills_breakdown: Array<{
    skill_name: string;
    time_spent: number;
    percentage: number;
  }>;
  daily_breakdown: Array<{
    date: string;
    time_spent: number;
  }>;
  top_skill?: string;
  average_daily_time: number;
}

export interface SummaryGenerate {
  week_start: string;
  force_regenerate?: boolean;
}

export interface SummaryListResponse {
  summaries: WeeklySummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SummaryStats {
  total_summaries: number;
  total_weeks_tracked: number;
  average_weekly_time: number;
  most_productive_week?: string;
  most_productive_week_time: number;
}

// ============ RESOURCES API ============
export const resourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<ResourcesListResponse, {
      skill_id?: number;
      resource_type?: ResourceType;
      is_completed?: boolean;
      page?: number;
      page_size?: number;
    } | void>({
      query: (params) => ({
        url: '/resources/',
        params: params || undefined,
      }),
      providesTags: ['Resources'],
    }),

    getResource: builder.query<Resource, number>({
      query: (id) => `/resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resources', id }],
    }),

    createResource: builder.mutation<Resource, ResourceCreate>({
      query: (data) => ({
        url: '/resources/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Resources'],
    }),

    updateResource: builder.mutation<Resource, { id: number; data: ResourceUpdate }>({
      query: ({ id, data }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resources', id }, 'Resources'],
    }),

    deleteResource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resources'],
    }),

    markResourceCompleted: builder.mutation<Resource, { id: number; completed: boolean }>({
      query: ({ id, completed }) => ({
        url: `/resources/${id}/complete`,
        method: 'PATCH',
        params: { completed },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resources', id }, 'Resources'],
    }),

    getResourceStats: builder.query<ResourceStats, void>({
      query: () => '/resources/stats',
      providesTags: ['Resources'],
    }),
  }),
});

// ============ SUMMARIES API ============
export const summariesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateSummary: builder.mutation<WeeklySummary, SummaryGenerate>({
      query: (data) => ({
        url: '/summaries/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Summaries'],
    }),

    getSummaries: builder.query<SummaryListResponse, {
      year?: number;
      month?: number;
      page?: number;
      page_size?: number;
    } | void>({
      query: (params) => ({
        url: '/summaries/',
        params: params || undefined,
      }),
      providesTags: ['Summaries'],
    }),

    getSummary: builder.query<WeeklySummaryWithDetails, { id: number; with_details?: boolean }>({
      query: ({ id, with_details = true }) => ({
        url: `/summaries/${id}`,
        params: { with_details },
      }),
      providesTags: (result, error, { id }) => [{ type: 'Summaries', id }],
    }),

    getCurrentWeekSummary: builder.query<WeeklySummaryWithDetails, void>({
      query: () => '/summaries/current-week',
      providesTags: ['Summaries'],
    }),

    getLastWeekSummary: builder.query<WeeklySummaryWithDetails, void>({
      query: () => '/summaries/last-week',
      providesTags: ['Summaries'],
    }),

    deleteSummary: builder.mutation<void, number>({
      query: (id) => ({
        url: `/summaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Summaries'],
    }),

    getSummaryStats: builder.query<SummaryStats, void>({
      query: () => '/summaries/stats',
      providesTags: ['Summaries'],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useMarkResourceCompletedMutation,
  useGetResourceStatsQuery,
} = resourcesApi;

export const {
  useGenerateSummaryMutation,
  useGetSummariesQuery,
  useGetSummaryQuery,
  useGetCurrentWeekSummaryQuery,
  useGetLastWeekSummaryQuery,
  useDeleteSummaryMutation,
  useGetSummaryStatsQuery,
} = summariesApi;