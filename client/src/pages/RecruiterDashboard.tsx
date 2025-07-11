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
  RefreshCw
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
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data untuk development
  const mockJobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Sales Officer Chaneling (SOC)',
      description: 'Bertanggung jawab untuk melakukan penjualan produk pembiayaan melalui channel dealer motor. Membangun dan memelihara hubungan baik dengan dealer partner.',
      locations: ['ADIRA TEBET MOTOR', 'ADIRA KELAPA GADING MOTOR', 'ADIRA PONDOK GEDE'],
      status: 'active',
      requirements: 'Minimal S1, pengalaman sales 2 tahun, memiliki SIM C',
      salary_range: 'Rp 5.000.000 - Rp 8.000.000',
      employment_type: 'full-time',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Credit Marketing Officer',
      description: 'Melakukan pemasaran produk kredit kepada calon nasabah, melakukan analisis kredit, dan memastikan target penjualan tercapai.',
      locations: ['SMSF JAKARTA TIMUR', 'SMSF JAKARTA UTARA'],
      status: 'active',
      requirements: 'S1 Ekonomi/Manajemen, pengalaman banking 1 tahun',
      salary_range: 'Rp 6.000.000 - Rp 9.000.000',
      employment_type: 'full-time',
      created_at: '2024-01-14T09:00:00Z',
      updated_at: '2024-01-14T09:00:00Z'
    },
    {
      id: '3',
      title: 'Telemarketing Specialist',
      description: 'Melakukan panggilan telepon untuk menawarkan produk dan layanan perusahaan kepada calon pelanggan.',
      locations: ['Juanda Jakarta Pusat', 'Tangerang City'],
      status: 'draft',
      requirements: 'Minimal SMA, pengalaman telemarketing 1 tahun',
      salary_range: 'Rp 4.000.000 - Rp 6.000.000',
      employment_type: 'full-time',
      created_at: '2024-01-13T08:00:00Z',
      updated_at: '2024-01-13T08:00:00Z'
    },
    {
      id: '4',
      title: 'Recovery Officer',
      description: 'Menangani proses collection dan recovery untuk nasabah yang mengalami tunggakan pembayaran.',
      locations: ['SMSF JAKARTA TIMUR', 'SMSF JAKARTA UTARA'],
      status: 'closed',
      requirements: 'S1, pengalaman collection 2 tahun, komunikasi baik',
      salary_range: 'Rp 5.500.000 - Rp 7.500.000',
      employment_type: 'full-time',
      created_at: '2024-01-12T07:00:00Z',
      updated_at: '2024-01-12T07:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulasi loading data
    setLoading(true);
    setTimeout(() => {
      setJobPostings(mockJobPostings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (data: Partial<JobPosting>) => {
    try {
      setIsSubmitting(true);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (editingJob) {
        // Update existing job
        setJobPostings(prev => prev.map(job => 
          job.id === editingJob.id 
            ? { ...job, ...data, updated_at: new Date().toISOString() }
            : job
        ));
        alert('Lowongan berhasil diperbarui!');
      } else {
        // Create new job
        const newJob: JobPosting = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data
        } as JobPosting;
        
        setJobPostings(prev => [newJob, ...prev]);
        alert('Lowongan baru berhasil ditambahkan!');
      }

      setShowForm(false);
      setEditingJob(null);
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
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setJobPostings(prev => prev.filter(job => job.id !== id));
      alert('Lowongan berhasil dihapus!');
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold ${stat.textColor} bg-white/80 px-2 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
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
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span className="font-semibold">Tambah Lowongan Baru</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                <Download size={20} />
                <span className="font-semibold">Export Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                <Upload size={20} />
                <span className="font-semibold">Import Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                <Mail size={20} />
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
                <Activity size={20} className="text-green-500" />
                Aktivitas Terbaru
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white/90 backdrop-blur-sm border-r border-gray-200 min-h-screen transition-all duration-300 fixed lg:relative z-30`}>
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="/swapro copy.png" 
                alt="SWAPRO Logo" 
                className="h-10 w-10 object-contain"
              />
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">SWAPRO</h1>
                  <p className="text-xs text-gray-600">Admin Dashboard</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && (
                    <span className="font-semibold">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ChevronRight size={16} className={`transform transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin SWAPRO</h1>
                    <p className="text-gray-600">Kelola rekrutmen dan lowongan pekerjaan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <Settings size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderContent()}
          </div>
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