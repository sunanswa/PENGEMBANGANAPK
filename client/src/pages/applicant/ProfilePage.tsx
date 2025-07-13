import React, { useState } from 'react';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera, 
  Save,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Download,
  Upload,
  CheckCircle
} from 'lucide-react';

interface ProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    profileImage?: string;
  };
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    id: string;
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'verified' | 'pending' | 'rejected';
  }>;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      fullName: 'Ahmad Rizky Pratama',
      email: 'ahmad.rizky@email.com',
      phone: '+62 812-3456-7890',
      dateOfBirth: '1995-06-15',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan'
    },
    education: [
      {
        id: '1',
        degree: 'S1 Manajemen',
        institution: 'Universitas Indonesia',
        year: '2013-2017',
        gpa: '3.45'
      }
    ],
    experience: [
      {
        id: '1',
        position: 'Sales Representative',
        company: 'PT ABC Corp',
        duration: '2020-2022',
        description: 'Mengelola penjualan produk dan layanan kepada klien corporate'
      }
    ],
    skills: ['Komunikasi', 'Sales', 'Microsoft Office', 'Bahasa Inggris'],
    documents: [
      {
        id: '1',
        name: 'CV_Ahmad_Rizky.pdf',
        type: 'CV',
        uploadDate: '2025-01-10',
        status: 'verified'
      },
      {
        id: '2',
        name: 'Ijazah_S1.pdf',
        type: 'Ijazah',
        uploadDate: '2025-01-10',
        status: 'pending'
      },
      {
        id: '3',
        name: 'KTP.pdf',
        type: 'KTP',
        uploadDate: '2025-01-10',
        status: 'verified'
      }
    ]
  });

  const completionPercentage = 85; // Calculate based on filled fields

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <FileText className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentStatusStyle = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Completion */}
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Kelengkapan Profil</h3>
          <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Informasi Personal</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Pendidikan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Pengalaman Kerja</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-500" />
            <span>Sertifikat</span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Informasi Personal</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="btn-swapro-ghost flex items-center gap-2"
          >
            <Edit2 size={16} />
            {isEditing ? 'Batal' : 'Edit'}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-indigo-500">
              <Camera size={14} className="text-indigo-600" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{profileData.personalInfo.fullName}</h2>
            <p className="text-slate-600">Job Seeker</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">Profile Score: 85/100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.personalInfo.fullName}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                />
              ) : (
                <p className="text-slate-800">{profileData.personalInfo.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <p className="text-slate-800">{profileData.personalInfo.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <p className="text-slate-800">{profileData.personalInfo.phone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <p className="text-slate-800">{new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <p className="text-slate-800">{profileData.personalInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all flex items-center gap-2">
              <Save size={16} />
              Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Pendidikan</h3>
          <button className="btn-swapro-outline">
            + Tambah Pendidikan
          </button>
        </div>

        <div className="space-y-4">
          {profileData.education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{edu.degree}</h4>
                    <p className="text-slate-600">{edu.institution}</p>
                    <p className="text-sm text-slate-500">{edu.year}</p>
                    {edu.gpa && <p className="text-sm text-slate-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pengalaman Kerja</h3>
          <button className="btn-swapro-outline">
            + Tambah Pengalaman
          </button>
        </div>

        <div className="space-y-4">
          {profileData.experience.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Keahlian</h3>
          <button className="btn-swapro-outline">
            + Tambah Skill
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-purple-50 to-orange-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="card-enhanced p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Dokumen</h3>
          <button className="btn-swapro-outline flex items-center gap-2">
            <Upload size={16} />
            Upload Dokumen
          </button>
        </div>

        <div className="space-y-4">
          {profileData.documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.type}</p>
                    <p className="text-xs text-gray-500">Upload: {new Date(doc.uploadDate).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getDocumentStatusStyle(doc.status)}`}>
                    {getDocumentStatusIcon(doc.status)}
                    <span className="capitalize">{doc.status}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'experience', label: 'Pengalaman', icon: Briefcase },
    { id: 'documents', label: 'Dokumen', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SwaprosHeader 
        title="Profil Saya" 
        subtitle="Kelola informasi dan dokumen profil Anda"
        showSearch={false}
        userRole="applicant"
      />
      
      <div className="p-4 pb-20">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md transition-colors font-semibold ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'education' && renderEducation()}
        {activeTab === 'experience' && renderExperience()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
}