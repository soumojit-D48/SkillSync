'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Trash2,
  Save,
  Loader2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery, useUpdateProfileMutation, useGetDashboardQuery } from '@/store/api/userApi';
import { useChangePasswordMutation, useLogoutMutation } from '@/store/api/authApi';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // API hooks
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: dashboard, isLoading: dashboardLoading } = useGetDashboardQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  console.log(profile, "profile");
  console.log(dashboard, "dashboard");
  

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: formData.username,
        full_name: formData.full_name || undefined,
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      }).unwrap();
      
      setShowPasswordSection(false);
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logout({ refresh_token: refreshToken || undefined }).unwrap();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear tokens anyway
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/auth');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will delete all your data including skills, progress logs, and resources.'
    );
    
    if (confirmed) {
      const password = window.prompt('Please enter your password to confirm account deletion:');
      if (password) {
        // Note: You'll need to implement this endpoint in your API
        alert('Account deletion is not yet implemented. Please contact support.');
      }
    }
  };

  const calculateAccountAge = () => {
    if (!profile?.created_at) return 0;
    const created = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isLoading = profileLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="flex items-start gap-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center text-4xl font-bold text-primary">
            {formData.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-muted/50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium mb-2">Member Since</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-muted/50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData({
                    username: profile.username || '',
                    full_name: profile.full_name || '',
                  });
                }
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleSaveProfile}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h2 className="text-xl font-semibold mb-6">Account Statistics</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Total Skills</p>
            <p className="text-2xl font-bold">{dashboard?.total_skills || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Progress Logs</p>
            <p className="text-2xl font-bold">{dashboard?.total_progress_logs || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Resources</p>
            <p className="text-2xl font-bold">{dashboard?.total_resources || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Learning Hours</p>
            <p className="text-2xl font-bold text-primary">
              {(dashboard?.total_learning_time || 0).toFixed(0)}min
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 md:col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Account Age</p>
            <p className="text-2xl font-bold">{calculateAccountAge()} days</p>
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        {!showPasswordSection ? (
          <Button
            variant="outline"
            onClick={() => setShowPasswordSection(true)}
          >
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {passwordData.new_password && passwordData.confirm_password && 
             passwordData.new_password !== passwordData.confirm_password && (
              <p className="text-sm text-destructive">Passwords do not match!</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordSection(false);
                  setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                }}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleChangePassword}
                disabled={
                  isChangingPassword || 
                  !passwordData.old_password || 
                  !passwordData.new_password || 
                  passwordData.new_password !== passwordData.confirm_password
                }
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-destructive/5 border border-destructive/20"
      >
        <h2 className="text-xl font-semibold mb-2 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Irreversible and destructive actions
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive border-destructive/20"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive border-destructive/20"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
}