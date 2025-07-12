import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  User,
  Eye,
  Edit3,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Award
} from 'lucide-react';

interface ApplicantProfileModalProps {
  applicant: any;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onScheduleInterview: () => void;
  onSendMessage: () => void;
}

const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({
  applicant,
  onClose,
  onUpdateStatus,
  onScheduleInterview,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(applicant.rating || 0);
  const [notes, setNotes] = useState(applicant.notes || '');

  const mockApplicantData = {
    id: applicant.id || 1,
    name: applicant.name || 'Sarah Wijayanti',
    email: applicant.email || 'sarah.wijaya@email.com',
    phone: '+62812-3456-7890',
    address: 'Jakarta Selatan, Indonesia',
    position: applicant.position || 'Sales Officer Chaneling',
    appliedDate: '2025-01-10',
    status: applicant.status || 'new',
    source: 'Website Karir',
    experience: '3 tahun di bidang sales dan marketing',
    education: 'S1 Manajemen - Universitas Indonesia (2019)',
    skills: ['Sales Management', 'Customer Relationship', 'Digital Marketing', 'Data Analysis', 'Communication'],
    languages: ['Bahasa Indonesia (Native)', 'English (Fluent)', 'Mandarin (Basic)'],
    expectedSalary: 'Rp 7.000.000 - 9.000.000',
    availableDate: '2025-02-01',
    portfolio: 'portfolio.pdf',
    cv: 'sarah_wijaya_cv.pdf',
    coverLetter: `Saya sangat tertarik dengan posisi Sales Officer Chaneling di SWAPRO karena pengalaman saya di bidang sales dan passion untuk membangun relationship dengan client. Dengan pengalaman 3 tahun di industri keuangan, saya yakin dapat berkontribusi positif untuk tim.`,
    workHistory: [
      {
        company: 'PT Bank Mandiri',
        position: 'Sales Executive',
        duration: '2022 - 2024',
        description: 'Bertanggung jawab atas penjualan produk kredit dan mencapai target 120% selama 2 tahun berturut-turut.'
      },
      {
        company: 'PT Astra Credit',
        position: 'Marketing Associate',
        duration: '2020 - 2022',
        description: 'Mengembangkan strategi marketing untuk produk pembiayaan dan meningkatkan customer acquisition 40%.'
      }
    ],
    assessments: [
      { name: 'Sales Aptitude Test', score: 85, status: 'completed', date: '2025-01-11' },
      { name: 'Communication Skills', score: 90, status: 'completed', date: '2025-01-11' },
      { name: 'Cultural Fit Assessment', score: null, status: 'pending', date: null }
    ],
    interviews: [
      { type: 'Phone Screening', date: '2025-01-12', status: 'scheduled', interviewer: 'HR Team' },
      { type: 'Technical Interview', date: null, status: 'pending', interviewer: 'Sales Manager' }
    ],
    timeline: [
      { event: 'Application Submitted', date: '2025-01-10 14:30', status: 'completed' },
      { event: 'Application Reviewed', date: '2025-01-11 09:15', status: 'completed' },
      { event: 'Assessment Completed', date: '2025-01-11 16:45', status: 'completed' },
      { event: 'Phone Screening Scheduled', date: '2025-01-12 10:00', status: 'upcoming' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={14} />;
      case 'review': return <Eye size={14} />;
      case 'interview': return <Calendar size={14} />;
      case 'accepted': return <CheckCircle size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Informasi Pribadi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-700">{mockApplicantData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-700">{mockApplicantData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-gray-700">{mockApplicantData.address}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700">Melamar: {new Date(mockApplicantData.appliedDate).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={16} className="text-gray-400" />
              <span className="text-gray-700">Sumber: {mockApplicantData.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700">Mulai kerja: {new Date(mockApplicantData.availableDate).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Rating</span>
            <Award size={16} className="text-yellow-500" />
          </div>
          {renderStars(rating, true)}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pengalaman</span>
            <Briefcase size={16} className="text-blue-500" />
          </div>
          <p className="font-semibold text-gray-900">3 Tahun</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Ekspektasi Gaji</span>
            <span className="text-green-600">💰</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{mockApplicantData.expectedSalary}</p>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          Cover Letter
        </h3>
        <p className="text-gray-700 leading-relaxed">{mockApplicantData.coverLetter}</p>
      </div>

      {/* Skills */}
      <div className="bg-green-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Keahlian</h3>
        <div className="flex flex-wrap gap-2">
          {mockApplicantData.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Bahasa</h4>
          <div className="flex flex-wrap gap-2">
            {mockApplicantData.languages.map((language, index) => (
              <span key={index} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkHistory = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          Pendidikan
        </h3>
        <p className="text-gray-700">{mockApplicantData.education}</p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Riwayat Pekerjaan
        </h3>
        <div className="space-y-4">
          {mockApplicantData.workHistory.map((work, index) => (
            <div key={index} className="border-l-4 border-blue-400 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{work.position}</h4>
                <span className="text-sm text-gray-600">{work.duration}</span>
              </div>
              <p className="text-blue-600 font-medium mb-2">{work.company}</p>
              <p className="text-gray-700 text-sm">{work.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-4">
      {mockApplicantData.assessments.map((assessment, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{assessment.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {assessment.status === 'completed' ? 'Selesai' : 'Pending'}
            </span>
          </div>
          {assessment.score && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Skor</span>
                <span className="font-semibold text-gray-900">{assessment.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                  style={{ width: `${assessment.score}%` }}
                ></div>
              </div>
            </div>
          )}
          {assessment.date && (
            <p className="text-sm text-gray-600">
              Diselesaikan: {new Date(assessment.date).toLocaleDateString('id-ID')}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-4">
      {mockApplicantData.timeline.map((event, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className={`w-3 h-3 rounded-full mt-2 ${
            event.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{event.event}</h4>
            <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString('id-ID')}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {event.status === 'completed' ? 'Selesai' : 'Mendatang'}
          </span>
        </div>
      ))}
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
        placeholder="Tambahkan catatan tentang kandidat ini..."
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
        Simpan Catatan
      </button>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Pengalaman', icon: Briefcase },
    { id: 'assessments', label: 'Assessment', icon: Award },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'notes', label: 'Catatan', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{mockApplicantData.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{mockApplicantData.name}</h2>
                <p className="text-blue-100">{mockApplicantData.position}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(mockApplicantData.status)}`}>
                    {getStatusIcon(mockApplicantData.status)}
                    {mockApplicantData.status.charAt(0).toUpperCase() + mockApplicantData.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onSendMessage}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                title="Send Message"
              >
                <MessageCircle size={20} />
              </button>
              <button
                onClick={onScheduleInterview}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                title="Schedule Interview"
              >
                <Calendar size={20} />
              </button>
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                <Download size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'experience' && renderWorkHistory()}
          {activeTab === 'assessments' && renderAssessments()}
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'notes' && renderNotes()}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select 
                value={mockApplicantData.status}
                onChange={(e) => onUpdateStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">Baru</option>
                <option value="review">Review</option>
                <option value="interview">Interview</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileModal;