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
  Settings,
  BarChart3,
  FileText,
  Building2,
  Target,
  Award,
  Activity,
  Download,
  Upload,
  Bell,
  Mail,
  Phone,
  Globe,
  Zap,
  Star,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  User
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import JobPostingForm from '../components/JobPostingForm';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  locations: string[];
  status: 'active' | 'closed' | 'draft';
  requirements?: string;
  salary_range?: string;
  employment_type?: string;
  created_at: string;
  updated_at?: string;
}

interface RecruiterDashboardProps {
  onLogout: () => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: jobPostings = [], isLoading: loading } = useQuery({
    queryKey: ['/api/job-postings', statusFilter],
    queryFn: () => apiRequest(`/api/job-postings${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`)
  });

  const createJobMutation = useMutation({
    mutationFn: (jobData: Partial<JobPosting>) => apiRequest('/api/job-postings', {
      method: 'POST',
      body: JSON.stringify(jobData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-postings'] });
      setShowForm(false);
      setEditingJob(null);
    }
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobPosting> }) => 
      apiRequest(`/api/job-postings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-postings'] });
      setShowForm(false);
      setEditingJob(null);
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/job-postings/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-postings'] });
    }
  });

  const handleSubmit = async (data: Partial<JobPosting>) => {
    try {
      if (editingJob) {
        // Update existing job
        await updateJobMutation.mutateAsync({ id: editingJob.id, data });
      } else {
        // Create new job
        await createJobMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) return;

    try {
      await deleteJobMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting job posting:', error);
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
      change: '+12%',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Lowongan Aktif',
      value: jobPostings.filter(job => job.status === 'active').length,
      change: '+8%',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Pelamar',
      value: 156,
      change: '+24%',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Hired Bulan Ini',
      value: 23,
      change: '+15%',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentActivities = [
    { action: 'Lowongan baru ditambahkan', item: 'Sales Officer Chaneling', time: '2 jam lalu', icon: Plus, color: 'text-green-600' },
    { action: 'Pelamar baru mendaftar', item: 'Credit Marketing Officer', time: '4 jam lalu', icon: Users, color: 'text-blue-600' },
    { action: 'Lowongan diperbarui', item: 'Telemarketing Specialist', time: '6 jam lalu', icon: Edit3, color: 'text-orange-600' },
    { action: 'Interview dijadwalkan', item: 'Recovery Officer', time: '1 hari lalu', icon: Calendar, color: 'text-purple-600' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Kelola Lowongan', icon: Briefcase },
    { id: 'applicants', label: 'Pelamar', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin! 👋</h2>
              <p className="text-blue-100 text-lg mb-4">
                Dashboard SWAPRO - Kelola rekrutmen dengan mudah dan efisien
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Activity size={16} />
                  <span>System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Last updated: {new Date().toLocaleTimeString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Building2 size={64} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <stat.icon size={26} className="text-white" />
              </div>
              <span className={`text-sm font-bold ${stat.textColor} bg-gradient-to-r ${stat.color} bg-opacity-10 px-3 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap size={20} className="text-orange-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleAddNew}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="p-1 bg-white/20 rounded-lg">
                  <Plus size={20} />
                </div>
                <span className="font-semibold">Tambah Lowongan Baru</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-200">
                <div className="p-1 bg-green-200 rounded-lg">
                  <Download size={20} />
                </div>
                <span className="font-semibold">Export Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-2xl hover:from-orange-100 hover:to-amber-100 transition-all duration-300 border border-orange-200">
                <div className="p-1 bg-orange-200 rounded-lg">
                  <Upload size={20} />
                </div>
                <span className="font-semibold">Import Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-200">
                <div className="p-1 bg-purple-200 rounded-lg">
                  <Mail size={20} />
                </div>
                <span className="font-semibold">Kirim Notifikasi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Activity size={20} className="text-green-600" />
                </div>
                Aktivitas Terbaru
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                Lihat Semua
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                    <activity.icon size={16} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobsManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelola Lowongan Pekerjaan</h2>
          <p className="text-gray-600">Tambah, edit, dan kelola semua lowongan pekerjaan SWAPRO</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Lowongan
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
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

          <div className="flex items-center gap-2">
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" title="Refresh">
              <RefreshCw size={18} />
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" title="Export">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
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
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {Math.floor(Math.random() * 50) + 10} pelamar
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
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
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                      title="More Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'jobs':
        return renderJobsManagement();
      case 'applicants':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <Users size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manajemen Pelamar</h3>
            <p className="text-gray-600">Fitur ini akan segera tersedia</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
            <p className="text-gray-600">Fitur ini akan segera tersedia</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <Settings size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pengaturan</h3>
            <p className="text-gray-600">Fitur ini akan segera tersedia</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-screen">
        {/* Modern Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-100 transition-all duration-300 relative flex flex-col`}>
          {/* Logo Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 size={28} className="text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SWAPRO
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Admin Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-105'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-102'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
                }`}>
                  <item.icon size={20} />
                </div>
                {!sidebarCollapsed && (
                  <span className="font-semibold text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Admin Profile Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Admin User</p>
                    <p className="text-gray-600 text-xs">admin@swapro.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight size={14} className={`text-gray-600 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Modern Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600 text-sm">
                  {activeTab === 'overview' && 'Dashboard dan statistik sistem rekrutmen SWAPRO'}
                  {activeTab === 'jobs' && 'Kelola dan pantau lowongan pekerjaan dengan mudah'}
                  {activeTab === 'applicants' && 'Data pelamar dan proses rekrutmen terkini'}
                  {activeTab === 'analytics' && 'Analisis performa dan metrik bisnis'}
                  {activeTab === 'settings' && 'Pengaturan sistem dan preferensi admin'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105 relative" title="Notifications">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105" title="Settings">
                  <Settings size={20} />
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <LogOut size={18} />
                  <span className="font-semibold text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area with Better Spacing */}
          <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-transparent to-blue-50/30">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Job Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <JobPostingForm
              jobPosting={editingJob}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingJob(null);
              }}
              isLoading={createJobMutation.isPending || updateJobMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;