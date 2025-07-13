import React from 'react';
import { MapPin, DollarSign, Clock, Users, Building2, Star, Bookmark, BookmarkPlus, Eye, Calendar } from 'lucide-react';
import swaproLogo from '@assets/swapro_1752414782964.png';

interface EnhancedJobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    salary: string;
    type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    workType: 'Onsite' | 'Remote' | 'Hybrid';
    postedDate: string;
    applicants: number;
    urgency?: 'high' | 'medium' | 'low';
    benefits?: string[];
    requirements?: string[];
    description?: string;
    rating?: number;
    featured?: boolean;
    match?: number;
    saved?: boolean;
  };
  onClick?: () => void;
  onSave?: () => void;
  onApply?: () => void;
}

export default function EnhancedJobCard({ job, onClick, onSave, onApply }: EnhancedJobCardProps) {
  const getUrgencyStyle = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200';
      case 'low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200';
    }
  };

  const formatSalary = (salary: string) => {
    return salary.replace(/Rp\s?/g, 'Rp ').replace(/\s-\s/g, ' - ');
  };

  return (
    <div className="group relative">
      {/* Main Card */}
      <div 
        className={`
          relative bg-white dark:bg-gray-800 rounded-2xl border-2 
          ${job.featured ? 'border-purple-200 bg-gradient-to-br from-purple-50 via-white to-orange-50' : 'border-gray-200 dark:border-gray-700'} 
          p-6 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden
          transform hover:-translate-y-2 hover:scale-[1.02]
        `}
        onClick={onClick}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Featured Badge */}
        {job.featured && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-orange-500 text-white px-4 py-2 rounded-bl-2xl text-sm font-semibold shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Match Score */}
        {job.match && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {job.match}% Match
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Company Logo */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-10 h-10 object-contain" />
                ) : (
                  <Building2 size={24} className="text-white" />
                )}
              </div>
              {/* Company verification badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                {job.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{job.company}</p>
                {job.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-yellow-700">{job.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* Urgency Badge */}
            {job.urgency && (
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getUrgencyStyle(job.urgency)}`}>
                {job.urgency === 'high' ? '🔥 URGENT' : job.urgency === 'medium' ? '⚡ Medium' : '✅ Low'}
              </div>
            )}
            
            {/* Save Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
              className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                job.saved 
                ? 'bg-purple-100 text-purple-600 shadow-purple-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {job.saved ? <Bookmark className="h-4 w-4 fill-current" /> : <BookmarkPlus className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-4 mb-6 relative z-10">
          {/* Location & Work Type */}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-500" />
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <span className="font-medium">{job.type} • {job.workType}</span>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-green-500" />
            <span className="font-bold text-lg text-green-700 dark:text-green-400">{formatSalary(job.salary)}</span>
          </div>

          {/* Description Preview */}
          {job.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mb-6 relative z-10">
            <div className="flex flex-wrap gap-2">
              {job.benefits.slice(0, 4).map((benefit, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 shadow-sm"
                >
                  {benefit}
                </span>
              ))}
              {job.benefits.length > 4 && (
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  +{job.benefits.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700 relative z-10">
          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span className="font-medium">{job.applicants} pelamar</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{job.postedDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Eye size={14} />
              Detail
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onApply?.();
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Walk-in Interview
            </button>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}