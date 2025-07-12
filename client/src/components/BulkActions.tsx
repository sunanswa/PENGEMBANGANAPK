import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Users,
  ChevronDown,
  Send,
  FileSpreadsheet,
  Archive
} from 'lucide-react';

interface BulkActionsProps {
  selectedApplicants: string[];
  totalSelected: number;
  onAction: (action: string, data?: any) => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedApplicants,
  totalSelected,
  onAction,
  onClearSelection
}) => {
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [showBulkStatusUpdate, setShowBulkStatusUpdate] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    { value: 'new', label: 'Baru', color: 'text-blue-600' },
    { value: 'review', label: 'Review', color: 'text-orange-600' },
    { value: 'interview', label: 'Interview', color: 'text-purple-600' },
    { value: 'accepted', label: 'Diterima', color: 'text-green-600' },
    { value: 'rejected', label: 'Ditolak', color: 'text-red-600' },
    { value: 'on-hold', label: 'On Hold', color: 'text-yellow-600' }
  ];

  const emailTemplates = [
    {
      id: 'interview-invitation',
      name: 'Undangan Interview',
      subject: 'Undangan Interview - {{position}}',
      content: `Halo {{name}},

Terima kasih atas minat Anda untuk bergabung dengan SWAPRO. Kami tertarik dengan profil Anda dan ingin mengundang Anda untuk interview.

Detail Interview:
- Posisi: {{position}}
- Tanggal: [Akan dijadwalkan]
- Waktu: [Akan dijadwalkan]
- Lokasi: [Akan dikonfirmasi]

Mohon konfirmasi ketersediaan Anda dalam 2x24 jam.

Salam,
Tim HR SWAPRO`
    },
    {
      id: 'application-received',
      name: 'Konfirmasi Aplikasi Diterima',
      subject: 'Aplikasi Anda Telah Diterima - {{position}}',
      content: `Halo {{name}},

Terima kasih telah melamar posisi {{position}} di SWAPRO. 

Aplikasi Anda telah kami terima dan saat ini sedang dalam proses review. Tim kami akan menghubungi Anda dalam 5-7 hari kerja untuk update selanjutnya.

Salam,
Tim HR SWAPRO`
    },
    {
      id: 'rejection-letter',
      name: 'Pemberitahuan Penolakan',
      subject: 'Update Status Aplikasi - {{position}}',
      content: `Halo {{name}},

Terima kasih atas minat Anda untuk bergabung dengan SWAPRO dan waktu yang telah Anda luangkan dalam proses rekrutmen kami.

Setelah melalui proses seleksi yang ketat, kami memutuskan untuk melanjutkan dengan kandidat lain yang lebih sesuai dengan kebutuhan spesifik posisi ini.

Kami menghargai kualitas dan pengalaman yang Anda miliki. Aplikasi Anda akan kami simpan untuk peluang yang lebih sesuai di masa mendatang.

Salam,
Tim HR SWAPRO`
    }
  ];

  const handleBulkEmail = () => {
    if (!emailSubject.trim() || !emailTemplate.trim()) {
      alert('Subject dan isi email harus diisi');
      return;
    }

    onAction('bulk-email', {
      applicantIds: selectedApplicants,
      subject: emailSubject,
      content: emailTemplate
    });

    setShowBulkEmail(false);
    setEmailSubject('');
    setEmailTemplate('');
  };

  const handleBulkStatusUpdate = () => {
    if (!newStatus) {
      alert('Pilih status baru');
      return;
    }

    onAction('bulk-status-update', {
      applicantIds: selectedApplicants,
      status: newStatus
    });

    setShowBulkStatusUpdate(false);
    setNewStatus('');
  };

  const handleTemplateSelect = (template: any) => {
    setEmailSubject(template.subject);
    setEmailTemplate(template.content);
  };

  if (totalSelected === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {totalSelected}
            </div>
            <span className="font-medium text-gray-900">
              {totalSelected} pelamar dipilih
            </span>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkEmail(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
              title="Kirim Email"
            >
              <Mail size={16} />
              Email
            </button>

            <button
              onClick={() => setShowBulkStatusUpdate(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
              title="Update Status"
            >
              <CheckCircle size={16} />
              Status
            </button>

            <button
              onClick={() => onAction('bulk-export')}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium"
              title="Export Data"
            >
              <Download size={16} />
              Export
            </button>

            <button
              onClick={() => onAction('bulk-schedule-interview')}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-medium"
              title="Jadwalkan Interview"
            >
              <Calendar size={16} />
              Interview
            </button>

            <div className="h-6 w-px bg-gray-300"></div>

            <button
              onClick={onClearSelection}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm font-medium"
              title="Clear Selection"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Email Modal */}
      {showBulkEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Kirim Email Massal</h2>
                  <p className="text-gray-600 mt-1">Kirim email ke {totalSelected} pelamar yang dipilih</p>
                </div>
                <button
                  onClick={() => setShowBulkEmail(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Template Email (Opsional)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="Masukkan subject email..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan {`{name}`} untuk nama pelamar dan {`{position}`} untuk posisi
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Isi Email <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="Tulis isi email..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables yang tersedia: {`{name}`}, {`{position}`}, {`{email}`}, {`{phone}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBulkEmail(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleBulkEmail}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Kirim Email ke {totalSelected} Pelamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Status Update Modal */}
      {showBulkStatusUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
                  <p className="text-gray-600 mt-1">Update status {totalSelected} pelamar</p>
                </div>
                <button
                  onClick={() => setShowBulkStatusUpdate(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Pilih Status Baru <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <label key={status.value} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={newStatus === status.value}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBulkStatusUpdate(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleBulkStatusUpdate}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;