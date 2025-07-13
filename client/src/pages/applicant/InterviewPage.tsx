import React, { useState } from 'react';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Phone,
  Briefcase,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Building2,
  ArrowRight,
  Star
} from 'lucide-react';

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'onsite' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewer: string;
  interviewerRole: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  preparationTips?: string[];
}

export default function InterviewPage() {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data untuk demonstrasi
  const interviews: Interview[] = [
    {
      id: '1',
      jobTitle: 'Sales Promotion Boy (SPB)',
      company: 'PT BESS TREND INDONESIA',
      date: '2025-01-15',
      time: '14:00',
      duration: '60 menit',
      type: 'video',
      status: 'scheduled',
      interviewer: 'Sarah Johnson',
      interviewerRole: 'HR Manager',
      meetingLink: 'https://zoom.us/j/123456789',
      notes: 'Pastikan koneksi internet stabil dan siapkan laptop/smartphone',
      preparationTips: [
        'Pelajari profil perusahaan dan produk yang dipromosikan',
        'Siapkan contoh pengalaman sales atau customer service',
        'Dress code: business casual',
        'Siapkan pertanyaan tentang job description dan benefit'
      ]
    },
    {
      id: '2',
      jobTitle: 'Marketing Executive',
      company: 'PT SWAPRO',
      date: '2025-01-17',
      time: '10:30',
      duration: '45 menit',
      type: 'onsite',
      status: 'scheduled',
      interviewer: 'Ahmad Rizky',
      interviewerRole: 'Marketing Director',
      location: 'Jl. Sudirman No. 123, Jakarta Pusat',
      preparationTips: [
        'Bawa portfolio marketing campaign yang pernah dibuat',
        'Pelajari strategi marketing SWAPRO yang sudah berjalan',
        'Siapkan ide-ide fresh untuk campaign baru',
        'Datang 15 menit sebelum jadwal interview'
      ]
    },
    {
      id: '3',
      jobTitle: 'Customer Service Representative',
      company: 'PT DIGITAL SOLUTIONS',
      date: '2025-01-10',
      time: '09:00',
      duration: '30 menit',
      type: 'phone',
      status: 'completed',
      interviewer: 'Maya Sari',
      interviewerRole: 'Team Lead Customer Service',
      notes: 'Interview berjalan lancar, menunggu hasil selanjutnya'
    }
  ];

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-500" />;
      case 'onsite': return <MapPin className="h-4 w-4 text-green-500" />;
      case 'phone': return <Phone className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInterviewTypeText = (type: string) => {
    switch (type) {
      case 'video': return 'Video Call';
      case 'onsite': return 'On-site';
      case 'phone': return 'Phone Call';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Terjadwal';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Unknown';
    }
  };

  const upcomingInterviews = interviews.filter(interview => interview.status === 'scheduled');
  const completedInterviews = interviews.filter(interview => interview.status === 'completed');

  const InterviewCard = ({ interview }: { interview: Interview }) => (
    <div 
      className="card-enhanced p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedInterview(interview)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <Building2 size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
              {interview.jobTitle}
            </h3>
            <p className="text-sm font-semibold text-gray-700">{interview.company}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar size={12} />
                <span>{new Date(interview.date).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={12} />
                <span>{interview.time}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(interview.status)}`}>
            {getStatusIcon(interview.status)}
            {getStatusText(interview.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          {getInterviewTypeIcon(interview.type)}
          <span className="text-sm font-medium">{getInterviewTypeText(interview.type)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-gray-500" />
          <span className="text-sm text-gray-600">{interview.duration}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={14} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">{interview.interviewer}</span>
        </div>
        <p className="text-xs text-gray-600">{interview.interviewerRole}</p>
      </div>

      {interview.location && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={12} />
          <span>{interview.location}</span>
        </div>
      )}

      {interview.meetingLink && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
          <Video size={12} />
          <span>Link meeting tersedia</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Durasi: {interview.duration}
        </span>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
          Lihat Detail <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );

  const PreparationChecklist = ({ interview }: { interview: Interview }) => (
    <div className="card-enhanced p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Persiapan Interview</h3>
      
      {interview.preparationTips && (
        <div className="space-y-3">
          {interview.preparationTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 border-2 border-purple-500 rounded mt-0.5 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded"></div>
              </div>
              <span className="text-sm text-gray-700 flex-1">{tip}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">Tips Umum Interview:</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Datang 10-15 menit sebelum jadwal</li>
          <li>• Siapkan pertanyaan untuk interviewer</li>
          <li>• Bawa dokumen yang diperlukan</li>
          <li>• Berpakaian rapi dan profesional</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SwaprosHeader 
        title="Interview & Wawancara" 
        subtitle="Kelola jadwal interview dan persiapan Anda"
        showSearch={false}
        userRole="applicant"
      />
      
      <div className="p-4 pb-20">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 rounded-md transition-colors font-semibold ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Upcoming ({upcomingInterviews.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-md transition-colors font-semibold ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Riwayat ({completedInterviews.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {activeTab === 'upcoming' ? (
                upcomingInterviews.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada interview terjadwal</h3>
                    <p className="text-gray-500">Interview Anda akan muncul di sini</p>
                  </div>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))
                )
              ) : (
                completedInterviews.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada riwayat interview</h3>
                    <p className="text-gray-500">Riwayat interview Anda akan muncul di sini</p>
                  </div>
                ) : (
                  completedInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))
                )
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedInterview && activeTab === 'upcoming' && (
              <PreparationChecklist interview={selectedInterview} />
            )}

            {/* Quick Stats */}
            <div className="card-enhanced p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Interview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{upcomingInterviews.length}</div>
                  <div className="text-sm text-gray-600">Terjadwal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedInterviews.length}</div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card-enhanced p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips Interview</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Riset perusahaan dan posisi yang dilamar</span>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Siapkan contoh pencapaian dan pengalaman</span>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Latihan menjawab pertanyaan umum</span>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Bersiap dengan pertanyaan untuk interviewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}