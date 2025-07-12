import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Filter,
  Eye,
  ExternalLink,
  LogOut,
  User,
  Settings,
  Heart,
  Send
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  locations: string[];
  maps_links?: string[];
  positions_needed?: number;
  status: 'active' | 'closed' | 'draft' | 'urgent';
  requirements?: string;
  salary_range?: string;
  employment_type?: string;
  created_at: string;
  updated_at?: string;
}

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ onLogout, userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const { data: jobPostings = [], isLoading: loading } = useQuery({
    queryKey: ['/api/job-postings', { status: 'active' }],
    queryFn: () => apiRequest('/api/job-postings?status=active')
  });

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
                           job.locations.some(loc => loc.toLowerCase().includes(locationFilter.toLowerCase()));
    
    return matchesSearch && matchesLocation;
  });

  const allLocations = Array.from(
    new Set(jobPostings.flatMap(job => job.locations))
  ).sort();

  const handleApply = (job: JobPosting) => {
    // For now, we'll just show an alert. In a real app, this would open an application form
    alert(`Terima kasih! Lamaran Anda untuk posisi "${job.title}" telah berhasil dikirim. Tim HR akan menghubungi Anda dalam 1-3 hari kerja.`);
  };

  const JobCard: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(job.created_at).toLocaleDateString('id-ID')}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {job.locations.length} lokasi
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedJob(job)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          title="Lihat Detail"
        >
          <Eye size={18} />
        </button>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.locations.slice(0, 2).map((location, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            {location}
          </span>
        ))}
        {job.locations.length > 2 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            +{job.locations.length - 2} lainnya
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {job.employment_type && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {job.employment_type}
            </div>
          )}
          {job.positions_needed && job.positions_needed > 1 && (
            <div className="flex items-center gap-1 text-blue-600 font-semibold">
              <Users size={14} />
              Butuh {job.positions_needed} orang
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <DollarSign size={14} />
              {job.salary_range}
            </div>
          )}
        </div>
        <button
          onClick={() => handleApply(job)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
        >
          <Send size={16} />
          Lamar
        </button>
      </div>
    </div>
  );

  const JobDetailModal: React.FC<{ job: JobPosting; onClose: () => void }> = ({ job, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              Diposting {new Date(job.created_at).toLocaleDateString('id-ID')}
            </div>
            <div className="flex items-center gap-1">
              <Building2 size={14} />
              SWAPRO
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Pekerjaan</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Persyaratan</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Lokasi Penempatan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {job.locations.map((location, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="text-blue-800 font-semibold">{location}</span>
                  </div>
                  {job.maps_links && job.maps_links[index] && (
                    <a
                      href={job.maps_links[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      📍 Lihat di Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.employment_type && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">Tipe Pekerjaan</span>
                </div>
                <p className="text-gray-700">{job.employment_type}</p>
              </div>
            )}
            {job.salary_range && (
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-900">Range Gaji</span>
                </div>
                <p className="text-green-700 font-semibold">{job.salary_range}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => handleApply(job)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Lamar Posisi Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/swapro copy.png" 
                alt="SWAPRO Logo" 
                className="h-12"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal Karir SWAPRO</h1>
                <p className="text-gray-600">Selamat datang, {userProfile?.full_name || userProfile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Temukan Karir Impian Anda</h2>
              <p className="text-blue-100 text-lg">
                Jelajahi {jobPostings.length} lowongan pekerjaan terbaru di SWAPRO
              </p>
            </div>
            <div className="hidden lg:block">
              <Briefcase size={64} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari posisi, deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all appearance-none bg-white min-w-[200px]"
              >
                <option value="">Semua Lokasi</option>
                {allLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat lowongan pekerjaan...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || locationFilter ? 'Tidak ada lowongan yang sesuai' : 'Belum ada lowongan tersedia'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || locationFilter 
                  ? 'Coba ubah kata kunci pencarian atau filter lokasi'
                  : 'Lowongan baru akan segera ditambahkan'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

export default ApplicantDashboard;