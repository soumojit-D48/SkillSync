
import { baseApi } from './baseApi';

export interface ProgressLog {
  id: number;
  user_id: number;
  skill_id: number;
  skill_name?: string;
  date: string;
  time_spent: number;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProgressLogCreate {
  skill_id: number;
  date: string;
  time_spent: number;
  description?: string;
  notes?: string;
}

export interface ProgressLogUpdate {
  time_spent?: number;
  description?: string;
  notes?: string;
}

export interface ProgressListResponse {
  logs: ProgressLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProgressStats {
  total_logs: number;
  total_time: number;
  skills_tracked: number;
  current_streak: number;
  longest_streak: number;
  today_time: number;
  this_week_time: number;
  this_month_time: number;
}

export interface DailyStats {
  date: string;
  total_time: number;
  skills_practiced: number;
  log_count: number;
}

export interface WeeklyStats {
  week_start: string;
  week_end: string;
  total_time: number;
  skills_practiced: number;
  log_count: number;
  daily_breakdown: DailyStats[];
}

export interface MonthlyStats {
  month: string;
  total_time: number;
  skills_practiced: number;
  log_count: number;
  active_days: number;
}

export interface SkillProgressSummary {
  skill_id: number;
  skill_name: string;
  total_time: number;
  log_count: number;
  last_practiced?: string;
  current_streak: number;
  average_daily_time: number;
}

export interface ProgressQueryParams {
  skill_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgressLogs: builder.query<ProgressListResponse, ProgressQueryParams | void>({
      query: (params) => ({
        url: '/progress/',
        params: undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.logs.map(({ id }) => ({ type: 'Progress' as const, id })),
              { type: 'Progress', id: 'LIST' },
            ]
          : [{ type: 'Progress', id: 'LIST' }],
    }),

    getProgressLog: builder.query<ProgressLog, number>({
      query: (id) => `/progress/${id}`,
      providesTags: (result, error, id) => [{ type: 'Progress', id }],
    }),

    createProgressLog: builder.mutation<ProgressLog, ProgressLogCreate>({
      query: (data) => ({
        url: '/progress/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'LIST' },
        { type: 'Skills', id: 'LIST' },
      ],
    }),

    updateProgressLog: builder.mutation<ProgressLog, { id: number; data: ProgressLogUpdate }>({
      query: ({ id, data }) => ({
        url: `/progress/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Progress', id },
        { type: 'Progress', id: 'LIST' },
        { type: 'Skills', id: 'LIST' },
      ],
    }),

    deleteProgressLog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/progress/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'LIST' },
        { type: 'Skills', id: 'LIST' },
      ],
    }),

    getOverallStats: builder.query<ProgressStats, void>({
      query: () => '/progress/stats',
      providesTags: ['Progress'],
    }),

    getDailyStats: builder.query<DailyStats, string | void>({
      query: (date) => ({
        url: '/progress/stats/daily',
        params: date ? { target_date: date } : undefined,
      }),
      providesTags: ['Progress'],
    }),

    getWeeklyStats: builder.query<WeeklyStats, string | void>({
      query: (weekStart) => ({
        url: '/progress/stats/weekly',
        params: weekStart ? { week_start: weekStart } : undefined,
      }),
      providesTags: ['Progress'],
    }),

    getMonthlyStats: builder.query<MonthlyStats, { year?: number; month?: number } | void>({
      query: (params) => ({
        url: '/progress/stats/monthly',
        params: undefined,
      }),
      providesTags: ['Progress'],
    }),

    getSkillProgressSummary: builder.query<SkillProgressSummary, number>({
      query: (skillId) => `/progress/skills/${skillId}/summary`,
      providesTags: (result, error, skillId) => [
        { type: 'Progress', id: `SKILL_${skillId}` },
      ],
    }),
  }),
});

export const {
  useGetProgressLogsQuery,
  useGetProgressLogQuery,
  useCreateProgressLogMutation,
  useUpdateProgressLogMutation,
  useDeleteProgressLogMutation,
  useGetOverallStatsQuery,
  useGetDailyStatsQuery,
  useGetWeeklyStatsQuery,
  useGetMonthlyStatsQuery,
  useGetSkillProgressSummaryQuery,
} = progressApi;