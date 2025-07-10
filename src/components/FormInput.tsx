import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
  maxLength?: number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 4,
  maxLength,
  icon: Icon
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputClasses = `
    w-full px-3 sm:px-4 py-3 sm:py-4 border-2 rounded-2xl transition-all duration-300 
    focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400
    ${error 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-md'
    }
    text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base
  `;

  return (
    <div className="space-y-2 sm:space-y-3">
      <label className="block text-xs sm:text-sm font-bold text-gray-700">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
              <Icon size={14} className="text-blue-600" />
            </div>
          )}
          {label}
          {required && <span className="text-red-500 text-lg">*</span>}
        </div>
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">{placeholder || `Pilih ${label}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          className={inputClasses}
        />
      )}
      
      {error && (
        <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 sm:p-3 rounded-xl border border-red-200">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {maxLength && (
        <p className="text-xs text-gray-400 text-right font-medium">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default FormInput;