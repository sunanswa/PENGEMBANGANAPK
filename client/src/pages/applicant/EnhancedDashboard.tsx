import React, { useState } from 'react';
import EnhancedJobListings from './EnhancedJobListings';
import ApplicationsPage from './ApplicationsPage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import InterviewPage from './InterviewPage';
import SwaprosHeader from '@/components/SwaprosHeader';
import SwaprosBottomNav from '@/components/SwaprosBottomNav';
import { useSync } from '@/hooks/useSync';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  MapPin,
  DollarSign,
  BookmarkPlus,
  Bookmark,
  Filter,
  Search,
  Bell,
  Eye,
  ArrowRight,
  FileText,
  User,
  Award,
  Target
} from 'lucide-react';

interface JobStats {
  totalApplications: number;
  pending: number;
  interviews: number;
  accepted: number;
  rejected: number;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  applicants: number;
  match: number;
  saved: boolean;
  urgent: boolean;
}

export default function EnhancedDashboard() {
  const { stats, jobs, applications, interviews, notifications } = useSync('applicant', 'candidate1');
  const [currentPage, setCurrentPage] = useState('menu');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedJobs, setSavedJobs] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use synced stats data
  const jobStats: JobStats = {
    totalApplications: stats?.myApplications || 0,
    pending: stats?.pendingApplications || 0,
    interviews: stats?.interviews || 0,
    accepted: stats?.acceptedApplications || 0,
    rejected: stats?.rejectedApplications || 0
  };

  const profileCompletion = stats?.profileViews || 85;
  
  // Use synced jobs data
  const recentJobs = jobs.slice(0, 3).map(job => ({
    id: parseInt(job.id),
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    type: job.type,
    postedDate: job.postedDate,
    applicants: job.applicants,
    match: job.match || 85,
    saved: job.saved || false,
    urgent: job.urgent
  }));

  // Use synced interviews data
  const upcomingInterviews = interviews
    .filter(interview => interview.status === 'scheduled')
    .slice(0, 2)
    .map(interview => ({
      id: parseInt(interview.id),
      company: interview.company,
      position: interview.jobTitle,
      date: interview.date,
      time: interview.time,
      type: interview.type === 'video' ? 'Video Call' : interview.type === 'onsite' ? 'On-site' : 'Phone Call'
    }));

  // Use synced notifications data
  const recentNotifications = notifications.slice(0, 3).map(notification => ({
    id: parseInt(notification.id),
    title: notification.title,
    message: notification.message,
    time: notification.timestamp,
    type: notification.type
  }));

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-enhanced p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Selamat Datang, John!</h2>
            <p className="text-slate-600 mt-2 text-lg">Mari temukan pekerjaan impian Anda bersama SWAPRO</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-500 text-sm font-medium">Profil Aktif</span>
            </div>
          </div>
          <div className="text-right glass-effect rounded-xl p-4 border border-slate-200">
            <div className="text-sm text-slate-600 font-medium">Kelengkapan Profil</div>
            <div className="text-3xl font-bold text-indigo-600 mt-1">{profileCompletion}%</div>
            <div className="text-xs text-slate-500">Hampir Sempurna!</div>
          </div>
        </div>
        
        <div className="mt-6 relative">
          <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-3 transition-all duration-700"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <div className="absolute -top-1 right-0 w-5 h-5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      </div>

      {/* Revolutionary Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
        <div className="card-enhanced p-3 sm:p-4 lg:p-6 group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold">Total Lamaran</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mt-1 sm:mt-2 group-hover:text-blue-600 transition-colors">{jobStats.totalApplications}</p>
              <p className="text-xs text-blue-600 mt-1 font-medium hidden sm:block">+3 bulan ini</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
          </div>
        </div>

        <div className="card-enhanced p-3 sm:p-4 lg:p-6 group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold">Dalam Proses</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mt-1 sm:mt-2 group-hover:text-amber-600 transition-colors">{jobStats.pending}</p>
              <p className="text-xs text-amber-600 mt-1 font-medium hidden sm:block">Menunggu review</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-1/2"></div>
          </div>
        </div>

        <div className="card-enhanced p-3 sm:p-4 lg:p-6 group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold">Interview</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mt-1 sm:mt-2 group-hover:text-violet-600 transition-colors">{jobStats.interviews}</p>
              <p className="text-xs text-violet-600 mt-1 font-medium hidden sm:block">Terjadwal</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full w-2/3"></div>
          </div>
        </div>

        <div className="card-enhanced p-3 sm:p-4 lg:p-6 group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold">Diterima</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mt-1 sm:mt-2 group-hover:text-emerald-600 transition-colors">{jobStats.accepted}</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium hidden sm:block">Selamat!</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-4/5"></div>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews with Modern Design */}
      <div className="card-enhanced p-6 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">Interview Mendatang</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-4">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{interview.position}</h4>
                <p className="text-sm text-gray-600 font-medium">{interview.company}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold">
                    {interview.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{interview.date}</p>
                <p className="text-xs text-gray-600 font-medium">{interview.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifikasi Terbaru</h3>
          <Bell className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-3">
          {recentNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${
                notification.type === 'view' ? 'bg-green-100 dark:bg-green-900' :
                notification.type === 'interview' ? 'bg-purple-100 dark:bg-purple-900' :
                'bg-blue-100 dark:bg-blue-900'
              }`}>
                {notification.type === 'view' && <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {notification.type === 'interview' && <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                {notification.type === 'job' && <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobRecommendations = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rekomendasi Pekerjaan</h3>
      <EnhancedJobListings />
    </div>
  );

  // Handle navigation
  const handleNavigate = (page: string) => {
    console.log('Rendering page:', currentPage, '->', page);
    setCurrentPage(page);
  };

  // Render different pages based on currentPage
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'jobs':
        return <EnhancedJobListings />;
      case 'applications':
        return <ApplicationsPage />;
      case 'interviews':
        return <InterviewPage />;
      case 'chat':
        return <ChatPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 relative">
            <div className="absolute inset-0 gradient-mesh opacity-30"></div>
            
            {/* SWAPRO Header */}
            <SwaprosHeader 
              title="Dashboard SWAPRO" 
              subtitle="Kelola karir dan lamaran Anda dengan mudah"
              showSearch={false}
              userRole="applicant"
            />
            
            <div className="relative z-10 p-6 pb-24">
              {/* Clean Tab Navigation */}
              <div className="flex space-x-1 mb-6 glass-effect rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-sm ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-indigo-600 shadow-md border border-indigo-100'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-sm ${
                    activeTab === 'jobs'
                      ? 'bg-white text-indigo-600 shadow-md border border-indigo-100'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Pekerjaan</span>
                  </div>
                </button>
              </div>

              {/* Content */}
              {activeTab === 'dashboard' ? renderDashboard() : renderJobRecommendations()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderCurrentPage()}
      <SwaprosBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}