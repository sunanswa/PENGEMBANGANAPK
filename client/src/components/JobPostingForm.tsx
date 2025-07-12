import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, MapPin, FileText, DollarSign, Clock, AlertCircle, Users } from 'lucide-react';
interface JobPosting {
  id: string;
  title: string;
  description: string;
  locations: string[];
  maps_links?: string[];
  positions_needed?: number;
  status: 'active' | 'closed' | 'draft' | 'urgent';
  requirements?: string;
  salary_range?: string;
  employment_type?: string;
  created_at: string;
  updated_at?: string;
}

interface JobPostingFormProps {
  jobPosting?: JobPosting | null;
  onSubmit: (data: Partial<JobPosting>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  jobPosting,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locations: [''],
    maps_links: [''],
    positions_needed: 1,
    status: 'active' as const,
    requirements: '',
    salary_range: '',
    employment_type: 'full-time'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobPosting) {
      setFormData({
        title: jobPosting.title || '',
        description: jobPosting.description || '',
        locations: jobPosting.locations?.length ? jobPosting.locations : [''],
        maps_links: jobPosting.maps_links?.length ? jobPosting.maps_links : [''],
        positions_needed: jobPosting.positions_needed || 1,
        status: jobPosting.status || 'active',
        requirements: jobPosting.requirements || '',
        salary_range: jobPosting.salary_range || '',
        employment_type: jobPosting.employment_type || 'full-time'
      });
    }
  }, [jobPosting]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul lowongan harus diisi';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi lowongan harus diisi';
    }
    
    const validLocations = formData.locations.filter(loc => loc.trim());
    if (validLocations.length === 0) {
      newErrors.locations = 'Minimal satu lokasi harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const validLocations = formData.locations.filter(loc => loc.trim());
    const validMapsLinks = formData.maps_links.filter(link => link.trim());
    
    try {
      await onSubmit({
        ...formData,
        locations: validLocations,
        maps_links: validMapsLinks
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, '']
    }));
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const updateLocation = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => i === index ? value : loc)
    }));
  };

  const addMapsLink = () => {
    setFormData(prev => ({
      ...prev,
      maps_links: [...prev.maps_links, '']
    }));
  };

  const removeMapsLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      maps_links: prev.maps_links.filter((_, i) => i !== index)
    }));
  };

  const updateMapsLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      maps_links: prev.maps_links.map((link, i) => i === index ? value : link)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FileText size={24} className="text-blue-600" />
              </div>
              {jobPosting ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <FileText size={14} className="text-blue-600" />
                </div>
                Judul Lowongan *
              </div>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Contoh: Sales Officer Chaneling (SOC)"
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-100 rounded-lg">
                  <FileText size={14} className="text-green-600" />
                </div>
                Deskripsi Lowongan *
              </div>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan kualifikasi yang dibutuhkan..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-orange-100 rounded-lg">
                  <MapPin size={14} className="text-orange-600" />
                </div>
                Lokasi Penempatan *
              </div>
            </label>
            <div className="space-y-3">
              {formData.locations.map((location, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => updateLocation(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="Contoh: ADIRA TEBET MOTOR"
                  />
                  {formData.locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLocation}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
              >
                <Plus size={16} />
                Tambah Lokasi
              </button>
            </div>
            {errors.locations && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} />
                {errors.locations}
              </p>
            )}
          </div>

          {/* Google Maps Links */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-100 rounded-lg">
                  <MapPin size={14} className="text-red-600" />
                </div>
                Link Google Maps (Opsional)
              </div>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Tambahkan link Google Maps untuk memudahkan pelamar menemukan lokasi kantor
            </p>
            <div className="space-y-3">
              {formData.maps_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateMapsLink(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="https://maps.google.com/..."
                  />
                  {formData.maps_links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMapsLink(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMapsLink}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
              >
                <Plus size={16} />
                Tambah Link Maps
              </button>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Positions Needed */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded-lg">
                    <Users size={14} className="text-indigo-600" />
                  </div>
                  Jumlah Dibutuhkan *
                </div>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.positions_needed}
                onChange={(e) => setFormData(prev => ({ ...prev, positions_needed: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                placeholder="1"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-yellow-100 rounded-lg">
                    <Clock size={14} className="text-yellow-600" />
                  </div>
                  Status Lowongan *
                </div>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Aktif</option>
                <option value="urgent">Urgent</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-teal-100 rounded-lg">
                    <Clock size={14} className="text-teal-600" />
                  </div>
                  Tipe Pekerjaan
                </div>
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Kontrak</option>
                <option value="internship">Magang</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requirements */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <FileText size={14} className="text-purple-600" />
                  </div>
                  Persyaratan
                </div>
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 resize-none"
                placeholder="Contoh: Minimal S1, pengalaman 2 tahun di bidang sales..."
              />
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded-lg">
                    <DollarSign size={14} className="text-green-600" />
                  </div>
                  Range Gaji
                </div>
              </label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded-lg">
                    <Clock size={14} className="text-indigo-600" />
                  </div>
                  Tipe Pekerjaan
                </div>
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Kontrak</option>
                <option value="internship">Magang</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-yellow-100 rounded-lg">
                    <FileText size={14} className="text-yellow-600" />
                  </div>
                  Status Lowongan
                </div>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'closed' | 'draft' }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              >
                <option value="active">Aktif</option>
                <option value="draft">Draft</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              <Save size={20} />
              {isLoading ? 'Menyimpan...' : jobPosting ? 'Update Lowongan' : 'Simpan Lowongan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;