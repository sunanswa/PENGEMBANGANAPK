import React, { useState } from 'react';
import { Download, FileText, Table, CheckCircle, X, Calendar, Filter } from 'lucide-react';

interface ExportField {
  id: string;
  label: string;
  selected: boolean;
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  fields: ExportField[];
  dateRange: {
    start?: string;
    end?: string;
  };
  filters: {
    status: string[];
    location: string[];
  };
}

interface EnhancedDataExportProps {
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  dataType: 'jobs' | 'applications' | 'candidates';
  totalRecords: number;
}

export default function EnhancedDataExport({ 
  onClose, 
  onExport, 
  dataType,
  totalRecords 
}: EnhancedDataExportProps) {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'excel',
    fields: getDefaultFields(dataType),
    dateRange: {},
    filters: { status: [], location: [] }
  });

  const formatOptions = [
    { id: 'excel', label: 'Excel (.xlsx)', icon: Table, description: 'Format terbaik untuk analisis data' },
    { id: 'csv', label: 'CSV (.csv)', icon: FileText, description: 'Format kompatibel dengan semua aplikasi' },
    { id: 'pdf', label: 'PDF (.pdf)', icon: FileText, description: 'Format untuk laporan profesional' },
    { id: 'json', label: 'JSON (.json)', icon: FileText, description: 'Format untuk integrasi sistem' }
  ];

  const statusOptions = getStatusOptions(dataType);
  const locationOptions = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Semarang'];

  const toggleField = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, selected: !field.selected } : field
      )
    }));
  };

  const toggleAllFields = () => {
    const allSelected = config.fields.every(field => field.selected);
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, selected: !allSelected }))
    }));
  };

  const handleExport = () => {
    onExport(config);
    onClose();
  };

  const selectedFieldsCount = config.fields.filter(f => f.selected).length;
  const filteredRecords = calculateFilteredRecords();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Export Data</h2>
            <p className="text-sm text-gray-600">Ekspor data {getDataTypeLabel(dataType)} dengan kustomisasi lengkap</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Format Export</h3>
              <div className="space-y-3">
                {formatOptions.map((format) => {
                  const Icon = format.icon;
                  return (
                    <label key={format.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="format"
                        value={format.id}
                        checked={config.format === format.id}
                        onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{format.label}</p>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Date Range Filter */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Rentang Tanggal
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                    <input
                      type="date"
                      value={config.dateRange.start || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={config.dateRange.end || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Pilih Field ({selectedFieldsCount}/{config.fields.length})</h3>
                <button
                  onClick={toggleAllFields}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {config.fields.every(field => field.selected) ? 'Unselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <div className="space-y-2">
                  {config.fields.map((field) => (
                    <label key={field.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.selected}
                        onChange={() => toggleField(field.id)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Filter size={16} />
                  Filter Data
                </h4>
                
                {/* Status Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <label key={status} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={config.filters.status.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig(prev => ({
                                ...prev,
                                filters: {
                                  ...prev.filters,
                                  status: [...prev.filters.status, status]
                                }
                              }));
                            } else {
                              setConfig(prev => ({
                                ...prev,
                                filters: {
                                  ...prev.filters,
                                  status: prev.filters.status.filter(s => s !== status)
                                }
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                  <div className="flex flex-wrap gap-2">
                    {locationOptions.map((location) => (
                      <label key={location} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={config.filters.location.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig(prev => ({
                                ...prev,
                                filters: {
                                  ...prev.filters,
                                  location: [...prev.filters.location, location]
                                }
                              }));
                            } else {
                              setConfig(prev => ({
                                ...prev,
                                filters: {
                                  ...prev.filters,
                                  location: prev.filters.location.filter(l => l !== location)
                                }
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span>{location}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Ringkasan Export</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Format:</span>
                <p className="font-medium text-blue-900">{config.format.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-blue-700">Field:</span>
                <p className="font-medium text-blue-900">{selectedFieldsCount} field</p>
              </div>
              <div>
                <span className="text-blue-700">Records:</span>
                <p className="font-medium text-blue-900">{filteredRecords} dari {totalRecords}</p>
              </div>
              <div>
                <span className="text-blue-700">Size estimasi:</span>
                <p className="font-medium text-blue-900">{getEstimatedSize(filteredRecords, selectedFieldsCount, config.format)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Export akan dimulai otomatis setelah Anda klik tombol Export
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={selectedFieldsCount === 0}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function calculateFilteredRecords(): number {
    // Simple calculation based on filters
    let filtered = totalRecords;
    
    if (config.filters.status.length > 0) filtered = Math.floor(filtered * 0.7);
    if (config.filters.location.length > 0) filtered = Math.floor(filtered * 0.8);
    if (config.dateRange.start || config.dateRange.end) filtered = Math.floor(filtered * 0.6);
    
    return Math.max(1, filtered);
  }
}

function getDefaultFields(dataType: string): ExportField[] {
  switch (dataType) {
    case 'jobs':
      return [
        { id: 'title', label: 'Judul Lowongan', selected: true },
        { id: 'location', label: 'Lokasi', selected: true },
        { id: 'salary', label: 'Gaji', selected: true },
        { id: 'type', label: 'Tipe Pekerjaan', selected: true },
        { id: 'status', label: 'Status', selected: true },
        { id: 'postedDate', label: 'Tanggal Posting', selected: true },
        { id: 'applicants', label: 'Jumlah Pelamar', selected: true },
        { id: 'description', label: 'Deskripsi', selected: false },
        { id: 'requirements', label: 'Persyaratan', selected: false },
        { id: 'benefits', label: 'Benefits', selected: false }
      ];
    case 'applications':
      return [
        { id: 'candidateName', label: 'Nama Kandidat', selected: true },
        { id: 'candidateEmail', label: 'Email', selected: true },
        { id: 'candidatePhone', label: 'Telepon', selected: true },
        { id: 'jobTitle', label: 'Posisi Lamar', selected: true },
        { id: 'appliedDate', label: 'Tanggal Lamar', selected: true },
        { id: 'status', label: 'Status', selected: true },
        { id: 'location', label: 'Lokasi', selected: true },
        { id: 'interviewDate', label: 'Tanggal Interview', selected: false },
        { id: 'notes', label: 'Catatan', selected: false }
      ];
    case 'candidates':
      return [
        { id: 'fullName', label: 'Nama Lengkap', selected: true },
        { id: 'email', label: 'Email', selected: true },
        { id: 'phone', label: 'Telepon', selected: true },
        { id: 'location', label: 'Lokasi', selected: true },
        { id: 'status', label: 'Status', selected: true },
        { id: 'skillScore', label: 'Skill Score', selected: true },
        { id: 'totalApplications', label: 'Total Aplikasi', selected: true },
        { id: 'lastActive', label: 'Terakhir Aktif', selected: false },
        { id: 'profileCompletion', label: 'Kelengkapan Profil', selected: false }
      ];
    default:
      return [];
  }
}

function getStatusOptions(dataType: string): string[] {
  switch (dataType) {
    case 'jobs':
      return ['active', 'closed', 'draft', 'urgent'];
    case 'applications':
      return ['submitted', 'viewed', 'interview', 'accepted', 'rejected'];
    case 'candidates':
      return ['active', 'inactive', 'blacklisted'];
    default:
      return [];
  }
}

function getDataTypeLabel(dataType: string): string {
  switch (dataType) {
    case 'jobs': return 'lowongan pekerjaan';
    case 'applications': return 'lamaran';
    case 'candidates': return 'kandidat';
    default: return 'data';
  }
}

function getEstimatedSize(records: number, fields: number, format: string): string {
  const baseSize = records * fields * 20; // bytes per field
  const multiplier = format === 'pdf' ? 3 : format === 'excel' ? 1.5 : 1;
  const sizeBytes = baseSize * multiplier;
  
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${Math.round(sizeBytes / (1024 * 1024))} MB`;
}