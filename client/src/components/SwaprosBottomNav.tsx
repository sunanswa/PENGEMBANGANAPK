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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
              }`}
            >
              <Icon 
                size={20} 
                className={isActive ? 'text-purple-600' : ''} 
              />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-orange-500 rounded-b-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}