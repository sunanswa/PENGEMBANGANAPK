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
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-500 to-purple-500 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Featured Badge */}
        {job.featured && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold shadow-lg z-20">
            ⭐ Featured
          </div>
        )}

        {/* Match Score */}
        {job.match && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md z-20">
            {job.match}% Match
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Company Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md transform rotate-2 group-hover:rotate-0 transition-transform duration-300">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
                ) : (
                  <Building2 size={18} className="text-white" />
                )}
              </div>
              {/* Company verification badge */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 mb-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-slate-600">{job.company}</p>
                {job.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-yellow-700">{job.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-start gap-2 flex-shrink-0">
            {/* Urgency Badge */}
            {job.urgency && (
              <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getUrgencyStyle(job.urgency)}`}>
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
                ? 'bg-indigo-100 text-indigo-600 shadow-indigo-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {job.saved ? <Bookmark className="h-3 w-3 fill-current" /> : <BookmarkPlus className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-4 relative z-10">
          {/* Location & Work Type */}
          <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-violet-500 flex-shrink-0" />
              <span className="font-medium">{job.type} • {job.workType}</span>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="font-bold text-base text-emerald-700">{formatSalary(job.salary)}</span>
          </div>

          {/* Description Preview */}
          {job.description && (
            <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mb-4 relative z-10">
            <div className="flex flex-wrap gap-1">
              {job.benefits.slice(0, 3).map((benefit, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
                >
                  {benefit}
                </span>
              ))}
              {job.benefits.length > 3 && (
                <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                  +{job.benefits.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span className="font-medium">{job.applicants} pelamar</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{job.postedDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
            >
              <Eye size={12} />
              Detail
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onApply?.();
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Lamar Sekarang
            </button>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}