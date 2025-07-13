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
      {/* Clean Harmonious Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 gradient-mesh opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/80"></div>
        
        {/* Subtle Floating Elements */}
        <div className="absolute top-20 right-32 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-violet-100 rounded-full blur-2xl opacity-40"></div>
        
        {/* Clean Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>
      </div>
      

      
      <div className="relative z-10 px-4 py-8">
        {/* Top Bar with Logo and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 glass-effect rounded-2xl flex items-center justify-center shadow-lg border border-slate-200">
                <img 
                  src={swaproLogo} 
                  alt="SWAPRO" 
                  className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">PT SWAPRO</h1>
              <p className="text-slate-600 text-sm font-medium mt-1">Smart Workforce Analytics & Professional Recruitment Operations</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-500 text-xs font-medium">System Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {showSearch && (
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500 group-hover:text-slate-600 transition-all group-hover:scale-110" />
                <input 
                  type="text"
                  placeholder="Cari pekerjaan impian..."
                  className="w-96 glass-effect border border-slate-300 rounded-2xl pl-14 pr-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔍</span>
                  </div>
                </div>
              </div>
            )}
            
            {showNotifications && (
              <button className="relative p-4 glass-effect rounded-2xl hover:shadow-lg transition-all duration-300 group">
                <Bell className="h-6 w-6 text-slate-600 group-hover:text-slate-800 group-hover:scale-110 transition-all" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg">3</div>
              </button>
            )}
            
            <div className="flex items-center gap-4 glass-effect rounded-2xl px-6 py-3 border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg block">
                  {userRole === 'admin' ? 'Admin Panel' : 'Kandidat'}
                </span>
                <span className="text-sm text-slate-600 font-medium">
                  {userRole === 'admin' ? 'Super User' : 'Job Seeker'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Title and Subtitle */}
        <div className="animate-fade-in">
          <h2 className="text-4xl font-bold mb-3 text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-slate-600 text-lg font-medium tracking-wide">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Bottom gradient decoration */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"></div>
    </div>
  );
}