import React from 'react';

interface BooleanInputProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const BooleanInput: React.FC<BooleanInputProps> = ({
  label,
  name,
  value,
  onChange,
  icon: Icon
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <label className="block text-xs sm:text-sm font-bold text-gray-700">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
              <Icon size={14} className="text-blue-600" />
            </div>
          )}
          {label}
        </div>
      </label>
      
      <div className="flex gap-4 sm:gap-6">
        <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name={name}
              checked={value === true}
              onChange={() => onChange(true)}
              className="sr-only"
            />
            <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 transition-all duration-300 ${
              value === true 
                ? 'border-emerald-500 bg-emerald-500' 
                : 'border-gray-300 bg-white group-hover:border-emerald-300'
            }`}>
              {value === true && (
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-semibold transition-colors ${
            value === true ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-600'
          }`}>
            Ya
          </span>
        </label>
        
        <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name={name}
              checked={value === false}
              onChange={() => onChange(false)}
              className="sr-only"
            />
            <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 transition-all duration-300 ${
              value === false 
                ? 'border-red-500 bg-red-500' 
                : 'border-gray-300 bg-white group-hover:border-red-300'
            }`}>
              {value === false && (
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          </div>
          <span className={`text-xs sm:text-sm font-semibold transition-colors ${
            value === false ? 'text-red-700' : 'text-gray-700 group-hover:text-red-600'
          }`}>
            Tidak
          </span>
        </label>
      </div>
    </div>
  );
};

export default BooleanInput;