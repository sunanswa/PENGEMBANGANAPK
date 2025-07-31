import React, { useState, useEffect } from 'react';
import { useSync } from '@/hooks/useSync';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import CommunicationHub from '../components/CommunicationHub';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import MessageComposer from '../components/MessageComposer';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import EmailAutomation from '../components/EmailAutomation';
import MobileOptimizedHeader from '../components/MobileOptimizedHeader';
import RealTimeIndicator from '../components/RealTimeIndicator';
import EnhancedDataExport from '../components/EnhancedDataExport';
import { 
  Plus, 
  Edit3,
  Edit,
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
  ChevronLeft,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  User,
  Brain,
  Video,
  MessageCircle,
  UserPlus,
  X
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
  // Use sync for admin role
  const { 
    stats, 
    jobs: syncedJobs, 
    applications: syncedApplications, 
    candidates: syncedCandidates,
    interviews: syncedInterviews,
    notifications: syncedNotifications,
    addJob,
    updateJob,
    deleteJob,
    updateApplication,
    addInterview,
    updateInterview
  } = useSync('admin', 'admin1');
  
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
  const [showEmailAutomation, setShowEmailAutomation] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [exportDataType, setExportDataType] = useState<'jobs' | 'applications' | 'candidates'>('jobs');

  // Real-time updates
  const { lastUpdate } = useRealTimeUpdates();

  // Advanced search hooks
  const jobsSearch = useAdvancedSearch(syncedJobs, {
    searchableFields: ['title', 'description', 'location'],
    filterableFields: ['status', 'location'],
    sortableFields: ['title', 'postedDate', 'status']
  });

  const applicationsSearch = useAdvancedSearch(syncedApplications, {
    searchableFields: ['applicantName', 'jobTitle', 'applicantEmail'],
    filterableFields: ['status', 'jobTitle'],
    sortableFields: ['appliedAt', 'status', 'applicantName']
  });

  const candidatesSearch = useAdvancedSearch(syncedCandidates, {
    searchableFields: ['name', 'email', 'skills'],
    filterableFields: ['status', 'experience'],
    sortableFields: ['name', 'appliedDate', 'status']
  });

  // Clean data arrays for search (remove duplicates)

  // Missing function handlers
  const handleViewProfile = (applicant: any) => {
    setSelectedCandidate(applicant);
    // You can add modal logic here
  };

  const handleScheduleInterview = (applicant: any) => {
    setSelectedCandidate(applicant);
    setShowInterviewScheduler(true);
  };

  const handleStatusUpdate = (applicantId: string) => {
    // Add status update logic here
    console.log('Updating status for applicant:', applicantId);
  };

  const renderInterviewsManagement = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Management</h2>
          <p className="text-slate-600">Kelola jadwal dan proses interview kandidat</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2">
            <Calendar size={16} />
            Jadwalkan Interview
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Jadwal
          </button>
        </div>
      </div>

      {/* Interview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interview Hari Ini</p>
              <p className="text-2xl font-bold text-slate-800">3</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interview Pending</p>
              <p className="text-2xl font-bold text-slate-800">7</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interview Selesai</p>
              <p className="text-2xl font-bold text-slate-800">15</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-slate-800">85%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800">Jadwal Interview Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {syncedInterviews.map((interview) => (
            <div key={interview.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold">{interview.candidateName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-600 mb-1">{interview.jobTitle} - {interview.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {interview.date} - {interview.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video size={14} />
                        {interview.type === 'video' ? 'Video Call' : interview.type === 'phone' ? 'Telepon' : 'Onsite'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                        interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.status === 'scheduled' ? 'Terjadwal' :
                         interview.status === 'completed' ? 'Selesai' :
                         interview.status === 'cancelled' ? 'Dibatalkan' : interview.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Interview">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Join Meeting">
                    <Video size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                    <Trash2 size={16} />
                  </button>
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Screening & Assessment</h2>
          <p className="text-slate-600">Assessment dan screening otomatis kandidat</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
            <Brain size={16} />
            AI Assessment
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FileText size={16} />
            Template Test
          </button>
        </div>
      </div>

      {/* Assessment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Assessment</p>
              <p className="text-2xl font-bold text-slate-800">128</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Brain size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rata-rata Skor</p>
              <p className="text-2xl font-bold text-slate-800">78.5</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
              <p className="text-2xl font-bold text-slate-800">67%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-slate-800">23</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Technical Test</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Assessment teknikal untuk posisi IT dan engineering</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-slate-800">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-medium text-slate-800">82.3</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Personality Test</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Assessment kepribadian dan soft skills kandidat</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-slate-800">67</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-medium text-slate-800">75.8</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Case Study</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Studi kasus untuk posisi strategis dan manajerial</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-slate-800">16</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-medium text-slate-800">71.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Communication Hub</h2>
          <p className="text-slate-600">Hub komunikasi email, SMS, dan WhatsApp</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Mail size={16} />
            Email Blast
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
            <MessageCircle size={16} />
            WhatsApp
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
            <Phone size={16} />
            SMS Blast
          </button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email Terkirim</p>
              <p className="text-2xl font-bold text-slate-800">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">WhatsApp Sent</p>
              <p className="text-2xl font-bold text-slate-800">856</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">SMS Terkirim</p>
              <p className="text-2xl font-bold text-slate-800">423</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Phone size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-slate-800">72%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Communications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800">Komunikasi Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { id: 1, type: 'email', recipient: 'Ahmad Rizki', subject: 'Interview Confirmation', time: '2 jam lalu', status: 'delivered' },
            { id: 2, type: 'whatsapp', recipient: 'Siti Nurhaliza', subject: 'Application Update', time: '4 jam lalu', status: 'read' },
            { id: 3, type: 'sms', recipient: 'Budi Santoso', subject: 'Interview Reminder', time: '1 hari lalu', status: 'delivered' },
            { id: 4, type: 'email', recipient: 'Maya Kusuma', subject: 'Job Offer', time: '1 hari lalu', status: 'opened' },
            { id: 5, type: 'whatsapp', recipient: 'Rina Dewi', subject: 'Thank You Message', time: '2 hari lalu', status: 'read' }
          ].map((comm) => (
            <div key={comm.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    comm.type === 'email' ? 'bg-blue-100' :
                    comm.type === 'whatsapp' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {comm.type === 'email' ? <Mail size={20} className="text-blue-600" /> :
                     comm.type === 'whatsapp' ? <MessageCircle size={20} className="text-green-600" /> :
                     <Phone size={20} className="text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{comm.recipient}</h4>
                    <p className="text-sm text-gray-600">{comm.subject}</p>
                    <p className="text-xs text-gray-500">{comm.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    comm.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                    comm.status === 'read' ? 'bg-green-100 text-green-800' :
                    comm.status === 'opened' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {comm.status === 'delivered' ? 'Terkirim' :
                     comm.status === 'read' ? 'Dibaca' :
                     comm.status === 'opened' ? 'Dibuka' : comm.status}
                  </span>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
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

  // Use synced data instead of API query
  const jobPostings = syncedJobs.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description,
    locations: [job.location],
    status: job.status,
    created_at: job.postedDate,
    positions_needed: job.applicants
  })).filter(job => statusFilter === 'all' || job.status === statusFilter);
  
  const loading = false;

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

  const dashboardStats = [
    {
      title: 'Pelamar Hari Ini',
      value: stats?.totalApplications || 0,
      change: '+67%',
      icon: UserPlus,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Lowongan',
      value: stats?.totalJobs || 0,
      change: '+12%',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Pelamar',
      value: stats?.totalCandidates || 0,
      change: '+24%',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Hired Bulan Ini',
      value: syncedApplications.filter(app => app.status === 'accepted').length,
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
        {dashboardStats.map((stat, index) => (
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
              <button 
                onClick={() => {
                  setExportDataType('jobs');
                  setShowDataExport(true);
                }}
                className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-300"
              >
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
              <button 
                onClick={() => {
                  setExportDataType('applications');
                  setShowDataExport(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Export Data
                <Download size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyApplicants.slice(0, 4).map((applicant) => (
                <div key={applicant.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {applicant.name ? applicant.name.split(' ').map(n => n[0] || '').join('') : 'NA'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{applicant.name || 'No Name'}</p>
                      <span className="text-xs text-gray-500">{applicant.appliedAt || 'N/A'}</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-2">{applicant.position || 'No Position'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">📍 {applicant.location || 'No Location'}</span>
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

      {/* Advanced Search Controls */}
      <AdvancedSearchBar
        filters={jobsSearch.filters}
        updateFilter={jobsSearch.updateFilter}
        clearFilters={jobsSearch.clearFilters}
        getFilterCount={jobsSearch.getFilterCount}
        placeholder="Cari lowongan pekerjaan..."
        type="jobs"
      />

      {/* Search Results Summary */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Menampilkan {jobsSearch.totalResults} dari {jobsSearch.totalItems} lowongan
            {jobsSearch.getFilterCount() > 0 && ` (${jobsSearch.getFilterCount()} filter aktif)`}
          </span>
          <div className="flex items-center gap-3">
            <span>Sort by:</span>
            <select
              value={jobsSearch.sortBy}
              onChange={(e) => jobsSearch.setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="postedDate">Tanggal Posting</option>
              <option value="title">Judul</option>
              <option value="applicants">Jumlah Pelamar</option>
            </select>
            <button
              onClick={() => jobsSearch.setSortOrder(jobsSearch.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-gray-500 hover:text-gray-700"
              title={`Sort ${jobsSearch.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {jobsSearch.sortOrder === 'asc' ? '↑' : '↓'}
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
        ) : jobsSearch.filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {jobsSearch.getFilterCount() > 0 ? 'Tidak ada lowongan yang sesuai' : 'Belum ada lowongan'}
            </h3>
            <p className="text-gray-600 mb-6">
              {jobsSearch.getFilterCount() > 0
                ? 'Coba ubah kata kunci pencarian atau filter'
                : 'Mulai dengan menambahkan lowongan pekerjaan pertama Anda'
              }
            </p>
            {jobsSearch.getFilterCount() === 0 && (
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
            {jobsSearch.filteredData.map((job) => (
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
                            {new Date(job.postedDate || job.createdAt || Date.now()).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location ? '1 lokasi' : '0 lokasi'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {Math.floor(Math.random() * 50) + 10} pelamar
                          </div>
                          {job.positionsNeeded && (
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              Butuh {job.positionsNeeded} orang
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {job.location && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                            {job.location}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-emerald-600 font-semibold">Rp 8-15 juta</p>
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
              onClick={() => {
                setExportDataType('applications');
                setShowDataExport(true);
              }}
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

        {/* Advanced Search for Applicants */}
        <AdvancedSearchBar
          filters={applicationsSearch.filters}
          updateFilter={applicationsSearch.updateFilter}
          clearFilters={applicationsSearch.clearFilters}
          getFilterCount={applicationsSearch.getFilterCount}
          placeholder="Cari pelamar berdasarkan nama, email, posisi..."
          type="applications"
        />

        {/* Search Results Summary */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {applicationsSearch.totalResults} dari {applicationsSearch.totalItems} pelamar
              {applicationsSearch.getFilterCount() > 0 && ` (${applicationsSearch.getFilterCount()} filter aktif)`}
            </span>
            <div className="flex items-center gap-3">
              <span>Sort by:</span>
              <select
                value={applicationsSearch.sortBy}
                onChange={(e) => applicationsSearch.setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="appliedDate">Tanggal Lamar</option>
                <option value="candidateName">Nama</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => applicationsSearch.setSortOrder(applicationsSearch.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-500 hover:text-gray-700"
                title={`Sort ${applicationsSearch.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {applicationsSearch.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

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
            <p className="text-xl font-bold text-gray-900">{applicationsSearch.totalResults}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Diterima</p>
            <p className="text-xl font-bold text-gray-900">{applicationsSearch.filteredData.filter(a => a.status === 'accepted').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Proses Review</p>
            <p className="text-xl font-bold text-gray-900">{applicationsSearch.filteredData.filter(a => a.status === 'submitted' || a.status === 'viewed').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+22%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Interview Dijadwalkan</p>
            <p className="text-xl font-bold text-gray-900">{applicationsSearch.filteredData.filter(a => a.status === 'interview').length}</p>
          </div>
        </div>

        {/* Clean Applicant List */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Daftar Pelamar ({applicationsSearch.totalResults})
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedApplicants.length === applicationsSearch.totalResults && applicationsSearch.totalResults > 0}
                onChange={() => handleSelectAll(applicationsSearch.filteredData)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-600">Pilih Semua</label>
            </div>
          </div>
          
          <div className="space-y-3">
            {applicationsSearch.filteredData.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(applicant.id.toString())}
                    onChange={() => handleApplicantSelect(applicant.id.toString())}
                    className="rounded border-gray-300"
                  />
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{(applicant.applicantName || applicant.name || 'N').charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{applicant.applicantName || applicant.name || 'No Name'}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        applicant.status === 'submitted' ? 'bg-green-100 text-green-800' :
                        applicant.status === 'viewed' ? 'bg-yellow-100 text-yellow-800' :
                        applicant.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                        applicant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {applicant.status === 'submitted' ? 'Baru' :
                         applicant.status === 'viewed' ? 'Review' :
                         applicant.status === 'interview' ? 'Interview' :
                         applicant.status === 'accepted' ? 'Diterima' :
                         'Ditolak'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{applicant.jobTitle || applicant.position || 'No Position'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📧 {applicant.applicantEmail || applicant.email || 'No Email'}</span>
                      <span>📍 {applicant.location || 'No Location'}</span>
                      <span>💰 Rp {(applicant.expectedSalary || 0).toLocaleString('id-ID')}</span>
                      <span className="text-gray-400">{applicant.appliedAt || applicant.time || 'N/A'}</span>
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analytics & Reports</h2>
          <p className="text-slate-600">Analisis mendalam dengan AI dan prediksi sukses kandidat</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2">
            <Brain size={16} />
            AI Insights
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-800">23.5%</p>
              <p className="text-xs text-green-600 font-medium">+5.2% dari bulan lalu</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Time to Hire</p>
              <p className="text-2xl font-bold text-slate-800">14 hari</p>
              <p className="text-xs text-blue-600 font-medium">-3 hari dari target</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quality Score</p>
              <p className="text-2xl font-bold text-slate-800">4.8/5</p>
              <p className="text-xs text-purple-600 font-medium">Excellent performance</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cost Per Hire</p>
              <p className="text-2xl font-bold text-slate-800">Rp 2.5M</p>
              <p className="text-xs text-orange-600 font-medium">-15% dari target</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Hiring Funnel</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Applications</span>
              <span className="font-medium text-slate-800">245</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Screening</span>
              <span className="font-medium text-slate-800">156</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{width: '64%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Interview</span>
              <span className="font-medium text-slate-800">89</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '36%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Offer</span>
              <span className="font-medium text-slate-800">34</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '14%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hired</span>
              <span className="font-medium text-slate-800">28</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{width: '11%'}}></div>
            </div>
          </div>
        </div>

        {/* Source Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sumber Kandidat Terbaik</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Globe size={16} className="text-white" />
                </div>
                <span className="font-medium text-slate-800">Job Portals</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">45%</p>
                <p className="text-xs text-gray-600">110 candidates</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserPlus size={16} className="text-white" />
                </div>
                <span className="font-medium text-slate-800">Referrals</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">28%</p>
                <p className="text-xs text-gray-600">69 candidates</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Globe size={16} className="text-white" />
                </div>
                <span className="font-medium text-slate-800">Social Media</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">18%</p>
                <p className="text-xs text-gray-600">44 candidates</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Building2 size={16} className="text-white" />
                </div>
                <span className="font-medium text-slate-800">Direct Apply</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">9%</p>
                <p className="text-xs text-gray-600">22 candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold">AI Insights & Predictions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Success Prediction</h4>
            <p className="text-sm opacity-90">Ahmad Rizki memiliki 87% kemungkinan sukses dalam posisi Senior Developer berdasarkan profil dan pengalaman</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Optimal Timing</h4>
            <p className="text-sm opacity-90">Waktu terbaik untuk posting lowongan Frontend Developer adalah hari Selasa-Kamis pukul 09:00-11:00</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Salary Benchmark</h4>
            <p className="text-sm opacity-90">Gaji untuk Data Scientist di Surabaya sebaiknya berada di range Rp 12-18 juta untuk mendapat kandidat berkualitas</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pengaturan Sistem</h2>
          <p className="text-slate-600">Kelola pengaturan dan preferensi admin dashboard</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
            <CheckCircle size={16} />
            Simpan Pengaturan
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Reset Default
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferensi Sistem</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Dark Mode</p>
                <p className="text-sm text-gray-600">Aktifkan tampilan gelap</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Auto Refresh</p>
                <p className="text-sm text-gray-600">Refresh otomatis setiap 30 detik</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Notifikasi email untuk aktivitas penting</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Sound Alerts</p>
                <p className="text-sm text-gray-600">Suara notifikasi untuk aktivitas baru</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pengaturan Akun</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Admin</label>
              <input 
                type="text" 
                defaultValue="Admin SWAPRO"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="admin@swapro.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>WIB (UTC+7)</option>
                <option>WITA (UTC+8)</option>
                <option>WIT (UTC+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Keamanan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Keamanan tambahan dengan 2FA</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto logout setelah 30 menit tidak aktif</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Ganti Password
            </button>

            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Logout Semua Device
            </button>
          </div>
        </div>

        {/* API & Integrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">API & Integrasi</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">WhatsApp Business API</p>
                  <p className="text-xs text-gray-600">Connected</p>
                </div>
              </div>
              <button className="text-green-600 text-sm hover:underline">Manage</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">SendGrid Email</p>
                  <p className="text-xs text-gray-600">Connected</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Manage</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">LinkedIn Integration</p>
                  <p className="text-xs text-gray-600">Not connected</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Connect</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Google Calendar</p>
                  <p className="text-xs text-gray-600">Not connected</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Connect</button>
            </div>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="flex h-screen">
        {/* Modern Clean Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 relative flex flex-col`}>
          {/* Clean Logo Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">SWAPRO</h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-6 w-7 h-7 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 z-20"
            >
              <ChevronRight size={14} className={`text-gray-600 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Clean Navigation Menu */}
          <div className="flex-1 p-3 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon size={18} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Admin Profile Footer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Admin User</p>
                  <p className="text-gray-500 text-xs">admin@swapro.com</p>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileOptimizedHeader
            title={sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            subtitle={
              activeTab === 'overview' ? 'Dashboard dan statistik sistem rekrutmen SWAPRO' :
              activeTab === 'jobs' ? 'Kelola dan pantau lowongan pekerjaan dengan mudah' :
              activeTab === 'applicants' ? 'Data pelamar dan proses rekrutmen terkini' :
              activeTab === 'interviews' ? 'Kelola jadwal dan proses interview kandidat' :
              activeTab === 'screening' ? 'Assessment dan screening otomatis kandidat' :
              activeTab === 'communication' ? 'Hub komunikasi email, SMS, dan WhatsApp' :
              activeTab === 'analytics' ? 'Analisis mendalam dengan AI dan prediksi sukses kandidat' :
              'Pengaturan sistem dan preferensi admin'
            }
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            notificationCount={3}
          />

          {/* Desktop Header */}
          <div className="hidden lg:block bg-white shadow-sm border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                    {(() => {
                      const activeItem = sidebarItems.find(item => item.id === activeTab);
                      if (activeItem) {
                        const IconComponent = activeItem.icon;
                        return <IconComponent size={14} className="text-white" />;
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
                {/* Real-time indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Live</span>
                </div>
                <span className="text-sm text-gray-600">
                  Updated {new Date(lastUpdate).toLocaleTimeString()}
                </span>
                
                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105 relative" title="Notifications">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button 
                  onClick={() => setShowEmailAutomation(true)}
                  className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105" 
                  title="Email Automation"
                >
                  <Mail size={20} />
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

          {/* Clean Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-4">
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

      {/* Email Automation Modal */}
      {showEmailAutomation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-slate-800">Email Automation</h2>
              <button
                onClick={() => setShowEmailAutomation(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <EmailAutomation />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Data Export Modal */}
      {showDataExport && (
        <EnhancedDataExport
          dataType={exportDataType}
          totalRecords={
            exportDataType === 'jobs' ? jobsSearch.totalItems :
            exportDataType === 'applications' ? applicationsSearch.totalItems :
            candidatesSearch.totalItems
          }
          onClose={() => setShowDataExport(false)}
          onExport={(config) => {
            console.log('Exporting data with config:', config);
            // Here you would implement the actual export logic
            alert(`Export started: ${config.format} format with ${config.fields.filter(f => f.selected).length} fields`);
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