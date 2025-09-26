'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Settings as SettingsIcon
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailMatches: true,
    emailMessages: true,
    emailEvents: false,
    pushMatches: true,
    pushMessages: true,
    pushEvents: false,
    weeklyDigest: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public' as 'public' | 'connections' | 'private',
    showEmail: false,
    showCompany: true,
    allowMatching: true,
    dataAnalytics: true
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark' as 'light' | 'dark' | 'auto',
    accentColor: 'blue' as 'blue' | 'purple' | 'green' | 'orange',
    animationsEnabled: true
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleAccountSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: accountForm.name,
        email: accountForm.email
      });
      // Show success message
      console.log('Account updated successfully');
    } catch (error) {
      console.error('Failed to update account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Implement password change logic
    console.log('Password change requested');
  };

  const handleDataExport = () => {
    // Implement data export functionality
    console.log('Data export requested');
  };

  const handleAccountDeletion = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic
      console.log('Account deletion requested');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Settings</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage your account preferences and privacy settings</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="card p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="card p-8">
                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Account Settings</h2>
                    
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={accountForm.name}
                          onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAccountSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* Password Change */}
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div className="relative">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={accountForm.currentPassword}
                            onChange={(e) => setAccountForm({...accountForm, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-9 text-slate-400 hover:text-white"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            New Password
                          </label>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={accountForm.newPassword}
                            onChange={(e) => setAccountForm({...accountForm, newPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-9 text-slate-400 hover:text-white"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={accountForm.confirmPassword}
                            onChange={(e) => setAccountForm({...accountForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Data Management</h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleDataExport}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export Data
                        </button>
                        <button
                          onClick={handleAccountDeletion}
                          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Notification Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                        <div className="space-y-3">
                          {[
                            { key: 'emailMatches', label: 'New matches found', description: 'Get notified when new networking matches are available' },
                            { key: 'emailMessages', label: 'Direct messages', description: 'Receive emails for new messages from connections' },
                            { key: 'emailEvents', label: 'Event updates', description: 'Updates about conferences and events you\'re attending' },
                            { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of your networking activity and opportunities' }
                          ].map((item) => (
                            <label key={item.key} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [item.key]: e.target.checked
                                })}
                                className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                              />
                              <div>
                                <div className="text-white font-medium">{item.label}</div>
                                <div className="text-sm text-slate-400">{item.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Push Notifications</h3>
                        <div className="space-y-3">
                          {[
                            { key: 'pushMatches', label: 'New matches', description: 'Instant notifications for new networking opportunities' },
                            { key: 'pushMessages', label: 'Messages', description: 'Real-time notifications for new messages' },
                            { key: 'pushEvents', label: 'Event reminders', description: 'Reminders about upcoming events and meetings' }
                          ].map((item) => (
                            <label key={item.key} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [item.key]: e.target.checked
                                })}
                                className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                              />
                              <div>
                                <div className="text-white font-medium">{item.label}</div>
                                <div className="text-sm text-slate-400">{item.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            profileVisibility: e.target.value as 'public' | 'connections' | 'private'
                          })}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="public">Public - Visible to all users</option>
                          <option value="connections">Connections Only - Visible to your connections</option>
                          <option value="private">Private - Only visible to you</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: 'showEmail', label: 'Show email address on profile', description: 'Allow other users to see your email address' },
                          { key: 'showCompany', label: 'Show company information', description: 'Display your current company and position' },
                          { key: 'allowMatching', label: 'Allow matching algorithm', description: 'Let the AI suggest you as a match to other users' },
                          { key: 'dataAnalytics', label: 'Data analytics', description: 'Help improve NetSync with anonymous usage data' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                              onChange={(e) => setPrivacySettings({
                                ...privacySettings,
                                [item.key]: e.target.checked
                              })}
                              className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-white font-medium">{item.label}</div>
                              <div className="text-sm text-slate-400">{item.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Appearance Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Theme
                        </label>
                        <select
                          value={themeSettings.theme}
                          onChange={(e) => setThemeSettings({
                            ...themeSettings,
                            theme: e.target.value as 'light' | 'dark' | 'auto'
                          })}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (system preference)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Accent Color
                        </label>
                        <div className="flex gap-3">
                          {[
                            { value: 'blue', color: 'bg-blue-500' },
                            { value: 'purple', color: 'bg-purple-500' },
                            { value: 'green', color: 'bg-green-500' },
                            { value: 'orange', color: 'bg-orange-500' }
                          ].map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setThemeSettings({
                                ...themeSettings,
                                accentColor: color.value as any
                              })}
                              className={`w-12 h-12 rounded-full ${color.color} ${
                                themeSettings.accentColor === color.value
                                  ? 'ring-4 ring-white ring-opacity-50'
                                  : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={themeSettings.animationsEnabled}
                            onChange={(e) => setThemeSettings({
                              ...themeSettings,
                              animationsEnabled: e.target.checked
                            })}
                            className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <div className="text-white font-medium">Enable animations</div>
                            <div className="text-sm text-slate-400">Turn off animations to improve performance</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}