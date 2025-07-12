import React, { useState, useEffect } from 'react';
import CommunicationHub from '../components/CommunicationHub';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import MessageComposer from '../components/MessageComposer';
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
  User,
  Brain,
  Video,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import JobPostingForm from '../components/JobPostingForm';
import InterviewScheduler from '../components/InterviewScheduler';
import ScreeningAssessment from '../components/ScreeningAssessment';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  locations: string[];
  maps_links?: string[];
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
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [showScreeningAssessment, setShowScreeningAssessment] = useState(false);
  const [showCommunicationHub, setShowCommunicationHub] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

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

  // Data pelamar harian
  const dailyApplicants = [
    {
      id: 1,
      name: 'Sarah Wijayanti',
      email: 'sarah.wijayanti@email.com',
      phone: '+62812-3456-7890',
      position: 'Sales Officer Chaneling',
      appliedAt: '10:30 WIB',
      status: 'new',
      experience: '3 tahun',
      education: 'S1 Manajemen',
      location: 'Jakarta Selatan'
    },
    {
      id: 2,
      name: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@email.com',
      phone: '+62813-4567-8901',
      position: 'Credit Marketing Officer',
      appliedAt: '11:45 WIB',
      status: 'new',
      experience: '2 tahun',
      education: 'S1 Ekonomi',
      location: 'Jakarta Pusat'
    },
    {
      id: 3,
      name: 'Indira Sari Dewi',
      email: 'indira.sari@email.com',
      phone: '+62814-5678-9012',
      position: 'Telemarketing Specialist',
      appliedAt: '14:20 WIB',
      status: 'new',
      experience: '1 tahun',
      education: 'D3 Komunikasi',
      location: 'Tangerang'
    },
    {
      id: 4,
      name: 'Bayu Setiawan',
      email: 'bayu.setiawan@email.com',
      phone: '+62815-6789-0123',
      position: 'Recovery Officer',
      appliedAt: '15:55 WIB',
      status: 'new',
      experience: '4 tahun',
      education: 'S1 Hukum',
      location: 'Bekasi'
    }
  ];

  const stats = [
    {
      title: 'Pelamar Hari Ini',
      value: dailyApplicants.length,
      change: '+67%',
      icon: UserPlus,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
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
    { id: 'interviews', label: 'Interview', icon: Video },
    { id: 'screening', label: 'Screening', icon: Brain },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'analytics', label: 'Advanced Analytics', icon: Activity },
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

        {/* Pelamar Hari Ini */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Users size={20} className="text-blue-600" />
                </div>
                Pelamar Hari Ini
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                  {dailyApplicants.length}
                </span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                Lihat Semua
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {dailyApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold">
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{applicant.name}</p>
                      <span className="text-xs text-gray-500 font-medium">{applicant.appliedAt}</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-1">{applicant.position}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📧 {applicant.email}</span>
                      <span>📱 {applicant.phone}</span>
                      <span>🎓 {applicant.education}</span>
                      <span>💼 {applicant.experience}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">📍 {applicant.location}</span>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Baru
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold">
                          Review →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Activity size={20} className="text-green-600" />
                </div>
                Aktivitas Terbaru
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                    <activity.icon size={14} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.item}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
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

  const renderApplicantsManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Pelamar</h2>
          <p className="text-gray-600">Kelola dan pantau semua pelamar untuk lowongan pekerjaan</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Download size={18} />
            Export Data
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Mail size={18} />
            Kirim Email
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+15%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Pelamar</p>
          <p className="text-2xl font-bold text-gray-900">324</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Diterima</p>
          <p className="text-2xl font-bold text-gray-900">45</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Proses Review</p>
          <p className="text-2xl font-bold text-gray-900">89</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+22%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Interview Dijadwalkan</p>
          <p className="text-2xl font-bold text-gray-900">23</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Users size={20} className="text-blue-600" />
          </div>
          Pelamar Terbaru
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Sarah Wijaya', position: 'Sales Officer Chaneling', time: '2 jam lalu', status: 'new', email: 'sarah.wijaya@email.com' },
            { name: 'Ahmad Rizki', position: 'Credit Marketing Officer', time: '4 jam lalu', status: 'review', email: 'ahmad.rizki@email.com' },
            { name: 'Maya Sari', position: 'Telemarketing Specialist', time: '6 jam lalu', status: 'interview', email: 'maya.sari@email.com' },
            { name: 'Budi Santoso', position: 'Recovery Officer', time: '1 hari lalu', status: 'accepted', email: 'budi.santoso@email.com' }
          ].map((applicant, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{applicant.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{applicant.name}</p>
                  <p className="text-sm text-gray-600">{applicant.position}</p>
                  <p className="text-xs text-gray-500">{applicant.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  applicant.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  applicant.status === 'review' ? 'bg-orange-100 text-orange-800' :
                  applicant.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {applicant.status === 'new' ? 'Baru' :
                   applicant.status === 'review' ? 'Review' :
                   applicant.status === 'interview' ? 'Interview' :
                   'Diterima'}
                </span>
                <span className="text-sm text-gray-500">{applicant.time}</span>
                {/* Action buttons for Interview Management */}
                <div className="flex items-center gap-2">
                  {applicant.status === 'new' && (
                    <button 
                      onClick={() => {
                        setSelectedCandidate(applicant);
                        setShowScreeningAssessment(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                      title="Start Screening"
                    >
                      <Brain size={16} />
                    </button>
                  )}
                  {(applicant.status === 'review' || applicant.status === 'new') && (
                    <button 
                      onClick={() => {
                        setSelectedCandidate(applicant);
                        setShowInterviewScheduler(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                      title="Schedule Interview"
                    >
                      <Calendar size={16} />
                    </button>
                  )}
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h2>
          <p className="text-gray-600">Analisis performa rekrutmen dan metrik bisnis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedAnalytics(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center gap-2"
          >
            <Activity size={18} />
            Advanced Analytics
          </button>
          <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>30 Hari Terakhir</option>
            <option>3 Bulan Terakhir</option>
            <option>6 Bulan Terakhir</option>
            <option>1 Tahun Terakhir</option>
          </select>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">↑ 25%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tingkat Conversion</p>
          <p className="text-2xl font-bold text-gray-900">18.5%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">↓ 8%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Waktu Hire Rata-rata</p>
          <p className="text-2xl font-bold text-gray-900">12 Hari</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-white" />
            </div>
            <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">↑ 12%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Kualitas Hire</p>
          <p className="text-2xl font-bold text-gray-900">4.2/5</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Trend Aplikasi Bulanan</h3>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chart akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Distribusi Status Pelamar</h3>
          <div className="h-64 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Target size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Pie chart akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Star size={20} className="text-orange-600" />
          </div>
          Top Performing Jobs
        </h3>
        <div className="space-y-4">
          {[
            { position: 'Sales Officer Chaneling', applications: 89, hired: 12, rate: '13.5%' },
            { position: 'Credit Marketing Officer', applications: 67, hired: 8, rate: '11.9%' },
            { position: 'Telemarketing Specialist', applications: 54, hired: 6, rate: '11.1%' },
            { position: 'Recovery Officer', applications: 43, hired: 4, rate: '9.3%' }
          ].map((job, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-900">{job.position}</p>
                <p className="text-sm text-gray-600">{job.applications} aplikasi • {job.hired} diterima</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{job.rate}</p>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan System</h2>
          <p className="text-gray-600">Kelola preferensi dan konfigurasi sistem</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
          <Download size={18} />
          Backup Data
        </button>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Settings size={20} className="text-blue-600" />
            </div>
            Pengaturan Umum
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-600">Terima notifikasi untuk pelamar baru</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-900">Auto-Backup</p>
                <p className="text-sm text-gray-600">Backup data otomatis setiap hari</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Tema gelap untuk dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users size={20} className="text-purple-600" />
            </div>
            Manajemen User
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Admin User</p>
                  <p className="text-sm text-gray-600">admin@swapro.com</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
            </div>
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} />
              Tambah User Baru
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-xl">
              <Activity size={20} className="text-green-600" />
            </div>
            System Info
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Version</span>
              <span className="font-semibold text-gray-900">v2.1.0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Database</span>
              <span className="font-semibold text-green-600">Connected</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-semibold text-gray-900">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold text-gray-900">99.9%</span>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Mail size={20} className="text-orange-600" />
            </div>
            Email Templates
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Welcome Email</span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Interview Invitation</span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Rejection Letter</span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Job Offer</span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterviewsManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Management</h2>
          <p className="text-gray-600">Kelola jadwal interview dan evaluasi kandidat</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Calendar size={20} />
            Jadwal Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Interview Terjadwal</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              candidateName: 'Maya Sari',
              position: 'Telemarketing Specialist',
              interviewer: 'Bu Sari',
              date: 'Besok, 10:00 WIB',
              type: 'Video Call',
              status: 'scheduled',
              link: 'https://meet.google.com/abc-defg-hij'
            },
            {
              candidateName: 'Ahmad Rizki',
              position: 'Credit Marketing Officer',
              interviewer: 'Pak Sutrisno',
              date: 'Hari ini, 14:30 WIB',
              type: 'Phone',
              status: 'scheduled'
            },
            {
              candidateName: 'Budi Santoso',
              position: 'Recovery Officer',
              interviewer: 'Pak Joko',
              date: '3 hari lalu',
              type: 'In Person',
              status: 'completed',
              score: 85
            }
          ].map((interview, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{interview.candidateName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <p className="text-xs text-gray-500">Interviewer: {interview.interviewer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{interview.date}</p>
                    <p className="text-xs text-gray-600">{interview.type}</p>
                    {interview.score && (
                      <p className="text-xs text-green-600 font-semibold">Score: {interview.score}/100</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {interview.status === 'scheduled' ? 'Terjadwal' :
                     interview.status === 'completed' ? 'Selesai' : 'Pending'}
                  </span>
                  <div className="flex items-center gap-2">
                    {interview.link && interview.status === 'scheduled' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                        <Video size={16} />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScreeningManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Automated Screening</h2>
          <p className="text-gray-600">Monitor dan kelola proses screening kandidat</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Brain size={20} />
            Mulai Screening
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Screening</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Passed</h3>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Avg Score</h3>
              <p className="text-2xl font-bold text-purple-600">82/100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Hasil Screening</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              candidateName: 'Ahmad Rizki',
              position: 'Credit Marketing Officer',
              type: 'Skills Assessment',
              score: 85,
              status: 'passed',
              completedAt: '1 hari lalu',
              analysis: 'Kandidat menunjukkan pemahaman yang baik tentang digital marketing'
            },
            {
              candidateName: 'Sarah Wijaya',
              position: 'Sales Officer Chaneling',
              type: 'Personality Test',
              score: 78,
              status: 'passed',
              completedAt: '2 hari lalu',
              analysis: 'Mindset positif dan customer-centric'
            },
            {
              candidateName: 'Maya Sari',
              position: 'Telemarketing Specialist',
              type: 'Cognitive Test',
              score: 72,
              status: 'review',
              completedAt: '3 hari lalu',
              analysis: 'Perlu evaluasi lebih lanjut pada beberapa aspek'
            }
          ].map((screening, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{screening.candidateName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{screening.candidateName}</h4>
                    <p className="text-sm text-gray-600">{screening.position}</p>
                    <p className="text-xs text-gray-500">{screening.type}</p>
                    <p className="text-xs text-gray-600 mt-1">{screening.analysis}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{screening.score}/100</p>
                    <p className="text-xs text-gray-500">{screening.completedAt}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    screening.status === 'passed' ? 'bg-green-100 text-green-800' :
                    screening.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {screening.status === 'passed' ? 'Lulus' :
                     screening.status === 'failed' ? 'Tidak Lulus' : 'Review'}
                  </span>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Communication Hub</h2>
          <p className="text-gray-600">Kelola komunikasi dengan kandidat melalui email, SMS, dan WhatsApp</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCommunicationHub(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Mail size={20} />
            Buka Communication Hub
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => {
            setMessageType('email');
            setShowMessageComposer(true);
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Blast</h3>
              <p className="text-sm text-gray-600">Kirim email ke kandidat</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">247 terkirim bulan ini</span>
            <span className="text-blue-600 font-semibold">98% delivery rate</span>
          </div>
        </div>

        <div 
          onClick={() => {
            setMessageType('sms');
            setShowMessageComposer(true);
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Phone size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">SMS Notification</h3>
              <p className="text-sm text-gray-600">Kirim SMS ke kandidat</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">156 terkirim bulan ini</span>
            <span className="text-green-600 font-semibold">95% delivery rate</span>
          </div>
        </div>

        <div 
          onClick={() => {
            setMessageType('whatsapp');
            setShowMessageComposer(true);
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-purple-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">WhatsApp Chat</h3>
              <p className="text-sm text-gray-600">Chat WhatsApp kandidat</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">89 terkirim bulan ini</span>
            <span className="text-purple-600 font-semibold">92% read rate</span>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Pesan Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              type: 'email',
              recipient: 'sarah.wijaya@email.com',
              subject: 'Interview Invitation - Sales Officer',
              status: 'sent',
              sentAt: '10 menit lalu'
            },
            {
              type: 'sms',
              recipient: '+62812345678',
              message: 'Reminder: Interview Anda besok jam 10:00 WIB',
              status: 'delivered',
              sentAt: '2 jam lalu'
            },
            {
              type: 'whatsapp',
              recipient: '+62812345679',
              message: 'Selamat! Aplikasi Anda untuk posisi Credit Marketing diterima',
              status: 'read',
              sentAt: '1 hari lalu'
            }
          ].map((message, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.type === 'email' ? 'bg-blue-100' :
                    message.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {message.type === 'email' ? <Mail size={20} className="text-blue-600" /> :
                     message.type === 'sms' ? <Phone size={20} className="text-green-600" /> :
                     <MessageCircle size={20} className="text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{message.subject || message.message}</h4>
                    <p className="text-sm text-gray-600">{message.recipient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    message.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {message.status === 'sent' ? 'Terkirim' :
                     message.status === 'delivered' ? 'Diterima' : 'Dibaca'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{message.sentAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        return renderApplicantsManagement();
      case 'interviews':
        return renderInterviewsManagement();
      case 'screening':
        return renderScreeningManagement();
      case 'communication':
        return renderCommunication();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
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
                  {activeTab === 'interviews' && 'Kelola jadwal dan proses interview kandidat'}
                  {activeTab === 'screening' && 'Assessment dan screening otomatis kandidat'}
                  {activeTab === 'communication' && 'Hub komunikasi email, SMS, dan WhatsApp'}
                  {activeTab === 'analytics' && 'Analisis mendalam dengan AI dan prediksi sukses kandidat'}
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

      {/* Interview Scheduler Modal */}
      {showInterviewScheduler && selectedCandidate && (
        <InterviewScheduler
          candidateName={selectedCandidate.name}
          candidateEmail={selectedCandidate.email}
          jobTitle={selectedCandidate.position}
          onSchedule={(interviewData) => {
            console.log('Interview scheduled:', interviewData);
            setShowInterviewScheduler(false);
            setSelectedCandidate(null);
            // Here you would typically save to the backend
          }}
          onCancel={() => {
            setShowInterviewScheduler(false);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* Screening Assessment Modal */}
      {showScreeningAssessment && selectedCandidate && (
        <ScreeningAssessment
          candidateName={selectedCandidate.name}
          jobTitle={selectedCandidate.position}
          onComplete={(assessmentData) => {
            console.log('Assessment completed:', assessmentData);
            setShowScreeningAssessment(false);
            setSelectedCandidate(null);
            // Here you would typically save to the backend
          }}
          onCancel={() => {
            setShowScreeningAssessment(false);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* Communication Hub Modal */}
      {showCommunicationHub && (
        <CommunicationHub
          onClose={() => setShowCommunicationHub(false)}
        />
      )}

      {/* Advanced Analytics Modal */}
      {showAdvancedAnalytics && (
        <AdvancedAnalytics onClose={() => setShowAdvancedAnalytics(false)} />
      )}

      {/* Message Composer Modal */}
      {showMessageComposer && (
        <MessageComposer
          type={messageType}
          onClose={() => setShowMessageComposer(false)}
          onSend={(data) => {
            console.log('Message sent:', data);
            setShowMessageComposer(false);
            // Here you would typically send to the backend
          }}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;