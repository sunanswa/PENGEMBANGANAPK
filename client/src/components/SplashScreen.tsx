import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stages = [
      { delay: 0, duration: 500 },      // Stage 0: Initial fade in
      { delay: 500, duration: 800 },    // Stage 1: Logo scale up
      { delay: 1300, duration: 600 },   // Stage 2: Sparkle effects
      { delay: 1900, duration: 500 },   // Stage 3: Text slide up
      { delay: 2400, duration: 400 }    // Stage 4: Fade out
    ];

    stages.forEach((stageConfig, index) => {
      setTimeout(() => {
        setStage(index);
      }, stageConfig.delay);
    });

    // Complete splash screen
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2800);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 transition-all duration-1000 ${
              stage >= 2 ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className={`mb-8 transition-all duration-800 ${
          stage >= 1 
            ? 'opacity-100 scale-100 transform-none' 
            : 'opacity-0 scale-75 transform translate-y-4'
        }`}>
          <img 
            src="/swapro copy.png" 
            alt="SWAPRO Logo" 
            className={`h-24 sm:h-32 lg:h-40 mx-auto drop-shadow-2xl transition-all duration-800 ${
              stage >= 1 ? 'animate-pulse' : ''
            }`}
          />
        </div>

        {/* Sparkle Effects */}
        {stage >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${50 + Math.cos(i * Math.PI / 4) * 15}%`,
                  top: `${50 + Math.sin(i * Math.PI / 4) * 15}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Title Text */}
        <div className={`transition-all duration-500 ${
          stage >= 3 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portal Karir SWAPRO
            </span>
            <span className="text-xl sm:text-2xl lg:text-3xl ml-2">✨</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Mempersiapkan pengalaman terbaik untuk Anda...
          </p>
        </div>

        {/* Loading Bar */}
        <div className={`mt-8 w-64 mx-auto transition-all duration-500 ${
          stage >= 1 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-2000 ease-out"
              style={{ 
                width: stage >= 1 ? '100%' : '0%',
                transition: 'width 2.5s ease-out'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;