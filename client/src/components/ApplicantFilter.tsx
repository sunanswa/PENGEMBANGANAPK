import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Briefcase, MapPin, DollarSign, Users, ChevronDown } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  jobPostings: any[];
}

export interface FilterState {
  search: string;
  status: string[];
  position: string[];
  dateRange: {
    from: string;
    to: string;
  };
  experienceLevel: string[];
  source: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  location: string[];
}

const ApplicantFilter: React.FC<FilterProps> = ({ onFilterChange, jobPostings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    position: [],
    dateRange: { from: '', to: '' },
    experienceLevel: [],
    source: [],
    salaryRange: { min: 0, max: 20000000 },
    location: []
  });

  const statusOptions = [
    { value: 'new', label: 'Baru', color: 'bg-blue-100 text-blue-800' },
    { value: 'review', label: 'Review', color: 'bg-orange-100 text-orange-800' },
    { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
    { value: 'accepted', label: 'Diterima', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-800' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const experienceLevels = [
    { value: 'fresh-graduate', label: 'Fresh Graduate' },
    { value: '1-2-years', label: '1-2 Tahun' },
    { value: '3-5-years', label: '3-5 Tahun' },
    { value: '5-plus-years', label: '5+ Tahun' },
    { value: 'senior', label: 'Senior (10+ Tahun)' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website Karir' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'jobstreet', label: 'JobStreet' },
    { value: 'referral', label: 'Referral' },
    { value: 'walk-in', label: 'Walk-in' },
    { value: 'social-media', label: 'Social Media' }
  ];

  const positions = jobPostings.map(job => job.title).filter((value, index, self) => self.indexOf(value) === index);
  
  const locations = Array.from(
    new Set(jobPostings.flatMap(job => job.locations || []))
  ).sort();

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const toggleArrayFilter = (filterKey: keyof FilterState, value: string) => {
    const currentArray = filters[filterKey] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [filterKey]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      status: [],
      position: [],
      dateRange: { from: '', to: '' },
      experienceLevel: [],
      source: [],
      salaryRange: { min: 0, max: 20000000 },
      location: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.position.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.experienceLevel.length > 0) count++;
    if (filters.source.length > 0) count++;
    if (filters.salaryRange.min > 0 || filters.salaryRange.max < 20000000) count++;
    if (filters.location.length > 0) count++;
    return count;
  };

  const CheckboxGroup = ({ 
    title, 
    options, 
    selected, 
    onChange,
    icon: Icon 
  }: {
    title: string;
    options: { value: string; label: string; color?: string }[];
    selected: string[];
    onChange: (value: string) => void;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <Icon size={16} className="text-gray-600" />
        {title}
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className={`text-sm ${option.color ? `px-2 py-1 rounded-full ${option.color}` : 'text-gray-700'}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Basic Search and Quick Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, posisi, atau skills..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Quick Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.slice(0, 4).map((status) => (
              <button
                key={status.value}
                onClick={() => toggleArrayFilter('status', status.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  filters.status.includes(status.value)
                    ? status.color + ' ring-2 ring-blue-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium text-gray-700"
          >
            <Filter size={16} />
            Filter {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Filter aktif:</span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{filters.search}"
                <X size={14} className="cursor-pointer" onClick={() => updateFilters({ search: '' })} />
              </span>
            )}
            {filters.status.map((status) => (
              <span key={status} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Status: {statusOptions.find(s => s.value === status)?.label}
                <X size={14} className="cursor-pointer" onClick={() => toggleArrayFilter('status', status)} />
              </span>
            ))}
            {filters.position.map((position) => (
              <span key={position} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Posisi: {position}
                <X size={14} className="cursor-pointer" onClick={() => toggleArrayFilter('position', position)} />
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <CheckboxGroup
              title="Status Aplikasi"
              options={statusOptions}
              selected={filters.status}
              onChange={(value) => toggleArrayFilter('status', value)}
              icon={Users}
            />

            {/* Position Filter */}
            <CheckboxGroup
              title="Posisi"
              options={positions.map(pos => ({ value: pos, label: pos }))}
              selected={filters.position}
              onChange={(value) => toggleArrayFilter('position', value)}
              icon={Briefcase}
            />

            {/* Experience Level */}
            <CheckboxGroup
              title="Level Pengalaman"
              options={experienceLevels}
              selected={filters.experienceLevel}
              onChange={(value) => toggleArrayFilter('experienceLevel', value)}
              icon={Briefcase}
            />

            {/* Source */}
            <CheckboxGroup
              title="Sumber Aplikasi"
              options={sourceOptions}
              selected={filters.source}
              onChange={(value) => toggleArrayFilter('source', value)}
              icon={Users}
            />

            {/* Location */}
            <CheckboxGroup
              title="Lokasi"
              options={locations.map(loc => ({ value: loc, label: loc }))}
              selected={filters.location}
              onChange={(value) => toggleArrayFilter('location', value)}
              icon={MapPin}
            />

            {/* Date Range */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-gray-600" />
                Tanggal Aplikasi
              </h4>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => updateFilters({ 
                    dateRange: { ...filters.dateRange, from: e.target.value } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dari tanggal"
                />
                <input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => updateFilters({ 
                    dateRange: { ...filters.dateRange, to: e.target.value } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sampai tanggal"
                />
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign size={16} className="text-gray-600" />
              Range Gaji Ekspektasi
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                <input
                  type="number"
                  value={filters.salaryRange.min}
                  onChange={(e) => updateFilters({ 
                    salaryRange: { ...filters.salaryRange, min: parseInt(e.target.value) || 0 } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rp 0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Maksimum</label>
                <input
                  type="number"
                  value={filters.salaryRange.max}
                  onChange={(e) => updateFilters({ 
                    salaryRange: { ...filters.salaryRange, max: parseInt(e.target.value) || 20000000 } 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rp 20.000.000"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Reset Semua Filter
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantFilter;