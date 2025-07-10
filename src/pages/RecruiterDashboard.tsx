import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Settings
} from 'lucide-react';
import { supabase, JobPosting } from '../lib/supabase';
import JobPostingForm from '../components/JobPostingForm';

interface RecruiterDashboardProps {
  onLogout: () => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onLogout }) => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      alert('Gagal memuat data lowongan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<JobPosting>) => {
    try {
      setIsSubmitting(true);
      
      if (editingJob) {
        // Update existing job
        const { error } = await supabase
          .from('job_postings')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingJob.id);

        if (error) throw error;
        alert('Lowongan berhasil diperbarui!');
      } else {
        // Create new job
        const { error } = await supabase
          .from('job_postings')
          .insert([data]);

        if (error) throw error;
        alert('Lowongan baru berhasil ditambahkan!');
      }

      setShowForm(false);
      setEditingJob(null);
      fetchJobPostings();
    } catch (error) {
      console.error('Error saving job posting:', error);
      alert('Gagal menyimpan lowongan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      alert('Lowongan berhasil dihapus!');
      fetchJobPostings();
    } catch (error) {
      console.error('Error deleting job posting:', error);
      alert('Gagal menghapus lowongan. Silakan coba lagi.');
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Aktif
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Draft
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <AlertCircle size={12} />
            Ditutup
          </span>
        );
      default:
        return null;
    }
  };

  const stats = [
    {
      title: 'Total Lowongan',
      value: jobPostings.length,
      icon: Briefcase,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Lowongan Aktif',
      value: jobPostings.filter(job => job.status === 'active').length,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Draft',
      value: jobPostings.filter(job => job.status === 'draft').length,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Ditutup',
      value: jobPostings.filter(job => job.status === 'closed').length,
      icon: AlertCircle,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50'
    }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Recruiter</h1>
                <p className="text-gray-600">Kelola lowongan pekerjaan SWAPRO</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-3xl p-6 border border-white/20 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari lowongan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Ditutup</option>
                </select>
              </div>
            </div>

            {/* Add New Button */}
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah Lowongan
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data lowongan...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Tidak ada lowongan yang sesuai' : 'Belum ada lowongan'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Coba ubah kata kunci pencarian atau filter status'
                  : 'Mulai dengan menambahkan lowongan pekerjaan pertama Anda'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  <Plus size={20} />
                  Tambah Lowongan Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
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
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.locations.slice(0, 3).map((location, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {location}
                          </span>
                        ))}
                        {job.locations.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            +{job.locations.length - 3} lainnya
                          </span>
                        )}
                      </div>

                      {job.salary_range && (
                        <p className="text-sm text-green-600 font-semibold">{job.salary_range}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Posting Form Modal */}
      {showForm && (
        <JobPostingForm
          jobPosting={editingJob}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;