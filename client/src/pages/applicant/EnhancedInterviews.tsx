import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MessageSquare,
  Star,
  X,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  interviewerName: string;
  interviewerRole: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  duration: string;
  location?: string;
  meetingLink?: string;
  phoneNumber?: string;
  notes?: string;
  preparation?: string[];
  feedback?: string;
  rating?: number;
}

export default function EnhancedInterviews() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showPreparation, setShowPreparation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const interviews: Interview[] = [
    {
      id: '1',
      jobTitle: 'Senior Software Developer',
      company: 'PT Tech Solutions',
      companyLogo: '🏢',
      interviewerName: 'Sarah Johnson',
      interviewerRole: 'Engineering Manager',
      date: '2025-07-15',
      time: '10:00',
      type: 'video',
      status: 'scheduled',
      duration: '60 menit',
      meetingLink: 'https://zoom.us/j/123456789',
      notes: 'Technical interview focusing on React and Node.js. Be prepared for coding challenges.',
      preparation: [
        'Review React fundamentals and hooks',
        'Practice algorithm problems',
        'Prepare questions about the company',
        'Test video and audio setup'
      ]
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      company: 'PT Digital Innovation',
      companyLogo: '💻',
      interviewerName: 'Michael Chen',
      interviewerRole: 'Technical Lead',
      date: '2025-07-18',
      time: '14:00',
      type: 'onsite',
      status: 'scheduled',
      duration: '90 menit',
      location: 'Jl. Sudirman No. 123, Jakarta',
      notes: 'Onsite interview including technical discussion and culture fit assessment.',
      preparation: [
        'Prepare portfolio presentation',
        'Review company products',
        'Bring printed resume',
        'Plan route to office'
      ]
    },
    {
      id: '3',
      jobTitle: 'Full Stack Developer',
      company: 'PT Startup Unicorn',
      companyLogo: '🦄',
      interviewerName: 'Lisa Wang',
      interviewerRole: 'CTO',
      date: '2025-07-12',
      time: '09:00',
      type: 'video',
      status: 'completed',
      duration: '45 menit',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      feedback: 'Great technical skills and communication. Looking forward to next steps.',
      rating: 5
    },
    {
      id: '4',
      jobTitle: 'Backend Developer',
      company: 'PT Enterprise Corp',
      companyLogo: '🏭',
      interviewerName: 'David Kim',
      interviewerRole: 'Senior Developer',
      date: '2025-07-08',
      time: '16:00',
      type: 'phone',
      status: 'completed',
      duration: '30 menit',
      phoneNumber: '+62 21 1234 5678',
      feedback: 'Good technical knowledge but needs improvement in system design concepts.',
      rating: 3
    }
  ];

  const filteredInterviews = interviews
    .filter(interview => {
      const matchesSearch = interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           interview.interviewerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'upcoming') {
        return matchesSearch && ['scheduled', 'rescheduled'].includes(interview.status);
      } else if (activeTab === 'completed') {
        return matchesSearch && interview.status === 'completed';
      } else if (activeTab === 'cancelled') {
        return matchesSearch && interview.status === 'cancelled';
      }
      return matchesSearch;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'onsite': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const interviewDate = new Date(dateString);
    return today.toDateString() === interviewDate.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const interviewDate = new Date(dateString);
    return tomorrow.toDateString() === interviewDate.toDateString();
  };

  const renderInterviewCard = (interview: Interview) => (
    <div 
      key={interview.id}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
      onClick={() => setSelectedInterview(interview)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{interview.companyLogo}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{interview.jobTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">{interview.company}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
          {interview.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {isToday(interview.date) ? 'Hari ini' : 
               isTomorrow(interview.date) ? 'Besok' : 
               formatDate(interview.date)}
            </div>
            <div>{interview.time} WIB</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getTypeIcon(interview.type)}
          <div>
            <div className="font-medium text-gray-900 dark:text-white capitalize">{interview.type}</div>
            <div>{interview.duration}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{interview.interviewerName}</div>
            <div>{interview.interviewerRole}</div>
          </div>
        </div>

        {interview.rating && (
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{interview.rating}/5</div>
              <div>Rating</div>
            </div>
          </div>
        )}
      </div>

      {interview.notes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">{interview.notes}</p>
        </div>
      )}

      {interview.feedback && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Feedback:</h4>
          <p className="text-sm text-green-700 dark:text-green-300">{interview.feedback}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {interview.status === 'scheduled' && (
            <>
              {interview.type === 'video' && interview.meetingLink && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Video className="h-3 w-3" />
                  <span>Join Meeting</span>
                </button>
              )}
              {interview.type === 'phone' && interview.phoneNumber && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </button>
              )}
              {interview.type === 'onsite' && interview.location && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                  <MapPin className="h-3 w-3" />
                  <span>Directions</span>
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

  const renderInterviewDetail = () => {
    if (!selectedInterview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{selectedInterview.companyLogo}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedInterview.jobTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedInterview.company}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Interview Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Interview Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{formatDate(selectedInterview.date)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{selectedInterview.time} WIB</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(selectedInterview.type)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">{selectedInterview.type} Interview</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{selectedInterview.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedInterview.interviewerName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{selectedInterview.interviewerRole}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Info */}
                {selectedInterview.status === 'scheduled' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">Connection Details</h3>
                    {selectedInterview.type === 'video' && selectedInterview.meetingLink && (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700 dark:text-blue-300">Meeting Link:</p>
                        <a 
                          href={selectedInterview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span className="text-sm">{selectedInterview.meetingLink}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {selectedInterview.type === 'phone' && selectedInterview.phoneNumber && (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700 dark:text-blue-300">Phone Number:</p>
                        <a 
                          href={`tel:${selectedInterview.phoneNumber}`}
                          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{selectedInterview.phoneNumber}</span>
                        </a>
                      </div>
                    )}
                    {selectedInterview.type === 'onsite' && selectedInterview.location && (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700 dark:text-blue-300">Location:</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-blue-600 dark:text-blue-400">{selectedInterview.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Preparation Checklist */}
                {selectedInterview.preparation && selectedInterview.status === 'scheduled' && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Interview Preparation</h3>
                    <div className="space-y-2">
                      {selectedInterview.preparation.map((item, index) => (
                        <label key={index} className="flex items-start space-x-2 cursor-pointer">
                          <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedInterview.feedback && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">Interview Feedback</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">{selectedInterview.feedback}</p>
                    {selectedInterview.rating && (
                      <div className="flex items-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= selectedInterview.rating! 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-green-700 dark:text-green-300 ml-2">
                          {selectedInterview.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedInterview.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Interview Notes</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedInterview.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedInterview.status === 'scheduled' && (
                <>
                  <button className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Reschedule
                  </button>
                  <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    {selectedInterview.type === 'video' ? 'Join Meeting' : 
                     selectedInterview.type === 'phone' ? 'Call Now' : 'Get Directions'}
                  </button>
                </>
              )}
              {selectedInterview.status === 'completed' && (
                <button className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Download Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: interviews.length,
    upcoming: interviews.filter(i => ['scheduled', 'rescheduled'].includes(i.status)).length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola jadwal interview Anda</p>
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
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">75%</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari interview..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'upcoming', label: 'Upcoming', count: stats.upcoming },
            { id: 'completed', label: 'Completed', count: stats.completed },
            { id: 'cancelled', label: 'Cancelled', count: stats.cancelled }
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

      {/* Interview List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum ada interview
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Tidak ada interview yang sesuai dengan pencarian' : 'Interview akan muncul di sini'}
            </p>
          </div>
        ) : (
          filteredInterviews.map(renderInterviewCard)
        )}
      </div>

      {/* Interview Detail Modal */}
      {renderInterviewDetail()}
    </div>
  );
}