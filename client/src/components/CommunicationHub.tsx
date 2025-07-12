import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Users, 
  Calendar,
  Bell,
  Phone,
  MessageCircle,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface CommunicationHubProps {
  onClose: () => void;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState<'email' | 'sms' | 'whatsapp'>('email');

  // Fetch data from backend
  const { data: stats } = useQuery({
    queryKey: ['/api/communication/stats'],
    queryFn: () => fetch('/api/communication/stats').then(res => res.json())
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['/api/communication/templates'],
    queryFn: () => fetch('/api/communication/templates').then(res => res.json())
  });

  const { data: messageHistory = [] } = useQuery({
    queryKey: ['/api/communication/history'],
    queryFn: () => fetch('/api/communication/history').then(res => res.json())
  });

  const { data: automationRules = [] } = useQuery({
    queryKey: ['/api/communication/automation'],
    queryFn: () => fetch('/api/communication/automation').then(res => res.json())
  });

  // Use backend data, with fallback for template type mapping
  const emailTemplates = templates.map((template: any) => ({
    ...template,
    type: template.type === 'email' && template.name.includes('Interview') ? 'interview' :
          template.type === 'email' && template.name.includes('Application') ? 'application' :
          template.type === 'email' && template.name.includes('Reminder') ? 'reminder' :
          template.type === 'email' && template.name.includes('Offer') ? 'offer' : 'email',
    lastUsed: template.lastUsed ? new Date(template.lastUsed).toLocaleDateString('id-ID') + ' lalu' : 'Belum pernah'
  }));

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email Terkirim</h3>
              <p className="text-2xl font-bold text-blue-600">{stats?.emailCount || 0}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SMS Terkirim</h3>
              <p className="text-2xl font-bold text-green-600">{stats?.smsCount || 0}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
              <p className="text-2xl font-bold text-purple-600">{stats?.whatsappCount || 0}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Otomatis</h3>
              <p className="text-2xl font-bold text-orange-600">{stats?.successRate || 0}%</p>
              <p className="text-sm text-gray-500">Success rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Pesan Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {messageHistory.slice(0, 5).map((message: any) => (
            <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.type === 'email' ? 'bg-blue-100' :
                    message.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {message.type === 'email' ? <Mail size={20} className="text-blue-600" /> :
                     message.type === 'sms' ? <MessageSquare size={20} className="text-green-600" /> :
                     <MessageCircle size={20} className="text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{message.subject || message.message}</h4>
                    <p className="text-sm text-gray-600">{message.recipient}</p>
                    <p className="text-xs text-gray-500">{message.templateId ? `Template: ${message.templateId}` : 'Manual'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    message.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    message.status === 'read' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {message.status === 'sent' ? 'Terkirim' :
                     message.status === 'delivered' ? 'Diterima' :
                     message.status === 'read' ? 'Dibaca' : 'Pending'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{new Date(message.sentAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Template Pesan</h3>
          <p className="text-gray-600">Kelola template untuk email, SMS, dan WhatsApp</p>
        </div>
        <button 
          onClick={() => setShowComposer(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Template Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {emailTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  template.type === 'interview' ? 'bg-blue-100' :
                  template.type === 'application' ? 'bg-green-100' :
                  template.type === 'reminder' ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  {template.type === 'interview' ? <Calendar size={20} className="text-blue-600" /> :
                   template.type === 'application' ? <CheckCircle size={20} className="text-green-600" /> :
                   template.type === 'reminder' ? <Bell size={20} className="text-orange-600" /> :
                   <Mail size={20} className="text-purple-600" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{template.content}</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {template.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
              <p className="text-xs text-gray-500">Terakhir digunakan: {template.lastUsed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Otomatisasi</h3>
          <p className="text-gray-600">Atur aturan otomatis untuk pengiriman pesan</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
          <Zap size={20} />
          Aturan Baru
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900">Aturan Otomatisasi</h4>
        </div>
        <div className="divide-y divide-gray-100">
          {automationRules.map((rule: any) => (
            <div key={rule.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Zap size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{rule.name}</h5>
                    <p className="text-sm text-gray-600">Trigger: {rule.trigger}</p>
                    <p className="text-xs text-gray-500">Action: {rule.action} • Delay: {rule.delay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {rule.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlastMessage = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Blast Message</h3>
          <p className="text-gray-600">Kirim pesan ke banyak kandidat sekaligus</p>
        </div>
        <button 
          onClick={() => {
            setShowComposer(true);
            setComposerType('email');
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Send size={20} />
          Kirim Blast
        </button>
      </div>

      {/* Blast Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => {
            setShowComposer(true);
            setComposerType('email');
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Email Blast</h4>
              <p className="text-sm text-gray-600">Kirim email ke multiple kandidat</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Cocok untuk pengumuman, update status, atau newsletter rekrutmen</p>
        </div>

        <div 
          onClick={() => {
            setShowComposer(true);
            setComposerType('sms');
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">SMS Blast</h4>
              <p className="text-sm text-gray-600">Kirim SMS ke multiple kandidat</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Untuk reminder urgent atau notifikasi penting yang perlu dibaca cepat</p>
        </div>

        <div 
          onClick={() => {
            setShowComposer(true);
            setComposerType('whatsapp');
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-purple-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">WhatsApp Blast</h4>
              <p className="text-sm text-gray-600">Kirim WhatsApp ke multiple kandidat</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Untuk komunikasi personal dan informal dengan engagement tinggi</p>
        </div>
      </div>

      {/* Recent Blast Campaigns */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900">Campaign Terbaru</h4>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              name: 'Interview Batch Februari',
              type: 'email',
              recipients: 45,
              sent: 45,
              opened: 38,
              clicked: 12,
              status: 'completed',
              sentAt: '2 hari lalu'
            },
            {
              name: 'Reminder Interview Besok',
              type: 'sms',
              recipients: 12,
              sent: 12,
              delivered: 11,
              status: 'completed',
              sentAt: '1 hari lalu'
            },
            {
              name: 'Welcome New Applicants',
              type: 'whatsapp',
              recipients: 23,
              sent: 23,
              read: 18,
              status: 'completed',
              sentAt: '3 jam lalu'
            }
          ].map((campaign, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    campaign.type === 'email' ? 'bg-blue-100' :
                    campaign.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {campaign.type === 'email' ? <Mail size={20} className="text-blue-600" /> :
                     campaign.type === 'sms' ? <MessageSquare size={20} className="text-green-600" /> :
                     <MessageCircle size={20} className="text-purple-600" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{campaign.name}</h5>
                    <p className="text-sm text-gray-600">{campaign.recipients} penerima • {campaign.sentAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-gray-600">Terkirim: {campaign.sent}</span>
                    {campaign.opened && <span className="text-sm text-gray-600">Dibuka: {campaign.opened}</span>}
                    {campaign.delivered && <span className="text-sm text-gray-600">Diterima: {campaign.delivered}</span>}
                    {campaign.read && <span className="text-sm text-gray-600">Dibaca: {campaign.read}</span>}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Selesai
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'templates', label: 'Template', icon: Mail },
    { id: 'automation', label: 'Otomatisasi', icon: Zap },
    { id: 'blast', label: 'Blast Message', icon: Send }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Communication Hub</h2>
                <p className="text-blue-100">Kelola semua komunikasi dengan kandidat</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'templates' && renderTemplates()}
          {activeTab === 'automation' && renderAutomation()}
          {activeTab === 'blast' && renderBlastMessage()}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;