import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  message = "Mempersiapkan formulir..." 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  const loadingMessages = [
    "Mempersiapkan formulir...",
    "Memuat data posisi...",
    "Menyiapkan pengalaman terbaik...",
    "Hampir selesai..."
  ];

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 800);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 backdrop-blur-sm">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/swapro copy.png" 
            alt="SWAPRO Logo" 
            className="h-16 sm:h-20 mx-auto drop-shadow-lg animate-pulse"
          />
        </div>

        {/* Loading Spinner */}
        <div className="mb-6">
          <Loader2 size={48} className="text-blue-500 animate-spin mx-auto" />
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>0%</span>
            <span>{Math.round(Math.min(progress, 100))}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-lg text-gray-700 font-medium animate-pulse">
          {currentMessage}
        </p>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;