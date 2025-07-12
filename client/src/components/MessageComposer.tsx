import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Send, 
  Users, 
  X, 
  FileText, 
  Calendar,
  Phone,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';

interface MessageComposerProps {
  type: 'email' | 'sms' | 'whatsapp';
  onClose: () => void;
  onSend: (data: any) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ type, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipientType, setRecipientType] = useState<'manual' | 'group' | 'all'>('manual');
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const templates = {
    email: [
      { id: 1, name: 'Interview Invitation', subject: 'Undangan Interview - {jobTitle}', content: 'Selamat! Kami mengundang Anda untuk interview posisi {jobTitle} pada {date} pukul {time}.' },
      { id: 2, name: 'Application Received', subject: 'Aplikasi Anda Telah Diterima', content: 'Terima kasih atas lamaran Anda untuk posisi {jobTitle}. Kami akan meninjau aplikasi Anda.' },
      { id: 3, name: 'Job Offer', subject: 'Congratulations! Job Offer', content: 'Selamat! Kami senang menawarkan posisi {jobTitle} kepada Anda.' }
    ],
    sms: [
      { id: 1, name: 'Interview Reminder', content: 'Reminder: Interview Anda untuk posisi {jobTitle} besok jam {time}. Lokasi: {location}' },
      { id: 2, name: 'Application Update', content: 'Update: Status aplikasi Anda untuk {jobTitle} telah diperbarui. Cek email untuk detail.' },
      { id: 3, name: 'Quick Confirmation', content: 'Mohon konfirmasi kehadiran interview Anda besok. Reply Y untuk Ya, N untuk reschedule.' }
    ],
    whatsapp: [
      { id: 1, name: 'Welcome Message', content: 'Halo! Selamat datang di SWAPRO. Terima kasih sudah melamar untuk posisi {jobTitle}. Kami akan segera menghubungi Anda.' },
      { id: 2, name: 'Interview Invitation', content: 'Selamat! Anda dipilih untuk interview posisi {jobTitle}. Kapan waktu yang cocok untuk Anda minggu ini?' },
      { id: 3, name: 'Offer Congratulations', content: 'Selamat! Kami senang menawarkan posisi {jobTitle} kepada Anda. Silakan hubungi kami untuk membahas detail lebih lanjut.' }
    ]
  };

  const candidateGroups = [
    { id: 'all', name: 'Semua Kandidat', count: 156 },
    { id: 'new', name: 'Kandidat Baru', count: 23 },
    { id: 'interview', name: 'Menunggu Interview', count: 12 },
    { id: 'offer', name: 'Dapat Offer', count: 8 },
    { id: 'sales', name: 'Posisi Sales', count: 45 },
    { id: 'marketing', name: 'Posisi Marketing', count: 34 }
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id.toString());
    if (type === 'email' && template.subject) {
      setSubject(template.subject);
    }
    setMessage(template.content);
  };

  const handleSend = () => {
    const data = {
      type,
      subject: type === 'email' ? subject : undefined,
      message,
      recipients,
      recipientType,
      scheduleType,
      scheduledDate: scheduleType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: scheduleType === 'scheduled' ? scheduledTime : undefined,
      template: selectedTemplate
    };
    onSend(data);
  };

  const getIcon = () => {
    switch (type) {
      case 'email': return <Mail size={24} className="text-blue-600" />;
      case 'sms': return <MessageSquare size={24} className="text-green-600" />;
      case 'whatsapp': return <MessageCircle size={24} className="text-purple-600" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'email': return 'Compose Email';
      case 'sms': return 'Compose SMS';
      case 'whatsapp': return 'Compose WhatsApp';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'email': return 'from-blue-500 to-blue-600';
      case 'sms': return 'from-green-500 to-green-600';
      case 'whatsapp': return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${getColor()} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{getTitle()}</h2>
                <p className="text-white/80">Buat dan kirim pesan ke kandidat</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Template (Opsional)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {templates[type].map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTemplate === template.id.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-gray-600" />
                    <span className="font-semibold text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Penerima</label>
            <div className="space-y-4">
              {/* Recipient Type Selection */}
              <div className="flex gap-4">
                <button
                  onClick={() => setRecipientType('manual')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                    recipientType === 'manual'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Users size={16} />
                  Manual
                </button>
                <button
                  onClick={() => setRecipientType('group')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                    recipientType === 'group'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Users size={16} />
                  Grup
                </button>
                <button
                  onClick={() => setRecipientType('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                    recipientType === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Users size={16} />
                  Semua
                </button>
              </div>

              {/* Manual Recipients */}
              {recipientType === 'manual' && (
                <div>
                  <textarea
                    placeholder={`Masukkan ${type === 'email' ? 'email' : 'nomor telepon'} (pisahkan dengan koma atau enter)`}
                    value={recipients.join('\n')}
                    onChange={(e) => setRecipients(e.target.value.split(/[,\n]/).map(r => r.trim()).filter(r => r))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    rows={4}
                  />
                </div>
              )}

              {/* Group Selection */}
              {recipientType === 'group' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {candidateGroups.map((group) => (
                    <button
                      key={group.id}
                      className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all text-left"
                    >
                      <div className="font-semibold text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600">{group.count} kandidat</div>
                    </button>
                  ))}
                </div>
              )}

              {/* All Recipients Info */}
              {recipientType === 'all' && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800 font-semibold">Pesan akan dikirim ke semua 156 kandidat</p>
                  <p className="text-blue-600 text-sm">Pastikan pesan sudah sesuai sebelum mengirim</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject (Email only) */}
          {type === 'email' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masukkan subject email"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Pesan
              {type === 'sms' && (
                <span className="text-sm text-gray-500 ml-2">
                  ({message.length}/160 karakter)
                </span>
              )}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Tulis ${type === 'whatsapp' ? 'pesan WhatsApp' : type === 'sms' ? 'pesan SMS' : 'email'} Anda di sini...`}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
              rows={type === 'email' ? 8 : 4}
              maxLength={type === 'sms' ? 160 : undefined}
            />
            <div className="mt-2 text-xs text-gray-500">
              Gunakan variabel: {'{jobTitle}, {date}, {time}, {location}, {candidateName}'}
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Jadwal Pengiriman</label>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setScheduleType('now')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  scheduleType === 'now'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Send size={16} />
                Kirim Sekarang
              </button>
              <button
                onClick={() => setScheduleType('scheduled')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  scheduleType === 'scheduled'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar size={16} />
                Jadwalkan
              </button>
            </div>

            {scheduleType === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                <Eye size={16} />
              </button>
              <span className="text-sm text-gray-600">Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSend}
                disabled={!message || (type === 'email' && !subject) || recipients.length === 0}
                className={`px-6 py-3 bg-gradient-to-r ${getColor()} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <Send size={16} />
                {scheduleType === 'now' ? 'Kirim Sekarang' : 'Jadwalkan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;