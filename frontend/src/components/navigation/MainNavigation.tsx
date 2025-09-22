'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/overview',
    icon: HomeIcon,
    description: 'View your networking dashboard and overview',
  },
  {
    name: 'Matches',
    href: '/matches',
    icon: UserGroupIcon,
    description: 'Discover potential networking matches',
  },
  {
    name: 'Connections',
    href: '/connections',
    icon: UserGroupIcon,
    description: 'Manage your professional connections',
  },
  {
    name: 'Events',
    href: '/events',
    icon: CalendarDaysIcon,
    description: 'Browse and join networking events',
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    description: 'Chat with your networking assistant',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    description: 'Manage your profile and preferences',
  },
];

const MainNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setFocusedIndex(-1);
  }, [pathname]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation in mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isMobileMenuOpen) return;

    const menuItems = navigationItems.length + 2; // +2 for settings and logout
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % menuItems);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + menuItems) % menuItems);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Handle item selection based on focusedIndex
        if (focusedIndex < navigationItems.length) {
          router.push(navigationItems[focusedIndex].href);
        } else if (focusedIndex === navigationItems.length) {
          // Settings
          router.push('/settings');
        } else if (focusedIndex === navigationItems.length + 1) {
          // Logout
          handleLogout();
        }
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isCurrentPage = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>

      <nav 
        className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link 
                href="/dashboard/overview" 
                className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                aria-label="NetSync home"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-xl">NetSync</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = isCurrentPage(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900
                      ${isCurrent 
                        ? 'bg-primary-600 text-white' 
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }
                    `}
                    aria-current={isCurrent ? 'page' : undefined}
                    aria-label={item.description}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop user menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="text-neutral-300 hover:text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="View notifications"
              >
                <BellIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              
              <Link
                href="/settings"
                className="text-neutral-300 hover:text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Settings"
              >
                <Cog6ToothIcon className="w-6 h-6" aria-hidden="true" />
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                aria-label="Sign out of your account"
              >
                Sign Out
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-300 hover:text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="md:hidden bg-neutral-800 border-t border-neutral-700"
            onKeyDown={handleKeyDown}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isCurrent = isCurrentPage(item.href);
                const isFocused = focusedIndex === index;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800
                      ${isCurrent 
                        ? 'bg-primary-600 text-white' 
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }
                      ${isFocused ? 'ring-2 ring-primary-500' : ''}
                    `}
                    role="menuitem"
                    aria-current={isCurrent ? 'page' : undefined}
                    tabIndex={isFocused ? 0 : -1}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-neutral-700 pt-3">
                <Link
                  href="/settings"
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800
                    text-neutral-300 hover:text-white hover:bg-neutral-700
                    ${focusedIndex === navigationItems.length ? 'ring-2 ring-primary-500' : ''}
                  `}
                  role="menuitem"
                  tabIndex={focusedIndex === navigationItems.length ? 0 : -1}
                >
                  <Cog6ToothIcon className="w-6 h-6" aria-hidden="true" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800
                    text-neutral-300 hover:text-white hover:bg-neutral-700
                    ${focusedIndex === navigationItems.length + 1 ? 'ring-2 ring-primary-500' : ''}
                  `}
                  role="menuitem"
                  tabIndex={focusedIndex === navigationItems.length + 1 ? 0 : -1}
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default MainNavigation;