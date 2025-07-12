import React, { useState } from 'react';
import { 
  X, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield, 
  FileCheck, 
  AlertCircle,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface StatusUpdateModalProps {
  applicant: any;
  currentStatus: string;
  onClose: () => void;
  onUpdateStatus: (status: string, notes?: string, slikData?: any) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  applicant,
  currentStatus,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [showSlikCheck, setShowSlikCheck] = useState(false);
  const [slikStatus, setSlikStatus] = useState<'pending' | 'approved' | 'rejected' | 'requires_review'>('pending');
  const [slikScore, setSlikScore] = useState<number>(0);
  const [slikRiskLevel, setSlikRiskLevel] = useState<'low' | 'medium' | 'high' | 'very_high'>('low');
  const [slikFindings, setSlikFindings] = useState<string[]>([]);
  const [slikDetails, setSlikDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'Pelamar Baru', color: 'bg-blue-100 text-blue-800', icon: User },
    { value: 'reviewing', label: 'Sedang Direview', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800', icon: FileCheck },
    { value: 'hired', label: 'Diterima', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: X },
  ];

  const riskLevelColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100', 
    high: 'text-orange-600 bg-orange-100',
    very_high: 'text-red-600 bg-red-100'
  };

  const riskLevelIcons = {
    low: TrendingUp,
    medium: Minus,
    high: TrendingDown,
    very_high: AlertTriangle
  };

  const handleSlikCheck = async () => {
    setIsProcessing(true);
    
    // Simulasi SLIK check
    setTimeout(() => {
      const mockSlikData = {
        score: Math.floor(Math.random() * 850) + 300,
        riskLevel: ['low', 'medium', 'high', 'very_high'][Math.floor(Math.random() * 4)],
        findings: [
          'Riwayat kredit lancar 2 tahun terakhir',
          'Tidak ada tunggakan aktif',
          'Rasio kredit terhadap pendapatan: 45%'
        ],
        status: Math.random() > 0.3 ? 'approved' : 'requires_review'
      };
      
      setSlikScore(mockSlikData.score);
      setSlikRiskLevel(mockSlikData.riskLevel as any);
      setSlikFindings(mockSlikData.findings);
      setSlikStatus(mockSlikData.status as any);
      setSlikDetails(`Skor SLIK: ${mockSlikData.score}\nTingkat Risiko: ${mockSlikData.riskLevel}\nStatus: ${mockSlikData.status}`);
      setIsProcessing(false);
    }, 2000);
  };

  const handleSubmit = () => {
    const slikData = showSlikCheck ? {
      status: slikStatus,
      score: slikScore,
      riskLevel: slikRiskLevel,
      findings: slikFindings,
      details: slikDetails
    } : null;

    onUpdateStatus(selectedStatus, notes, slikData);
  };

  const selectedStatusInfo = statusOptions.find(option => option.value === selectedStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Update Status Pelamar</h3>
            <p className="text-gray-600 mt-1">{applicant.name} - {applicant.position}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Status Saat Ini</h4>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusOptions.find(s => s.value === currentStatus)?.color}`}>
              {React.createElement(statusOptions.find(s => s.value === currentStatus)?.icon || User, { size: 16 })}
              {statusOptions.find(s => s.value === currentStatus)?.label}
            </span>
          </div>

          {/* New Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Status Baru <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`text-left p-4 border-2 rounded-xl transition-all ${
                      selectedStatus === option.value
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600">
                          {option.value === 'new' && 'Pelamar baru yang belum direview'}
                          {option.value === 'reviewing' && 'Sedang dalam proses review dan evaluasi'}
                          {option.value === 'interview' && 'Dijadwalkan untuk tahap interview'}
                          {option.value === 'hired' && 'Diterima dan akan bergabung'}
                          {option.value === 'rejected' && 'Tidak lolos seleksi'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keterangan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              placeholder={
                selectedStatus === 'interview' 
                  ? 'Misal: Interview dijadwalkan di kantor pusat lantai 5, ruang meeting A, tanggal 15 Januari 2025 pukul 10:00 WIB'
                  : selectedStatus === 'rejected'
                  ? 'Misal: Tidak memenuhi kualifikasi pengalaman minimal 3 tahun, atau kurang sesuai dengan kultur perusahaan'
                  : selectedStatus === 'hired'
                  ? 'Misal: Memenuhi semua kriteria, start date 1 Februari 2025, posisi di cabang Jakarta Selatan'
                  : 'Tambahkan catatan tambahan jika diperlukan...'
              }
            />
          </div>

          {/* SLIK Check untuk status hired */}
          {selectedStatus === 'hired' && (
            <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cek SLIK (Kredit Bureau)</h4>
                    <p className="text-sm text-gray-600">Wajib untuk karyawan yang diterima</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSlikCheck(!showSlikCheck)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    showSlikCheck 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border-2 border-blue-600'
                  }`}
                >
                  {showSlikCheck ? 'Sembunyikan' : 'Lakukan Cek SLIK'}
                </button>
              </div>

              {showSlikCheck && (
                <div className="space-y-4 border-t border-blue-200 pt-4">
                  {slikStatus === 'pending' ? (
                    <div className="text-center py-6">
                      <button
                        onClick={handleSlikCheck}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                      >
                        <CreditCard size={18} />
                        {isProcessing ? 'Memproses Cek SLIK...' : 'Mulai Cek SLIK'}
                      </button>
                      {isProcessing && (
                        <div className="mt-4">
                          <div className="animate-spin mx-auto w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          <p className="text-sm text-gray-600 mt-2">Mengakses database SLIK...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* SLIK Results */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Skor SLIK</h5>
                          <div className="text-2xl font-bold text-gray-900">{slikScore}</div>
                          <p className="text-sm text-gray-600">Range: 300-850</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Tingkat Risiko</h5>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${riskLevelColors[slikRiskLevel]}`}>
                            {React.createElement(riskLevelIcons[slikRiskLevel], { size: 16 })}
                            {slikRiskLevel.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Findings */}
                      <div className="bg-white rounded-xl p-4">
                        <h5 className="font-semibold text-gray-700 mb-3">Temuan SLIK</h5>
                        <ul className="space-y-2">
                          {slikFindings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Status & Notes */}
                      <div className="bg-white rounded-xl p-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Status SLIK</h5>
                        <select
                          value={slikStatus}
                          onChange={(e) => setSlikStatus(e.target.value as any)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="approved">Disetujui</option>
                          <option value="requires_review">Perlu Review Manual</option>
                          <option value="rejected">Ditolak</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;