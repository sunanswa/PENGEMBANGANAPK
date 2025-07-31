import React, { useState } from 'react';
import { Mail, Clock, Users, CheckCircle, Settings, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  trigger: 'application_received' | 'interview_scheduled' | 'status_update' | 'manual';
  isActive: boolean;
  sentCount: number;
  openRate: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: string[];
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  sentCount: number;
  openRate: number;
  clickRate: number;
}

export default function EmailAutomation() {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'analytics'>('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Application',
      subject: 'Terima kasih atas lamaran Anda - {{jobTitle}}',
      content: 'Halo {{candidateName}}, terima kasih telah melamar posisi {{jobTitle}} di SWAPRO...',
      trigger: 'application_received',
      isActive: true,
      sentCount: 156,
      openRate: 78.5
    },
    {
      id: '2',
      name: 'Interview Confirmation',
      subject: 'Konfirmasi Interview - {{jobTitle}}',
      content: 'Halo {{candidateName}}, kami senang mengundang Anda untuk interview...',
      trigger: 'interview_scheduled',
      isActive: true,
      sentCount: 89,
      openRate: 91.2
    },
    {
      id: '3',
      name: 'Status Update',
      subject: 'Update Status Lamaran - {{jobTitle}}',
      content: 'Halo {{candidateName}}, kami ingin memberikan update mengenai status lamaran Anda...',
      trigger: 'status_update',
      isActive: false,
      sentCount: 234,
      openRate: 65.8
    }
  ];

  const emailCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Weekly Newsletter',
      templateId: '1',
      recipients: ['all_candidates'],
      scheduledTime: '2025-07-20T09:00:00',
      status: 'scheduled',
      sentCount: 0,
      openRate: 0,
      clickRate: 0
    },
    {
      id: '2',
      name: 'Job Alert - Frontend',
      templateId: '2',
      recipients: ['frontend_candidates'],
      status: 'sent',
      sentCount: 45,
      openRate: 82.2,
      clickRate: 23.6
    }
  ];

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Email Templates</h3>
          <p className="text-sm text-gray-600">Kelola template email otomatis</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          New Template
        </button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 gap-4">
        {emailTemplates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">{template.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                    {template.trigger.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{template.content}</p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 size={16} />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={template.isActive ? 'Pause' : 'Activate'}>
                  {template.isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {template.sentCount} sent
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} />
                {template.openRate}% open rate
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Email Campaigns</h3>
          <p className="text-sm text-gray-600">Kelola kampanye email massal</p>
        </div>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-4">
        {emailCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    campaign.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                    campaign.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Recipients: {campaign.recipients.join(', ')}
                </p>
                {campaign.scheduledTime && (
                  <p className="text-sm text-gray-500">
                    Scheduled: {new Date(campaign.scheduledTime).toLocaleString()}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 size={16} />
                </button>
                {campaign.status === 'draft' && (
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Send">
                    <Play size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {campaign.sentCount} sent
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} />
                {campaign.openRate}% opened
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {campaign.clickRate}% clicked
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Email Analytics</h3>
      
      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sent</p>
              <p className="text-2xl font-bold text-slate-800">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open Rate</p>
              <p className="text-2xl font-bold text-slate-800">78.5%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Click Rate</p>
              <p className="text-2xl font-bold text-slate-800">23.6%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <p className="text-2xl font-bold text-slate-800">2.1%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Email Performance Trend</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'campaigns', label: 'Campaigns', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: CheckCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
}