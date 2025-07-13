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
      {/* Cyberpunk Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-10 animate-scale-in tilt-effect card-enhanced">
        {/* Cyberpunk Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
          <div className="absolute inset-0 gradient-mesh opacity-40"></div>
          <div className="absolute top-6 right-6 w-40 h-40 glow-cyan rounded-full blur-3xl morphing-blob opacity-20"></div>
          <div className="absolute bottom-6 left-6 w-32 h-32 glow-pink rounded-full blur-2xl parallax-float opacity-30"></div>
          
          {/* Neon Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text drop-shadow-2xl">Selamat Datang, John!</h2>
            <p className="text-cyan-100 mt-4 font-bold text-xl tracking-wide">Mari temukan pekerjaan impian Anda bersama SWAPRO</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-300 text-sm font-mono uppercase tracking-widest">CONNECTION ESTABLISHED</span>
            </div>
          </div>
          <div className="text-right glass-effect rounded-3xl p-6 border-2 border-cyan-400/50 glow-cyan">
            <div className="text-sm text-cyan-300 font-bold uppercase tracking-wider">Profile Status</div>
            <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text drop-shadow-lg">{profileCompletion}%</div>
            <div className="text-xs text-cyan-200 font-mono">OPTIMIZATION LEVEL</div>
          </div>
        </div>
        
        <div className="mt-10 relative">
          <div className="glass-effect rounded-full h-6 border-2 border-cyan-400/30">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full h-6 transition-all duration-1000 glow-cyan shadow-2xl relative overflow-hidden"
              style={{ width: `${profileCompletion}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="absolute -top-3 right-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl floating glow-pink">
            ⚡
          </div>
        </div>
      </div>

      {/* Revolutionary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="card-enhanced p-8 animate-scale-in tilt-effect magnetic ripple-effect group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-300 font-bold uppercase tracking-widest">Total Lamaran</p>
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mt-4 group-hover:scale-110 transition-transform">{jobStats.totalApplications}</p>
              <p className="text-xs text-cyan-400 mt-3 font-mono">+3 MONTH CYCLE ↗</p>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl floating glow-cyan border-2 border-cyan-400/50">
              <Briefcase className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-6 h-3 glass-effect rounded-full overflow-hidden border border-cyan-400/30">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full w-3/4 glow-cyan relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="card-enhanced p-8 animate-scale-in tilt-effect magnetic ripple-effect group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300 font-bold uppercase tracking-widest">Dalam Proses</p>
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text mt-4 group-hover:scale-110 transition-transform">{jobStats.pending}</p>
              <p className="text-xs text-orange-400 mt-3 font-mono">REVIEW QUEUE ⏳</p>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl floating glow-orange border-2 border-orange-400/50">
              <Clock className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-6 h-3 glass-effect rounded-full overflow-hidden border border-orange-400/30">
            <div className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 rounded-full w-1/2 glow-orange relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="card-enhanced p-8 animate-scale-in tilt-effect magnetic ripple-effect group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300 font-bold uppercase tracking-widest">Interview</p>
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mt-4 group-hover:scale-110 transition-transform">{jobStats.interviews}</p>
              <p className="text-xs text-purple-400 mt-3 font-mono">SCHEDULED ⚡</p>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl floating glow-purple border-2 border-purple-400/50">
              <Calendar className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-6 h-3 glass-effect rounded-full overflow-hidden border border-purple-400/30">
            <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full w-2/3 glow-purple relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="card-enhanced p-8 animate-scale-in tilt-effect magnetic ripple-effect group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300 font-bold uppercase tracking-widest">Diterima</p>
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text mt-4 group-hover:scale-110 transition-transform">{jobStats.accepted}</p>
              <p className="text-xs text-green-400 mt-3 font-mono">SUCCESS ✓</p>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl floating glow-cyan border-2 border-green-400/50">
              <CheckCircle className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-6 h-3 glass-effect rounded-full overflow-hidden border border-green-400/30">
            <div className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 rounded-full w-4/5 glow-cyan relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>
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
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden">
            {/* Cyberpunk Background Effects */}
            <div className="absolute inset-0 gradient-mesh opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/5 via-purple-500/10 to-pink-500/5"></div>
            
            {/* SWAPRO Header */}
            <SwaprosHeader 
              title="Dashboard SWAPRO" 
              subtitle="Kelola karir dan lamaran Anda dengan mudah"
              showSearch={false}
              userRole="applicant"
            />
            
            <div className="relative z-10 p-6 pb-24">
              {/* Cyberpunk Tab Navigation */}
              <div className="flex space-x-2 mb-8 glass-effect rounded-2xl p-2 border-2 border-cyan-400/30">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-4 px-6 rounded-xl transition-all duration-500 font-black text-sm uppercase tracking-widest ${
                    activeTab === 'dashboard'
                      ? 'glass-effect text-cyan-300 glow-cyan border-2 border-cyan-400/50 shadow-2xl'
                      : 'text-cyan-100/60 hover:text-cyan-300 hover:glow-cyan'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Target className="h-5 w-5" />
                    <span>OVERVIEW</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 py-4 px-6 rounded-xl transition-all duration-500 font-black text-sm uppercase tracking-widest ${
                    activeTab === 'jobs'
                      ? 'glass-effect text-cyan-300 glow-cyan border-2 border-cyan-400/50 shadow-2xl'
                      : 'text-cyan-100/60 hover:text-cyan-300 hover:glow-cyan'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Briefcase className="h-5 w-5" />
                    <span>PEKERJAAN</span>
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