import React from 'react';
import { MapPin, DollarSign, Clock, Users, Building2, Star } from 'lucide-react';

interface JobCardProps {
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
  };
  onClick?: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSalary = (salary: string) => {
    return salary.replace(/Rp\s?/g, 'Rp ').replace(/\s-\s/g, ' - ');
  };

  return (
    <div 
      className={`bg-white rounded-2xl border-2 ${job.featured ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-100'} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden`}
      onClick={onClick}
    >
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
          Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
            ) : (
              <Building2 size={20} className="text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-gray-600">{job.company}</p>
              {job.rating && (
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-500">{job.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Urgency Badge */}
        {job.urgency && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(job.urgency)}`}>
            {job.urgency === 'high' ? 'Urgent' : job.urgency === 'medium' ? 'Medium' : 'Low'}
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        {/* Location & Work Type */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-400" />
            <span>{job.type}, {job.workType}</span>
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-1 text-sm">
          <DollarSign size={16} className="text-green-500" />
          <span className="font-semibold text-green-700">{formatSalary(job.salary)}</span>
        </div>

        {/* Description Preview */}
        {job.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.description}
          </p>
        )}
      </div>

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.benefits.slice(0, 3).map((benefit, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                +{job.benefits.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{job.applicants} applicants</span>
          </div>
          <span>Posted {job.postedDate}</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg">
            Walk-in Interview
          </button>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
            {job.applicants} Kuota Daftar
          </span>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </div>
  );
}