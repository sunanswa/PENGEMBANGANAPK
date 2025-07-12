import React, { useState } from 'react';
import EnhancedJobListings from './EnhancedJobListings';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedJobs, setSavedJobs] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for stats
  const jobStats: JobStats = {
    totalApplications: 12,
    pending: 8,
    interviews: 3,
    accepted: 1,
    rejected: 0
  };

  const profileCompletion = 85;
  
  const recentJobs: Job[] = [
    {
      id: 1,
      title: "Senior Software Developer",
      company: "PT Tech Solutions",
      location: "Jakarta",
      salary: "Rp 15.000.000 - Rp 20.000.000",
      type: "Full-time",
      postedDate: "2 hari lalu",
      applicants: 45,
      match: 92,
      saved: true,
      urgent: true
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "PT Digital Marketing",
      location: "Bandung",
      salary: "Rp 12.000.000 - Rp 16.000.000",
      type: "Full-time",
      postedDate: "1 hari lalu",
      applicants: 32,
      match: 78,
      saved: false,
      urgent: false
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "PT Analytics Corp",
      location: "Surabaya",
      salary: "Rp 10.000.000 - Rp 14.000.000",
      type: "Contract",
      postedDate: "3 hari lalu",
      applicants: 28,
      match: 85,
      saved: true,
      urgent: false
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: "PT Tech Solutions",
      position: "Software Developer",
      date: "15 Juli 2025",
      time: "10:00 WIB",
      type: "Video Call"
    },
    {
      id: 2,
      company: "PT Digital Corp",
      position: "Marketing Specialist",
      date: "18 Juli 2025",
      time: "14:00 WIB",
      type: "On-site"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Aplikasi Anda telah dilihat",
      message: "PT Tech Solutions melihat profil Anda",
      time: "2 jam lalu",
      type: "view"
    },
    {
      id: 2,
      title: "Interview dijadwalkan",
      message: "Interview untuk posisi Software Developer",
      time: "1 hari lalu",
      type: "interview"
    },
    {
      id: 3,
      title: "Pekerjaan baru sesuai kriteria",
      message: "5 pekerjaan baru di Jakarta",
      time: "2 hari lalu",
      type: "job"
    }
  ];

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Selamat Datang, John!</h2>
            <p className="text-blue-100 mt-1">Mari temukan pekerjaan impian Anda</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Profil</div>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <div className="text-xs text-blue-200">Lengkap</div>
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Lamaran</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobStats.totalApplications}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dalam Proses</p>
              <p className="text-2xl font-bold text-yellow-600">{jobStats.pending}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interview</p>
              <p className="text-2xl font-bold text-purple-600">{jobStats.interviews}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diterima</p>
              <p className="text-2xl font-bold text-green-600">{jobStats.accepted}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Mendatang</h3>
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-3">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{interview.position}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{interview.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {interview.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{interview.date}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{interview.time}</p>
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
          {notifications.map((notification) => (
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
    <EnhancedJobListings />
  );

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola karir dan lamaran Anda
          </p>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Overview</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'jobs'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span>Jobs</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' ? renderDashboard() : renderJobRecommendations()}
    </div>
  );
}