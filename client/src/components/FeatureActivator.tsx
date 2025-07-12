import React, { useEffect } from 'react';
import { Check, Zap, Shield, BarChart3, MessageSquare, Users, FileCheck, CreditCard } from 'lucide-react';

interface FeatureActivatorProps {
  onComplete: () => void;
}

const FeatureActivator: React.FC<FeatureActivatorProps> = ({ onComplete }) => {
  const features = [
    { name: 'Advanced Analytics & AI Insights', icon: BarChart3, status: 'activating' },
    { name: 'Multi-Channel Communication Hub', icon: MessageSquare, status: 'activating' },
    { name: 'Enhanced Applicant Management', icon: Users, status: 'activating' },
    { name: 'SLIK Credit Check Integration', icon: CreditCard, status: 'activating' },
    { name: 'Interview Scheduling System', icon: FileCheck, status: 'activating' },
    { name: 'Security & Audit Logging', icon: Shield, status: 'activating' },
    { name: 'Real-time Data Synchronization', icon: Zap, status: 'activating' },
  ];

  const [activatedFeatures, setActivatedFeatures] = React.useState<string[]>([]);

  useEffect(() => {
    const activateFeatures = async () => {
      for (let i = 0; i < features.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setActivatedFeatures(prev => [...prev, features[i].name]);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    };

    activateFeatures();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Mengaktifkan Semua Fitur</h2>
          <p className="text-blue-200">Sistem SWAPRO sedang mengaktifkan fitur lengkap...</p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActivated = activatedFeatures.includes(feature.name);
            const isActivating = index === activatedFeatures.length && !isActivated;

            return (
              <div key={feature.name} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActivated 
                    ? 'bg-green-500' 
                    : isActivating 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-gray-600'
                }`}>
                  {isActivated ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Icon size={16} className="text-white" />
                  )}
                </div>
                <span className={`flex-1 transition-colors duration-300 ${
                  isActivated ? 'text-green-300' : 'text-gray-300'
                }`}>
                  {feature.name}
                </span>
                {isActivating && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activatedFeatures.length === features.length && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3">
              <Check size={20} className="text-green-400" />
              <span className="text-green-300 font-semibold">Semua Fitur Aktif</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureActivator;