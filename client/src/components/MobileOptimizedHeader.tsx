import React, { useState } from 'react';
import { Menu, X, Bell, Search, Filter } from 'lucide-react';
import RealTimeIndicator from './RealTimeIndicator';

interface MobileOptimizedHeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  notificationCount?: number;
}

export default function MobileOptimizedHeader({
  title,
  subtitle,
  onMenuToggle,
  isMobileMenuOpen,
  notificationCount = 0
}: MobileOptimizedHeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">{title}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Search size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Filter size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm pl-9">{subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <RealTimeIndicator />
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105 relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}