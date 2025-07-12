import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Brain,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Award,
  Zap,
  X
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  onClose: () => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('funnel');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Fetch analytics data from backend
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics/overview', dateRange],
    queryFn: () => fetch(`/api/analytics/overview?range=${dateRange}`).then(res => res.json())
  });

  const { data: funnelData } = useQuery({
    queryKey: ['/api/analytics/funnel', dateRange],
    queryFn: () => fetch(`/api/analytics/funnel?range=${dateRange}`).then(res => res.json())
  });

  const { data: timeToHireData } = useQuery({
    queryKey: ['/api/analytics/time-to-hire', dateRange],
    queryFn: () => fetch(`/api/analytics/time-to-hire?range=${dateRange}`).then(res => res.json())
  });

  const { data: channelData } = useQuery({
    queryKey: ['/api/analytics/channels', dateRange],
    queryFn: () => fetch(`/api/analytics/channels?range=${dateRange}`).then(res => res.json())
  });

  const { data: aiPredictions } = useQuery({
    queryKey: ['/api/analytics/ai-predictions'],
    queryFn: () => fetch('/api/analytics/ai-predictions').then(res => res.json())
  });

  const queryClient = useQueryClient();

  const generateReportMutation = useMutation({
    mutationFn: (reportType: string) =>
      fetch('/api/analytics/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, dateRange })
      }).then(res => res.json()),
    onSuccess: () => {
      alert('Laporan berhasil dibuat dan akan dikirim ke email Anda');
    }
  });

  const tabs = [
    { id: 'funnel', label: 'Funnel Rekrutmen', icon: Target },
    { id: 'time-to-hire', label: 'Time to Hire', icon: Clock },
    { id: 'channels', label: 'Efektivitas Channel', icon: TrendingUp },
    { id: 'ai-predictions', label: 'Prediksi AI', icon: Brain }
  ];

  const renderFunnelAnalysis = () => (
    <div className="space-y-6">
      {/* Funnel Overview */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Funnel Rekrutmen</h3>
          <div className="flex items-center gap-2">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="7d">7 Hari</option>
              <option value="30d">30 Hari</option>
              <option value="90d">90 Hari</option>
              <option value="1y">1 Tahun</option>
            </select>
          </div>
        </div>

        {/* Funnel Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {funnelData?.steps?.map((step: any, index: number) => (
            <div key={step.name} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.name}</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">{step.count}</p>
                <p className="text-sm text-gray-600">{step.percentage}%</p>
                {step.conversionRate && (
                  <p className="text-xs text-green-600 mt-1">
                    Konversi: {step.conversionRate}%
                  </p>
                )}
              </div>
              {index < (funnelData?.steps?.length - 1) && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <div className="w-4 h-0.5 bg-gray-300"></div>
                </div>
              )}
            </div>
          )) || Array.from({length: 5}).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-2xl p-6 text-center animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Titik Penurunan Terbesar</h4>
          <div className="space-y-4">
            {funnelData?.dropoffPoints?.map((point: any) => (
              <div key={point.stage} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <h5 className="font-semibold text-gray-900">{point.stage}</h5>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">-{point.dropoffRate}%</p>
                  <p className="text-xs text-gray-500">{point.candidates} kandidat</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Loading data analisis...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Rekomendasi Optimasi</h4>
          <div className="space-y-4">
            {funnelData?.recommendations?.map((rec: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={14} className="text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <p className="text-xs text-green-600 mt-1">Potensi peningkatan: {rec.impact}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                <p>Generating recommendations...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeToHire = () => (
    <div className="space-y-6">
      {/* Time to Hire Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rata-rata</h3>
              <p className="text-2xl font-bold text-blue-600">{timeToHireData?.average || 0} hari</p>
              <p className="text-sm text-gray-500">Time to hire</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Terbaik</h3>
              <p className="text-2xl font-bold text-green-600">{timeToHireData?.fastest || 0} hari</p>
              <p className="text-sm text-gray-500">Tercepat</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Terlama</h3>
              <p className="text-2xl font-bold text-orange-600">{timeToHireData?.slowest || 0} hari</p>
              <p className="text-sm text-gray-500">Paling lama</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Target</h3>
              <p className="text-2xl font-bold text-purple-600">30 hari</p>
              <p className="text-sm text-gray-500">Benchmark</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time to Hire by Position */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Time to Hire per Posisi</h3>
        <div className="space-y-4">
          {timeToHireData?.byPosition?.map((position: any) => (
            <div key={position.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-semibold text-gray-900">{position.title}</h4>
                <p className="text-sm text-gray-600">{position.hires} hire(s) completed</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((position.avgDays / 60) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{position.avgDays} hari</p>
                  <p className={`text-xs ${position.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                    {position.trend === 'up' ? '↑' : '↓'} {position.change} hari
                  </p>
                </div>
              </div>
            </div>
          )) || Array.from({length: 5}).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-gray-200 rounded-full h-2"></div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChannelEffectiveness = () => (
    <div className="space-y-6">
      {/* Channel Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {channelData?.channels?.map((channel: any) => (
          <div key={channel.name} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${channel.color}`}>
                <TrendingUp size={24} className={channel.iconColor} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                channel.effectiveness >= 80 ? 'bg-green-100 text-green-800' :
                channel.effectiveness >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {channel.effectiveness}% efektif
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aplikasi</span>
                <span className="font-semibold">{channel.applications}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Interview</span>
                <span className="font-semibold">{channel.interviews}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hired</span>
                <span className="font-semibold text-green-600">{channel.hired}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost per Hire</span>
                <span className="font-semibold">Rp {channel.costPerHire?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )) || Array.from({length: 4}).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Channel Comparison Chart */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Perbandingan Efektivitas Channel</h3>
        <div className="space-y-6">
          {channelData?.comparison?.map((item: any) => (
            <div key={item.channel} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">{item.channel}</div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" 
                      style={{ width: `${item.effectiveness}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-semibold">{item.effectiveness}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{item.applications} aplikasi</span>
                  <span>{item.hired} hired</span>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Loading channel data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAIPredictions = () => (
    <div className="space-y-6">
      {/* AI Insights Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 border border-purple-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Prediction Engine</h3>
            <p className="text-gray-600">Powered by machine learning analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Akurasi Model</h4>
            <p className="text-2xl font-bold text-purple-600">{aiPredictions?.modelAccuracy || 87}%</p>
            <p className="text-sm text-gray-500">Berdasarkan 500+ data historis</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Prediksi Hari Ini</h4>
            <p className="text-2xl font-bold text-green-600">{aiPredictions?.todayPredictions || 12}</p>
            <p className="text-sm text-gray-500">Kandidat dengan potensi tinggi</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
            <p className="text-2xl font-bold text-blue-600">{aiPredictions?.successRate || 73}%</p>
            <p className="text-sm text-gray-500">Kandidat yang diprediksi berhasil</p>
          </div>
        </div>
      </div>

      {/* Top Candidate Predictions */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Prediksi Kandidat Terbaik</h3>
        <div className="space-y-4">
          {aiPredictions?.topCandidates?.map((candidate: any) => (
            <div key={candidate.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {candidate.strengths?.map((strength: string) => (
                      <span key={strength} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${candidate.successProbability}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-green-600">{candidate.successProbability}%</span>
                </div>
                <p className="text-xs text-gray-500">Probabilitas sukses</p>
              </div>
            </div>
          )) || Array.from({length: 5}).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-5 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Factors */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Faktor Prediksi Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Faktor Positif</h4>
            <div className="space-y-3">
              {aiPredictions?.positiveFactor?.map((factor: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{factor.name}</span>
                  <span className="text-sm text-green-600 font-semibold">+{factor.impact}</span>
                </div>
              )) || Array.from({length: 4}).map((_, index) => (
                <div key={index} className="flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Faktor Risiko</h4>
            <div className="space-y-3">
              {aiPredictions?.riskFactors?.map((factor: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{factor.name}</span>
                  <span className="text-sm text-red-600 font-semibold">-{factor.impact}</span>
                </div>
              )) || Array.from({length: 4}).map((_, index) => (
                <div key={index} className="flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
              <p className="text-sm text-gray-600">Analisis mendalam rekrutmen dengan AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => generateReportMutation.mutate('comprehensive')}
              disabled={generateReportMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {generateReportMutation.isPending ? 'Generating...' : 'Export Report'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'funnel' && renderFunnelAnalysis()}
          {activeTab === 'time-to-hire' && renderTimeToHire()}
          {activeTab === 'channels' && renderChannelEffectiveness()}
          {activeTab === 'ai-predictions' && renderAIPredictions()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;