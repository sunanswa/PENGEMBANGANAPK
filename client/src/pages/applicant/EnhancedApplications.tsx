import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  MessageSquare, 
  Download, 
  Filter, 
  Search, 
  ArrowRight,
  MapPin,
  Building,
  DollarSign,
  User,
  Star,
  AlertTriangle,
  FileText,
  Phone,
  Video,
  Mail,
  Trash2,
  Edit,
  MoreVertical,
  TrendingUp,
  Target
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'submitted' | 'viewed' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
  interviewDate?: string;
  interviewType?: 'phone' | 'video' | 'onsite';
  feedback?: string;
  recruiterName?: string;
  lastUpdate: string;
  urgency: 'low' | 'medium' | 'high';
}

interface TimelineEvent {
  id: string;
  type: 'application' | 'view' | 'interview' | 'feedback' | 'decision';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
}

export default function EnhancedApplications() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const applications: Application[] = [
    {
      id: '1',
      jobTitle: 'Senior Software Developer',
      company: 'PT Tech Solutions',
      companyLogo: '🏢',
      location: 'Jakarta',
      salary: 'Rp 15.000.000 - Rp 20.000.000',
      appliedDate: '2025-07-10',
      status: 'interview',
      interviewDate: '2025-07-15',
      interviewType: 'video',
      recruiterName: 'Sarah Johnson',
      lastUpdate: '2025-07-12',
      urgency: 'high'
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      company: 'PT Digital Innovation',
      companyLogo: '💻',
      location: 'Bandung',
      salary: 'Rp 10.000.000 - Rp 15.000.000',
      appliedDate: '2025-07-08',
      status: 'viewed',
      lastUpdate: '2025-07-11',
      urgency: 'medium'
    },
    {
      id: '3',
      jobTitle: 'Full Stack Developer',
      company: 'PT Startup Unicorn',
      companyLogo: '🦄',
      location: 'Remote',
      salary: 'Rp 12.000.000 - Rp 18.000.000',
      appliedDate: '2025-07-05',
      status: 'accepted',
      feedback: 'Congratulations! We are pleased to offer you the position.',
      lastUpdate: '2025-07-12',
      urgency: 'high'
    },
    {
      id: '4',
      jobTitle: 'Backend Developer',
      company: 'PT Enterprise Corp',
      companyLogo: '🏭',
      location: 'Surabaya',
      salary: 'Rp 9.000.000 - Rp 13.000.000',
      appliedDate: '2025-07-03',
      status: 'rejected',
      feedback: 'Thank you for your interest. We decided to move forward with another candidate.',
      lastUpdate: '2025-07-09',
      urgency: 'low'
    },
    {
      id: '5',
      jobTitle: 'DevOps Engineer',
      company: 'PT Cloud Services',
      companyLogo: '☁️',
      location: 'Jakarta',
      salary: 'Rp 14.000.000 - Rp 19.000.000',
      appliedDate: '2025-07-01',
      status: 'submitted',
      lastUpdate: '2025-07-01',
      urgency: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'viewed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'interview': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'accepted': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'withdrawn': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'interview': return <Calendar className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'withdrawn': return <Trash2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getTimelineEvents = (application: Application): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'application',
        title: 'Lamaran Dikirim',
        description: 'Lamaran Anda telah berhasil dikirim',
        date: application.appliedDate,
        status: 'completed'
      }
    ];

    if (['viewed', 'interview', 'accepted', 'rejected'].includes(application.status)) {
      events.push({
        id: '2',
        type: 'view',
        title: 'Lamaran Dilihat',
        description: 'Recruiter telah melihat lamaran Anda',
        date: application.lastUpdate,
        status: 'completed'
      });
    }

    if (['interview', 'accepted', 'rejected'].includes(application.status)) {
      events.push({
        id: '3',
        type: 'interview',
        title: application.status === 'interview' ? 'Interview Dijadwalkan' : 'Interview Selesai',
        description: application.interviewDate ? `${application.interviewType} interview pada ${application.interviewDate}` : 'Interview telah dilakukan',
        date: application.interviewDate || application.lastUpdate,
        status: application.status === 'interview' ? 'current' : 'completed'
      });
    }

    if (['accepted', 'rejected'].includes(application.status)) {
      events.push({
        id: '4',
        type: 'decision',
        title: application.status === 'accepted' ? 'Diterima' : 'Ditolak',
        description: application.feedback || 'Keputusan telah dibuat',
        date: application.lastUpdate,
        status: 'completed'
      });
    }

    return events;
  };

  const filteredApplications = applications
    .filter(app => {
      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return ['submitted', 'viewed', 'interview'].includes(app.status);
      if (activeTab === 'completed') return ['accepted', 'rejected'].includes(app.status);
      return app.status === activeTab;
    })
    .filter(app => 
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => ['submitted', 'viewed', 'interview'].includes(app.status)).length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  const renderApplicationCard = (application: Application) => (
    <div 
      key={application.id}
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 ${getUrgencyColor(application.urgency)} border-r border-t border-b border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer`}
      onClick={() => setSelectedApplication(application)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{application.companyLogo}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.jobTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">{application.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span className="capitalize">{application.status}</span>
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{application.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span>{application.salary}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{application.appliedDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{application.lastUpdate}</span>
        </div>
      </div>

      {application.interviewDate && application.status === 'interview' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Interview: {application.interviewDate} ({application.interviewType})
            </span>
          </div>
          {application.recruiterName && (
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              dengan {application.recruiterName}
            </p>
          )}
        </div>
      )}

      {application.feedback && (
        <div className={`border rounded-lg p-3 mb-4 ${
          application.status === 'accepted' 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
        }`}>
          <p className={`text-sm ${
            application.status === 'accepted'
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {application.feedback}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {application.status === 'interview' && (
            <>
              {application.interviewType === 'video' && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Video className="h-3 w-3" />
                  <span>Join Video</span>
                </button>
              )}
              {application.interviewType === 'phone' && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  <Phone className="h-3 w-3" />
                  <span>Call Info</span>
                </button>
              )}
            </>
          )}
        </div>
        <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          <span className="text-sm">Detail</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderApplicationDetail = () => {
    if (!selectedApplication) return null;

    const timelineEvents = getTimelineEvents(selectedApplication);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{selectedApplication.companyLogo}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedApplication.jobTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedApplication.company}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedApplication(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                {getStatusIcon(selectedApplication.status)}
                <span className="capitalize">{selectedApplication.status}</span>
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Chat
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4 inline mr-2" />
                  Download
                </button>
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Lokasi</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.location}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Gaji</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.salary}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Tanggal Lamar</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.appliedDate}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Recruiter</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedApplication.recruiterName || 'Belum ditentukan'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Lamaran</h3>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                      event.status === 'current' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : event.status === 'current' ? (
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{event.date}</p>
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="absolute left-4 mt-8 w-px h-6 bg-gray-200 dark:bg-gray-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {selectedApplication.feedback && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feedback</h3>
                <div className={`border rounded-lg p-4 ${
                  selectedApplication.status === 'accepted' 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <p className={`${
                    selectedApplication.status === 'accepted'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {selectedApplication.feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lamaran Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tracking dan kelola semua lamaran pekerjaan
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diterima</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari lamaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Tanggal</option>
            <option value="company">Perusahaan</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'all', label: 'Semua', count: stats.total },
            { id: 'pending', label: 'Pending', count: stats.pending },
            { id: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
            { id: 'completed', label: 'Selesai', count: stats.accepted + stats.rejected }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum ada lamaran
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Tidak ada lamaran yang sesuai dengan pencarian' : 'Mulai melamar pekerjaan sekarang!'}
            </p>
          </div>
        ) : (
          filteredApplications.map(renderApplicationCard)
        )}
      </div>

      {/* Application Detail Modal */}
      {renderApplicationDetail()}
    </div>
  );
}