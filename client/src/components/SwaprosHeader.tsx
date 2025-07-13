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
      {/* Dynamic Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 gradient-mesh opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/70"></div>
        
        {/* Floating Orbs with Glow */}
        <div className="absolute top-20 right-32 w-48 h-48 glow-purple rounded-full blur-3xl opacity-40 floating"></div>
        <div className="absolute bottom-20 left-32 w-32 h-32 glow-orange rounded-full blur-2xl opacity-50 morphing-blob"></div>
        <div className="absolute top-32 left-1/2 w-24 h-24 glow-cyan rounded-full blur-xl opacity-60 parallax-float"></div>
        
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.2) 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2) 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px'
          }}></div>
        </div>
        
        {/* Animated Light Rays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-60" 
               style={{ top: '25%', animation: 'lightRay 6s ease-in-out infinite' }}></div>
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent opacity-40" 
               style={{ top: '75%', animation: 'lightRay 8s ease-in-out infinite reverse' }}></div>
        </div>
      </div>
      

      
      <div className="relative z-10 px-4 py-8">
        {/* Top Bar with Logo and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 glass-effect rounded-3xl flex items-center justify-center shadow-2xl border-2 border-purple-200 floating magnetic tilt-effect glow-purple">
                <img 
                  src={swaproLogo} 
                  alt="SWAPRO" 
                  className="w-14 h-14 object-contain transition-all group-hover:scale-125 group-hover:rotate-12 filter drop-shadow-lg"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full shadow-xl flex items-center justify-center glow-purple morphing-blob">
                <span className="text-white text-sm font-black">⚡</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full floating glow-orange">
                <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">★</span>
              </div>
            </div>
            <div className="animate-scale-in">
              <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600 bg-clip-text drop-shadow-lg animate-pulse">PT SWAPRO</h1>
              <p className="text-gray-700 text-base font-bold mt-2 tracking-wide">Smart Workforce Analytics & Professional Recruitment Operations</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-gray-600 text-sm font-bold uppercase tracking-wider">SYSTEM OPTIMIZED</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
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