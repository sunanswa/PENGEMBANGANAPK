import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Edit, 
  FileText, 
  Upload, 
  Check, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Eye, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Download,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  profileImage: string;
  bio: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  size: string;
}

export default function SimpleProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    birthDate: '1995-05-15',
    profileImage: '',
    bio: 'Experienced software developer with passion for creating innovative solutions.'
  });

  const profileCompletion = 85;
  const profileViews = 156;

  const documents: Document[] = [
    {
      id: '1',
      name: 'CV_John_Doe_2025.pdf',
      type: 'CV/Resume',
      status: 'verified',
      uploadDate: '2025-07-10',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'KTP_Scan.jpg',
      type: 'KTP',
      status: 'verified',
      uploadDate: '2025-07-08',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Ijazah_S1.pdf',
      type: 'Ijazah',
      status: 'pending',
      uploadDate: '2025-07-12',
      size: '3.1 MB'
    },
    {
      id: '4',
      name: 'SKCK.pdf',
      type: 'SKCK',
      status: 'rejected',
      uploadDate: '2025-07-05',
      size: '1.2 MB'
    }
  ];

  const experiences = [
    {
      id: 1,
      company: 'PT Tech Solutions',
      position: 'Senior Software Developer',
      period: 'Jan 2022 - Present',
      description: 'Lead development team in creating web applications using React and Node.js'
    },
    {
      id: 2,
      company: 'PT Digital Corp',
      position: 'Software Developer',
      period: 'Jun 2020 - Dec 2021',
      description: 'Developed and maintained multiple client projects using various technologies'
    }
  ];

  const education = [
    {
      id: 1,
      institution: 'Universitas Indonesia',
      degree: 'S1 Teknik Informatika',
      period: '2016 - 2020',
      gpa: '3.8'
    }
  ];

  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'SQL', level: 85 }
  ];

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Completion Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Kelengkapan Profil</h3>
            <p className="text-blue-100 text-sm">Tingkatkan visibilitas Anda</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <div className="text-sm text-blue-100">Lengkap</div>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-2 mb-3">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-blue-100">
          <span>Profil Anda dilihat {profileViews} kali minggu ini</span>
          <Eye className="h-4 w-4" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? 'Simpan' : 'Edit'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</h4>
              <p className="text-gray-900 dark:text-white">{profileData.bio}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Lamaran</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Interview</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">{profileViews}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">8</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Saved Jobs</div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Dokumen</h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">Drag & drop file atau klik untuk upload</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Pilih File
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dokumen Saya</h3>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  <span className="capitalize">{doc.status}</span>
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Download className="h-4 w-4" />
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
      {/* Work Experience */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pengalaman Kerja</h3>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Tambah
          </button>
        </div>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period}</p>
                  <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pendidikan</h3>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Tambah
          </button>
        </div>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-green-600 dark:text-green-400 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period} • GPA: {edu.gpa}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Keahlian</h3>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Tambah
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pengaturan Akun</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Notifikasi Email</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Terima update via email</p>
              </div>
            </div>
            <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Privasi Profil</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kontrol siapa yang bisa melihat profil</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Bantuan & Support</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">FAQ dan contact support</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">Keluar</h4>
                <p className="text-sm text-red-500 dark:text-red-400">Logout dari akun Anda</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profil Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi dan pengaturan akun
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Kelengkapan</div>
          <div className="text-lg font-bold text-blue-600">{profileCompletion}%</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'documents', label: 'Dokumen', icon: FileText },
          { id: 'experience', label: 'Pengalaman', icon: Briefcase },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'documents' && renderDocuments()}
      {activeTab === 'experience' && renderExperience()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
}