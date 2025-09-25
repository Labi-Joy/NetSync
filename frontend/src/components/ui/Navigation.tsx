'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  User,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  Network,
  MessageSquare
} from 'lucide-react';
import Logo from './Logo';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navigationItems = [
    { href: '/dashboard/overview', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matches', label: 'Matches', icon: Users },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/connections', label: 'Network', icon: Network },
    { href: '/chat', label: 'AI Chat', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const dropdownItems = [
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
  ];

  if (!isAuthenticated) {
    return null; // Don't show navigation for non-authenticated users
  }

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Logo
            variant="full"
            size="md"
            href="/dashboard/overview"
            className="text-white hover:opacity-90 transition-opacity"
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white hover:text-blue-400 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Notifications Bell (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/notifications"
              className={`relative p-2 rounded-lg transition-colors ${
                isActivePath('/notifications')
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge - you can make this dynamic */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              </span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block">{user?.name || 'User'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-card rounded-lg shadow-xl border border-slate-200/20 py-2">
                <div className="px-4 py-3 border-b border-slate-200/20">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-300">{user?.email}</p>
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="lg:hidden border-b border-slate-200/20">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Dropdown Items */}
                <div className="border-b border-slate-200/20">
                  {dropdownItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                        {item.href === '/notifications' && (
                          <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}