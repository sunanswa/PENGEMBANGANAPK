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
      {/* Ultra Modern Glassmorphism Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/85 backdrop-blur-3xl">
          <div className="absolute inset-0 gradient-mesh opacity-60"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
        </div>
      </div>
      
      <div className="relative z-10 grid grid-cols-5 h-24 px-3 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`flex flex-col items-center justify-center space-y-2 transition-all duration-500 transform animate-scale-in ${
                isActive 
                  ? 'scale-125 -translate-y-2' 
                  : 'hover:scale-110 hover:-translate-y-1'
              }`}
            >
              <div className={`relative p-4 rounded-3xl transition-all duration-500 ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white shadow-2xl glow-purple' 
                  : 'glass-effect text-gray-600 hover:glow-orange hover:text-purple-600'
              } magnetic tilt-effect ripple-effect`}>
                <Icon 
                  size={24} 
                  className={`transition-transform duration-300 ${
                    isActive ? 'text-white scale-110' : 'group-hover:scale-125'
                  }`} 
                />
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center morphing-blob">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                )}
              </div>
              
              <span className={`text-xs font-black transition-all duration-300 ${
                isActive 
                  ? 'text-purple-600 scale-110' 
                  : 'text-gray-600 hover:text-purple-500'
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Floating Action Indicator */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
}