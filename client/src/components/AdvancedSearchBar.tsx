import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, MapPin, Star, Briefcase } from 'lucide-react';
import { SearchFilters } from '@/hooks/useAdvancedSearch';

interface AdvancedSearchBarProps {
  filters: SearchFilters;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  getFilterCount: () => number;
  placeholder?: string;
  type: 'applications' | 'candidates' | 'jobs';
}

export default function AdvancedSearchBar({
  filters,
  updateFilter,
  clearFilters,
  getFilterCount,
  placeholder = "Search...",
  type
}: AdvancedSearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const filterCount = getFilterCount();

  const statusOptions = {
    applications: ['submitted', 'viewed', 'interview', 'accepted', 'rejected'],
    candidates: ['active', 'inactive', 'hired', 'blacklisted'],
    jobs: ['active', 'closed', 'draft', 'urgent']
  };

  const locationOptions = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Semarang'];
  const skillOptions = ['React', 'Node.js', 'Python', 'Java', 'PHP', 'Vue.js', 'Angular', 'TypeScript'];

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Advanced Filter Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
            showAdvanced || filterCount > 0
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          <span className="font-medium">Filters</span>
          {filterCount > 0 && (
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full font-semibold">
              {filterCount}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Clear Filters */}
        {filterCount > 0 && (
          <button
            onClick={clearFilters}
            className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Clear all filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-2" />
                Status
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {statusOptions[type].map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('status', [...filters.status, status]);
                        } else {
                          updateFilter('status', filters.status.filter(s => s !== status));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('location', [...filters.location, location]);
                        } else {
                          updateFilter('location', filters.location.filter(l => l !== location));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star size={16} className="inline mr-2" />
                Skills
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {skillOptions.map(skill => (
                  <label key={skill} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('skills', [...filters.skills, skill]);
                        } else {
                          updateFilter('skills', filters.skills.filter(s => s !== skill));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start || ''}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end || ''}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {filterCount > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {filters.status.map(status => (
                  <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {status}
                    <button
                      onClick={() => updateFilter('status', filters.status.filter(s => s !== status))}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {filters.location.map(location => (
                  <span key={location} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {location}
                    <button
                      onClick={() => updateFilter('location', filters.location.filter(l => l !== location))}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {filters.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {skill}
                    <button
                      onClick={() => updateFilter('skills', filters.skills.filter(s => s !== skill))}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}