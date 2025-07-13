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
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 glass-effect rounded-3xl flex items-center justify-center shadow-2xl border border-white/40 floating magnetic tilt-effect glow-purple">
                <img 
                  src={swaproLogo} 
                  alt="SWAPRO" 
                  className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full morphing-blob shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">✨</span>
              </div>
            </div>
            <div className="animate-scale-in">
              <h1 className="text-3xl font-black text-white drop-shadow-2xl text-animate-gradient">PT SWAPRO</h1>
              <p className="text-white/90 text-sm font-bold mt-1 tracking-wide">Smart Workforce Analytics & Professional Recruitment Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {showSearch && (
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70 group-hover:text-white transition-all group-hover:scale-110" />
                <input 
                  type="text"
                  placeholder="Cari pekerjaan impian..."
                  className="w-96 glass-effect border border-white/40 rounded-3xl pl-14 pr-6 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:glow-purple transition-all duration-500 font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center ripple-effect">
                    <span className="text-white text-xs font-bold">🔍</span>
                  </div>
                </div>
              </div>
            )}
            
            {showNotifications && (
              <button className="relative p-4 glass-effect rounded-3xl hover:glow-orange transition-all duration-500 group magnetic">
                <Bell className="h-7 w-7 text-white group-hover:scale-125 transition-transform" />
                <div className="absolute -top-3 -right-3 h-7 w-7 bg-gradient-to-r from-orange-400 to-red-500 rounded-full text-xs flex items-center justify-center text-white font-black shadow-2xl morphing-blob">3</div>
              </button>
            )}
            
            <div className="flex items-center gap-4 glass-effect rounded-3xl px-6 py-3 border border-white/40 magnetic tilt-effect">
              <div className="w-12 h-12 bg-gradient-to-br from-white via-purple-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-2xl floating">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <span className="font-black text-white text-lg block">
                  {userRole === 'admin' ? 'Admin Panel' : 'Kandidat'}
                </span>
                <span className="text-sm text-white/80 font-medium">
                  {userRole === 'admin' ? 'Super User 👑' : 'Job Seeker 🚀'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Title and Subtitle */}
        <div className="animate-fade-in">
          <h2 className="text-5xl font-black mb-3 text-white drop-shadow-2xl text-animate-gradient">{title}</h2>
          {subtitle && (
            <p className="text-white/90 text-xl font-bold tracking-wide">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Bottom gradient decoration */}
      <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 animate-pulse"></div>
    </div>
  );
}