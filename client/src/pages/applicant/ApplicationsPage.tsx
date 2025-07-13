import React, { useState } from 'react';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Eye, 
  Filter, 
  MapPin, 
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'review' | 'interview' | 'accepted' | 'rejected';
  lastUpdate: string;
  notes?: string;
  interviewDate?: string;
  salary?: string;
}

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Mock data untuk demonstrasi
  const applications: Application[] = [
    {
      id: '1',
      jobTitle: 'Sales Promotion Boy (SPB)',
      company: 'PT BESS TREND INDONESIA',
      location: 'Jakarta Selatan, DKI Jakarta',
      appliedDate: '2025-01-10',
      status: 'interview',
      lastUpdate: '2025-01-12',
      interviewDate: '2025-01-15',
      salary: 'Rp 2.500.000 - Rp 3.800.000',
      notes: 'Interview telah dijadwalkan untuk hari Rabu'
    },
    {
      id: '2', 
      jobTitle: 'Marketing Executive',
      company: 'PT SWAPRO',
      location: 'Jakarta Pusat, DKI Jakarta',
      appliedDate: '2025-01-08',
      status: 'review',
      lastUpdate: '2025-01-11',
      salary: 'Rp 4.000.000 - Rp 5.500.000'
    },
    {
      id: '3',
      jobTitle: 'Customer Service Representative',
      company: 'PT DIGITAL SOLUTIONS',
      location: 'Bandung, Jawa Barat',
      appliedDate: '2025-01-05',
      status: 'accepted',
      lastUpdate: '2025-01-10',
      salary: 'Rp 3.200.000 - Rp 4.000.000',
      notes: 'Selamat! Anda diterima untuk posisi ini'
    },
    {
      id: '4',
      jobTitle: 'Administrative Assistant',
      company: 'PT BERKAH JAYA',
      location: 'Surabaya, Jawa Timur',
      appliedDate: '2025-01-03',
      status: 'rejected',
      lastUpdate: '2025-01-09',
      notes: 'Terima kasih atas minat Anda. Kualifikasi tidak sesuai dengan kebutuhan saat ini.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'review': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'interview': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'interview': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'review': return 'Direview';
      case 'interview': return 'Interview';
      case 'accepted': return 'Diterima';
      case 'rejected': return 'Ditolak';
      default: return 'Unknown';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    review: applications.filter(app => app.status === 'review').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SwaprosHeader 
        title="Riwayat Lamaran" 
        subtitle="Pantau status lamaran pekerjaan Anda"
        showSearch={false}
        userRole="applicant"
      />
      
      <div className="p-4 pb-20">
        {/* Revolutionary Status Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`card-enhanced p-4 text-center transition-all duration-500 animate-scale-in magnetic ripple-effect ${
                statusFilter === status 
                ? 'glow-purple border-2 border-purple-500 text-purple-700 scale-105' 
                : 'text-gray-700 hover:glow-orange hover:scale-105'
              }`}
            >
              <div className="text-2xl font-black">{count}</div>
              <div className="text-xs capitalize font-bold">
                {status === 'all' ? 'Semua' : getStatusText(status)}
              </div>
              {statusFilter === status && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Ultra Modern Search and Filter */}
        <div className="card-enhanced p-6 mb-8 tilt-effect magnetic">
          <div className="flex gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-all group-hover:scale-110" />
              <input
                type="text"
                placeholder="Cari berdasarkan posisi atau perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 glass-effect border-2 border-white/30 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:glow-purple transition-all duration-500 font-medium text-gray-700"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center ripple-effect">
                  <span className="text-white text-xs font-bold">🔍</span>
                </div>
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="review">Direview</option>
              <option value="interview">Interview</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada lamaran ditemukan</h3>
              <p className="text-gray-500">Coba ubah kriteria pencarian atau filter Anda</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div 
                key={app.id}
                className="card-enhanced p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                        {app.jobTitle}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700">{app.company}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin size={12} />
                        <span>{app.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {getStatusText(app.status)}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Dilamar: {new Date(app.appliedDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {app.salary && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-green-600">{app.salary}</span>
                  </div>
                )}

                {app.interviewDate && app.status === 'interview' && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">
                        Interview: {new Date(app.interviewDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {app.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {app.notes}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Update terakhir: {new Date(app.lastUpdate).toLocaleDateString('id-ID')}
                  </span>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}