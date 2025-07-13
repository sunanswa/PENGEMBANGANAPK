import React from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';
import swaproLogo from '@assets/swapro_1752414782964.png';

interface SwaprosHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  userRole?: 'admin' | 'applicant';
}

export default function SwaprosHeader({ 
  title, 
  subtitle, 
  showSearch = false, 
  showNotifications = true,
  userRole = 'applicant'
}: SwaprosHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 text-white shadow-lg">
      <div className="px-4 py-6">
        {/* Top Bar with Logo and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={swaproLogo} 
              alt="SWAPRO" 
              className="h-10 w-auto object-contain bg-white rounded-lg p-1"
            />
            <div>
              <h1 className="text-xl font-bold">PT SWAPRO</h1>
              <p className="text-purple-100 text-sm">Smart Workforce Analytics & Professional Recruitment Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <input 
                  type="text"
                  placeholder="Cari..."
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            )}
            
            {showNotifications && (
              <div className="relative">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-400 rounded-full"></div>
                </button>
              </div>
            )}
            
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Page Title and Subtitle */}
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {subtitle && (
            <p className="text-purple-100">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Bottom gradient decoration */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400"></div>
    </div>
  );
}