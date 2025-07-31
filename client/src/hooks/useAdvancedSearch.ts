import { useState, useMemo } from 'react';
import { SyncedApplication, SyncedCandidate, SyncedJobPosting } from '@shared/types';

export interface SearchFilters {
  query: string;
  status: string[];
  location: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  salaryRange: {
    min?: number;
    max?: number;
  };
  skills: string[];
  experience: string[];
}

export function useAdvancedSearch<T extends SyncedApplication | SyncedCandidate | SyncedJobPosting>(
  data: T[],
  type: 'applications' | 'candidates' | 'jobs'
) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    location: [],
    dateRange: {},
    salaryRange: {},
    skills: [],
    experience: []
  });

  const [sortBy, setSortBy] = useState<string>('lastUpdate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      // Text search across multiple fields
      if (filters.query) {
        const searchableText = JSON.stringify(item).toLowerCase();
        const queryTerms = filters.query.toLowerCase().split(' ');
        const matchesQuery = queryTerms.every(term => searchableText.includes(term));
        if (!matchesQuery) return false;
      }

      // Status filter
      if (filters.status.length > 0) {
        if ('status' in item && !filters.status.includes(item.status)) return false;
      }

      // Location filter
      if (filters.location.length > 0) {
        if ('location' in item) {
          const itemLocation = typeof item.location === 'string' ? item.location : '';
          const matchesLocation = filters.location.some(loc => 
            itemLocation.toLowerCase().includes(loc.toLowerCase())
          );
          if (!matchesLocation) return false;
        }
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const itemDate = getItemDate(item);
        if (itemDate) {
          if (filters.dateRange.start && itemDate < new Date(filters.dateRange.start)) return false;
          if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end)) return false;
        }
      }

      // Skills filter
      if (filters.skills.length > 0 && 'skills' in item) {
        const itemSkills = Array.isArray(item.skills) ? item.skills : [];
        const matchesSkills = filters.skills.some(skill => 
          itemSkills.some(itemSkill => 
            itemSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!matchesSkills) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = getSortValue(a, sortBy);
      let bValue = getSortValue(b, sortBy);

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, filters, sortBy, sortOrder]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K, 
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      status: [],
      location: [],
      dateRange: {},
      salaryRange: {},
      skills: [],
      experience: []
    });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.status.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.skills.length > 0) count++;
    if (filters.experience.length > 0) count++;
    return count;
  };

  return {
    filters,
    filteredData: filteredAndSortedData,
    updateFilter,
    clearFilters,
    getFilterCount,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    totalResults: filteredAndSortedData.length,
    totalItems: data.length
  };
}

function getItemDate(item: any): Date | null {
  if ('appliedDate' in item) return new Date(item.appliedDate);
  if ('lastActive' in item) return new Date(item.lastActive);
  if ('postedDate' in item) return new Date(item.postedDate);
  if ('lastUpdate' in item) return new Date(item.lastUpdate);
  return null;
}

function getSortValue(item: any, sortBy: string): any {
  const keys = sortBy.split('.');
  let value = item;
  for (const key of keys) {
    value = value?.[key];
  }
  return value ?? '';
}