import { baseApi } from './baseApi';
import { User } from './authApi';

export interface UserProfileUpdate {
  full_name?: string;
  username?: string;
}

export interface UserEmailUpdate {
  email: string;
  password: string;
}

export interface UserDashboard {
  profile: User;
  total_skills: number;
  active_skills: number;
  total_progress_logs: number;
  total_learning_time: number;
  current_streak: number;
  total_resources: number;
  completed_resources: number;
}

export interface UserQuickStats {
  total_skills: number;
  active_skills: number;
  total_learning_time: number;
  current_streak: number;
  today_time: number;
  this_week_time: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, UserProfileUpdate>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    updateEmail: builder.mutation<User, UserEmailUpdate>({
      query: (data) => ({
        url: '/users/email',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    getDashboard: builder.query<UserDashboard, void>({
      query: () => '/users/dashboard',
      providesTags: ['User'],
    }),

    getQuickStats: builder.query<UserQuickStats, void>({
      query: () => '/users/stats',
      providesTags: ['User'],
    }),

    deactivateAccount: builder.mutation<void, { password: string }>({
      query: (data) => ({
        url: '/users/deactivate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateEmailMutation,
  useGetDashboardQuery,
  useGetQuickStatsQuery,
  useDeactivateAccountMutation,
} = userApi;