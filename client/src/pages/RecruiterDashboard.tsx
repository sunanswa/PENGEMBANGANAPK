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
import ApplicantProfileModal from '../components/ApplicantProfileModal';
import ApplicantFilter, { FilterState } from '../components/ApplicantFilter';
import BulkActions from '../components/BulkActions';

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
  
  // New state for enhanced applicant management
  const [showApplicantProfile, setShowApplicantProfile] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [applicantFilters, setApplicantFilters] = useState<FilterState>({
    search: '',
    status: [],
    position: [],
    dateRange: { from: '', to: '' },
    experienceLevel: [],
    source: [],
    salaryRange: { min: 0, max: 20000000 },
    location: []
  });
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  // Enhanced applicant management handlers
  const handleApplicantSelect = (applicantId: string) => {
    setSelectedApplicants(prev => 
      prev.includes(applicantId) 
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleSelectAll = (applicants: any[]) => {
    const allIds = applicants.map(a => a.id.toString());
    setSelectedApplicants(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const handleBulkAction = (action: string, data?: any) => {
    switch (action) {
      case 'bulk-email':
        console.log('Sending bulk email:', data);
        // Implement bulk email functionality
        alert(`Email akan dikirim ke ${data.applicantIds.length} pelamar`);
        setSelectedApplicants([]);
        break;
      case 'bulk-status-update':
        console.log('Updating bulk status:', data);
        // Implement bulk status update
        alert(`Status ${data.applicantIds.length} pelamar diupdate ke: ${data.status}`);
        setSelectedApplicants([]);
        break;
      case 'bulk-export':
        console.log('Exporting applicant data');
        // Implement export functionality
        alert(`Mengexport data ${selectedApplicants.length} pelamar`);
        setSelectedApplicants([]);
        break;
      case 'bulk-schedule-interview':
        console.log('Bulk scheduling interviews');
        alert(`Menjadwalkan interview untuk ${selectedApplicants.length} pelamar`);
        setSelectedApplicants([]);
        break;
    }
  };

  const handleApplicantProfileView = (applicant: any) => {
    setSelectedApplicant(applicant);
    setShowApplicantProfile(true);
  };

  const handleUpdateApplicantStatus = async (status: string, notes?: string, slikData?: any) => {
    try {
      if (!selectedApplicant) return;
      
      console.log('Updating applicant status to:', status);
      console.log('Notes:', notes);
      console.log('SLIK Data:', slikData);
      
      // Create status update record
      const statusUpdateResponse = await fetch(`/api/candidates/${selectedApplicant.id}/status-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
          old_status: selectedApplicant.status,
          updated_by: 'Admin' // In real app, get from current user context
        }),
      });

      if (!statusUpdateResponse.ok) {
        throw new Error('Failed to update candidate status');
      }

      // If SLIK data is provided, create SLIK check record
      if (slikData) {
        const slikCheckResponse = await fetch(`/api/candidates/${selectedApplicant.id}/slik-check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            check_type: 'manual',
            status: slikData.status,
            score: slikData.score,
            risk_level: slikData.riskLevel,
            findings: slikData.findings,
            details: slikData.details,
            checked_by: 'Admin', // In real app, get from current user context
            notes: slikData.notes || `SLIK check untuk status update ke ${status}`
          }),
        });

        if (!slikCheckResponse.ok) {
          console.error('Failed to create SLIK check record');
        }
      }

      let message = `Status pelamar berhasil diupdate ke: ${status}`;
      if (notes) {
        message += `\nKeterangan: ${notes}`;
      }
      if (slikData) {
        message += `\nSLIK Check - Status: ${slikData.status}, Skor: ${slikData.score}, Risk Level: ${slikData.riskLevel}`;
      }
      
      alert(message);
      
      // Close profile modal and refresh data if needed
      setShowApplicantProfile(false);
      setSelectedApplicant(null);

    } catch (error) {
      console.error('Error updating applicant status:', error);
      alert('Terjadi kesalahan saat mengupdate status pelamar');
    }
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
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
            <AlertCircle size={12} />
            🚨 URGENT
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
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
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
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-purple-600/95"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Building2 size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-1">Selamat Datang, Admin! 👋</h2>
                  <p className="text-blue-100 text-lg">
                    Dashboard SWAPRO - Kelola rekrutmen dengan mudah dan efisien
                  </p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center">
                      <Activity size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-green-200 text-sm font-medium">System Status</p>
                      <p className="text-white font-semibold">Online & Ready</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm font-medium">Last Update</p>
                      <p className="text-white font-semibold">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleAddNew}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Tambah Lowongan
                </button>
                <button 
                  onClick={() => setShowAdvancedAnalytics(true)}
                  className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <BarChart3 size={20} />
                  Lihat Analytics
                </button>
              </div>
            </div>
            
            <div className="hidden xl:block">
              <div className="w-40 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <div className="w-28 h-28 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                  <Building2 size={64} className="text-white/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Clean Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className={`text-xs font-semibold ${stat.textColor} bg-gradient-to-r ${stat.color} bg-opacity-10 px-2 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleAddNew}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                <Plus size={18} />
                <span className="font-medium text-sm">Tambah Lowongan</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-300">
                <Download size={18} />
                <span className="font-medium text-sm">Export Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-all duration-300">
                <Upload size={18} />
                <span className="font-medium text-sm">Import Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pelamar Hari Ini */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                Pelamar Hari Ini
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {dailyApplicants.length}
                </span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                Lihat Semua
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyApplicants.slice(0, 4).map((applicant) => (
                <div key={applicant.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{applicant.name}</p>
                      <span className="text-xs text-gray-500">{applicant.appliedAt}</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-2">{applicant.position}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">📍 {applicant.location}</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        Baru
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {dailyApplicants.length > 4 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  +{dailyApplicants.length - 4} pelamar lainnya
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Recent Activity Section */}
      <div className="mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-green-600" />
              Aktivitas Terbaru
            </h3>
            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                  <activity.icon size={14} className={activity.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{activity.action}</p>
                  <p className="text-xs text-gray-600 truncate">{activity.item}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobsManagement = () => (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Kelola Lowongan Pekerjaan</h2>
          <p className="text-gray-600">Tambah, edit, dan kelola semua lowongan pekerjaan SWAPRO</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Lowongan
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lowongan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all appearance-none bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="urgent">🚨 Urgent</option>
                <option value="draft">Draft</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Export">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
          <div className="divide-y divide-gray-100">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
                          {job.positions_needed && (
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              Butuh {job.positions_needed} orang
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {job.locations.slice(0, 2).map((location, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                            {location}
                          </span>
                        ))}
                        {job.locations.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            +{job.locations.length - 2}
                          </span>
                        )}
                      </div>

                      {job.salary_range && (
                        <p className="text-sm text-green-600 font-semibold">{job.salary_range}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
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

  const renderApplicantsManagement = () => {
    // Mock applicant data with enhanced filtering
    const mockApplicants = [
      { 
        id: 1, 
        name: 'Sarah Wijaya', 
        position: 'Sales Officer Chaneling', 
        time: '2 jam lalu', 
        status: 'new', 
        email: 'sarah.wijaya@email.com',
        appliedDate: '2025-01-10',
        source: 'website',
        experienceLevel: '3-5-years',
        location: 'Jakarta Selatan',
        expectedSalary: 7000000
      },
      { 
        id: 2, 
        name: 'Ahmad Rizki', 
        position: 'Credit Marketing Officer', 
        time: '4 jam lalu', 
        status: 'review', 
        email: 'ahmad.rizki@email.com',
        appliedDate: '2025-01-09',
        source: 'linkedin',
        experienceLevel: '1-2-years',
        location: 'Jakarta Pusat',
        expectedSalary: 5500000
      },
      { 
        id: 3, 
        name: 'Maya Sari', 
        position: 'Telemarketing Specialist', 
        time: '6 jam lalu', 
        status: 'interview', 
        email: 'maya.sari@email.com',
        appliedDate: '2025-01-08',
        source: 'referral',
        experienceLevel: 'fresh-graduate',
        location: 'Tangerang',
        expectedSalary: 4500000
      },
      { 
        id: 4, 
        name: 'Budi Santoso', 
        position: 'Recovery Officer', 
        time: '1 hari lalu', 
        status: 'accepted', 
        email: 'budi.santoso@email.com',
        appliedDate: '2025-01-07',
        source: 'jobstreet',
        experienceLevel: '5-plus-years',
        location: 'Bekasi',
        expectedSalary: 8500000
      },
      { 
        id: 5, 
        name: 'Lisa Anggraini', 
        position: 'Sales Officer Chaneling', 
        time: '1 hari lalu', 
        status: 'rejected', 
        email: 'lisa.anggraini@email.com',
        appliedDate: '2025-01-06',
        source: 'social-media',
        experienceLevel: '1-2-years',
        location: 'Jakarta Barat',
        expectedSalary: 6000000
      }
    ];

    // Filter applicants based on current filters
    const filteredApplicants = mockApplicants.filter(applicant => {
      const searchMatch = !applicantFilters.search || 
        applicant.name.toLowerCase().includes(applicantFilters.search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(applicantFilters.search.toLowerCase()) ||
        applicant.position.toLowerCase().includes(applicantFilters.search.toLowerCase());
      
      const statusMatch = applicantFilters.status.length === 0 || 
        applicantFilters.status.includes(applicant.status);
      
      const positionMatch = applicantFilters.position.length === 0 || 
        applicantFilters.position.includes(applicant.position);
      
      const experienceMatch = applicantFilters.experienceLevel.length === 0 || 
        applicantFilters.experienceLevel.includes(applicant.experienceLevel);
      
      const sourceMatch = applicantFilters.source.length === 0 || 
        applicantFilters.source.includes(applicant.source);
      
      const locationMatch = applicantFilters.location.length === 0 || 
        applicantFilters.location.includes(applicant.location);
      
      const salaryMatch = applicant.expectedSalary >= applicantFilters.salaryRange.min && 
        applicant.expectedSalary <= applicantFilters.salaryRange.max;
      
      const dateMatch = (!applicantFilters.dateRange.from || applicant.appliedDate >= applicantFilters.dateRange.from) &&
        (!applicantFilters.dateRange.to || applicant.appliedDate <= applicantFilters.dateRange.to);
      
      return searchMatch && statusMatch && positionMatch && experienceMatch && 
             sourceMatch && locationMatch && salaryMatch && dateMatch;
    });

    return (
      <div className="space-y-6">
        {/* Clean Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Pelamar</h2>
            <p className="text-gray-600">Kelola dan pantau semua pelamar untuk lowongan pekerjaan</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkAction('bulk-export')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button 
              onClick={() => setShowMessageComposer(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2">
              <Mail size={16} />
              Email
            </button>
          </div>
        </div>

        {/* Advanced Filter Component */}
        <ApplicantFilter
          onFilterChange={setApplicantFilters}
          jobPostings={jobPostings}
        />

        {/* Bulk Actions Component */}
        {selectedApplicants.length > 0 && (
          <BulkActions
            selectedApplicants={selectedApplicants}
            totalSelected={selectedApplicants.length}
            onAction={handleBulkAction}
            onClearSelection={() => setSelectedApplicants([])}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+15%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Pelamar</p>
            <p className="text-xl font-bold text-gray-900">{filteredApplicants.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Diterima</p>
            <p className="text-xl font-bold text-gray-900">{filteredApplicants.filter(a => a.status === 'accepted').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Proses Review</p>
            <p className="text-xl font-bold text-gray-900">{filteredApplicants.filter(a => a.status === 'review').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+22%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Interview Dijadwalkan</p>
            <p className="text-xl font-bold text-gray-900">{filteredApplicants.filter(a => a.status === 'interview').length}</p>
          </div>
        </div>

        {/* Clean Applicant List */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Daftar Pelamar ({filteredApplicants.length})
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0}
                onChange={() => handleSelectAll(filteredApplicants)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-600">Pilih Semua</label>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(applicant.id.toString())}
                    onChange={() => handleApplicantSelect(applicant.id.toString())}
                    className="rounded border-gray-300"
                  />
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{applicant.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{applicant.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        applicant.status === 'new' ? 'bg-green-100 text-green-800' :
                        applicant.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        applicant.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                        applicant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {applicant.status === 'new' ? 'Baru' :
                         applicant.status === 'review' ? 'Review' :
                         applicant.status === 'interview' ? 'Interview' :
                         applicant.status === 'accepted' ? 'Diterima' :
                         'Ditolak'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{applicant.position}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📧 {applicant.email}</span>
                      <span>📍 {applicant.location}</span>
                      <span>💰 Rp {applicant.expectedSalary.toLocaleString('id-ID')}</span>
                      <span className="text-gray-400">{applicant.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewProfile(applicant)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Profil
                  </button>
                  <button 
                    onClick={() => handleScheduleInterview(applicant)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Interview"
                  >
                    <Calendar size={16} />
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(applicant.id.toString())}
                    className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Status"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredApplicants.length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Tidak ada pelamar yang sesuai dengan filter</p>
            </div>
          )}
        </div>
      </div>
    )
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h2>
          <p className="text-gray-600">Analisis performa rekrutmen dan metrik bisnis</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Sistem</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex h-screen">
        {/* Enhanced Modern Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white/95 backdrop-blur-lg shadow-2xl border-r border-gray-100/50 transition-all duration-500 relative flex flex-col`}>
          {/* Enhanced Logo Header */}
          <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Building2 size={32} className="text-white" />
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

          {/* Enhanced Navigation Menu */}
          <div className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl transform scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:scale-102'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
                )}
                <div className={`p-2 rounded-xl transition-all z-10 ${
                  activeTab === item.id 
                    ? 'bg-white/20 shadow-lg' 
                    : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                }`}>
                  <item.icon size={20} />
                </div>
                {!sidebarCollapsed && (
                  <span className="font-semibold text-sm z-10">{item.label}</span>
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
          {/* Enhanced Modern Header */}
          <div className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    {(() => {
                      const activeItem = sidebarItems.find(item => item.id === activeTab);
                      if (activeItem) {
                        const IconComponent = activeItem.icon;
                        return <IconComponent size={20} className="text-white" />;
                      }
                      return null;
                    })()}
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {sidebarItems.find(item => item.id === activeTab)?.label}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm pl-11">
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

          {/* Enhanced Content Area */}
          <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-white/30 via-transparent to-blue-50/20">
            <div className="max-w-7xl mx-auto space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Job Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-hidden">
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

      {/* Applicant Profile Modal */}
      {showApplicantProfile && selectedApplicant && (
        <ApplicantProfileModal
          applicant={selectedApplicant}
          onClose={() => {
            setShowApplicantProfile(false);
            setSelectedApplicant(null);
          }}
          onUpdateStatus={handleUpdateApplicantStatus}
          onScheduleInterview={() => {
            setShowApplicantProfile(false);
            setShowInterviewScheduler(true);
          }}
          onSendMessage={() => {
            setShowApplicantProfile(false);
            setShowMessageComposer(true);
          }}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;