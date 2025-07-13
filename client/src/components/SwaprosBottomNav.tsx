import React from 'react';
import { Home, Search, Briefcase, MessageCircle, User, Calendar } from 'lucide-react';

interface SwaprosBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function SwaprosBottomNav({ currentPage, onNavigate }: SwaprosBottomNavProps) {
  const navItems = [
    { id: 'menu', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Pekerjaan', icon: Search },
    { id: 'applications', label: 'Lamaran', icon: Briefcase },
    { id: 'interviews', label: 'Interview', icon: Calendar },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-xl border-t border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-orange-50/50"></div>
      </div>
      
      <div className="relative z-10 grid grid-cols-5 h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 transform ${
                isActive 
                  ? 'scale-110 -translate-y-1' 
                  : 'hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/60 text-gray-600 hover:bg-white/80 hover:text-purple-500'
              }`}>
                <Icon 
                  size={20} 
                  className={isActive ? 'text-white' : ''} 
                />
              </div>
              <span className={`text-xs font-bold transition-colors ${
                isActive ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}