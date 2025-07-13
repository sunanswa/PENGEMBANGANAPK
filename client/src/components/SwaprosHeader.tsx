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
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 px-4 py-8">
        {/* Top Bar with Logo and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 floating">
                <img 
                  src={swaproLogo} 
                  alt="SWAPRO" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">PT SWAPRO</h1>
              <p className="text-purple-100 text-sm font-medium">Smart Workforce Analytics & Professional Recruitment Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
                <input 
                  type="text"
                  placeholder="Cari pekerjaan impian..."
                  className="w-80 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
                />
              </div>
            )}
            
            {showNotifications && (
              <button className="relative p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-300 group">
                <Bell className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">3</div>
              </button>
            )}
            
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  {userRole === 'admin' ? 'Admin Panel' : 'Kandidat'}
                </span>
                <span className="text-xs text-purple-100">
                  {userRole === 'admin' ? 'Super User' : 'Job Seeker'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Title and Subtitle */}
        <div className="animate-slide-in">
          <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">{title}</h2>
          {subtitle && (
            <p className="text-purple-100 text-lg font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Bottom gradient decoration */}
      <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 animate-pulse"></div>
    </div>
  );
}