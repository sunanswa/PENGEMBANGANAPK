import React, { useState } from 'react';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  User, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save
} from 'lucide-react';

interface FormData {
  // Step 1: Personal Info
  fullName: string;
  nik: string;
  phone: string;
  email: string;
  gender: string;
  religion: string;
  maritalStatus: string;
  
  // Step 2: Address
  ktpAddress: string;
  currentAddress: string;
  province: string;
  city: string;
  
  // Step 3: Education
  lastEducation: string;
  institution: string;
  graduationYear: string;
  gpa: string;
  hasExperience: string;
  
  // Step 4: Experience (conditional)
  workExperience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  
  // Step 5: Documents
  cv: File | null;
  motivationLetter: string;
  additionalDocs: File[];
}

export default function JobApplicationForm({ jobId }: { jobId?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    nik: '',
    phone: '',
    email: '',
    gender: '',
    religion: '',
    maritalStatus: '',
    ktpAddress: '',
    currentAddress: '',
    province: '',
    city: '',
    lastEducation: '',
    institution: '',
    graduationYear: '',
    gpa: '',
    hasExperience: '',
    workExperience: [],
    cv: null,
    motivationLetter: '',
    additionalDocs: []
  });

  const totalSteps = formData.hasExperience === 'yes' ? 5 : 4;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { position: '', company: '', duration: '', description: '' }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      if (formData.hasExperience === 'no' && currentStep === 3) {
        setCurrentStep(5); // Skip step 4 if no experience
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      if (formData.hasExperience === 'no' && currentStep === 5) {
        setCurrentStep(3); // Skip step 4 if no experience
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step === currentStep 
              ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white' 
              : step < currentStep 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircle size={20} /> : step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Personal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIK (KTP) *</label>
          <input
            type="text"
            value={formData.nik}
            onChange={(e) => handleInputChange('nik', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin *</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agama *</label>
          <select
            value={formData.religion}
            onChange={(e) => handleInputChange('religion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Pilih Agama</option>
            <option value="islam">Islam</option>
            <option value="kristen">Kristen</option>
            <option value="katolik">Katolik</option>
            <option value="hindu">Hindu</option>
            <option value="buddha">Buddha</option>
            <option value="khonghucu">Khonghucu</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Pernikahan *</label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Pilih Status</option>
            <option value="single">Belum Menikah</option>
            <option value="married">Menikah</option>
            <option value="divorced">Cerai</option>
            <option value="widowed">Janda/Duda</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Alamat</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alamat KTP *</label>
          <textarea
            value={formData.ktpAddress}
            onChange={(e) => handleInputChange('ktpAddress', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Domisili Saat Ini *</label>
          <textarea
            value={formData.currentAddress}
            onChange={(e) => handleInputChange('currentAddress', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi *</label>
            <select
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Pilih Provinsi</option>
              <option value="dki-jakarta">DKI Jakarta</option>
              <option value="jawa-barat">Jawa Barat</option>
              <option value="jawa-tengah">Jawa Tengah</option>
              <option value="jawa-timur">Jawa Timur</option>
              <option value="banten">Banten</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kota/Kabupaten *</label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Pilih Kota</option>
              <option value="jakarta-selatan">Jakarta Selatan</option>
              <option value="jakarta-utara">Jakarta Utara</option>
              <option value="jakarta-barat">Jakarta Barat</option>
              <option value="jakarta-timur">Jakarta Timur</option>
              <option value="jakarta-pusat">Jakarta Pusat</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Pendidikan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan Terakhir *</label>
          <select
            value={formData.lastEducation}
            onChange={(e) => handleInputChange('lastEducation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Pilih Pendidikan</option>
            <option value="sma">SMA/SMK</option>
            <option value="d3">Diploma 3 (D3)</option>
            <option value="s1">Sarjana (S1)</option>
            <option value="s2">Magister (S2)</option>
            <option value="s3">Doktor (S3)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Institusi *</label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Lulus *</label>
          <input
            type="number"
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            min="1980"
            max="2025"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IPK/Nilai</label>
          <input
            type="text"
            value={formData.gpa}
            onChange={(e) => handleInputChange('gpa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Contoh: 3.50"
          />
        </div>
      </div>
      
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">Apakah Anda memiliki pengalaman kerja? *</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasExperience"
              value="yes"
              checked={formData.hasExperience === 'yes'}
              onChange={(e) => handleInputChange('hasExperience', e.target.value)}
              className="mr-2"
            />
            Ya, saya memiliki pengalaman kerja
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasExperience"
              value="no"
              checked={formData.hasExperience === 'no'}
              onChange={(e) => handleInputChange('hasExperience', e.target.value)}
              className="mr-2"
            />
            Tidak, fresh graduate
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Pengalaman Kerja</h3>
      
      {formData.workExperience.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Pengalaman {index + 1}</h4>
            {formData.workExperience.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="text-red-600 hover:text-red-700"
              >
                Hapus
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posisi/Jabatan *</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Kerja *</label>
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Contoh: 2020-2022"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Pekerjaan</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Jelaskan tanggung jawab dan pencapaian Anda"
            />
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addWorkExperience}
        className="btn-swapro-outline w-full"
      >
        + Tambah Pengalaman Kerja
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Dokumen & Verifikasi</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV/Resume *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Klik untuk upload atau drag & drop</p>
            <p className="text-xs text-gray-500">Format: PDF, DOC, DOCX (Max: 5MB)</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload('cv', e.target.files?.[0] || null)}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload" className="btn-swapro-outline mt-2 inline-block cursor-pointer">
              Pilih File
            </label>
            {formData.cv && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.cv.name}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Surat Motivasi *</label>
          <textarea
            value={formData.motivationLetter}
            onChange={(e) => handleInputChange('motivationLetter', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan apa yang membuat Anda kandidat yang tepat..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dokumen Tambahan</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Upload dokumen pendukung (opsional)</p>
            <p className="text-xs text-gray-500 mb-2">Sertifikat, portfolio, ijazah, dll.</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.nik && formData.phone && formData.email && 
               formData.gender && formData.religion && formData.maritalStatus;
      case 2:
        return formData.ktpAddress && formData.currentAddress && formData.province && formData.city;
      case 3:
        return formData.lastEducation && formData.institution && formData.graduationYear && formData.hasExperience;
      case 4:
        return formData.workExperience.length > 0 && 
               formData.workExperience.every(exp => exp.position && exp.company && exp.duration);
      case 5:
        return formData.cv && formData.motivationLetter;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    // Submit form logic here
    console.log('Submitting application:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <SwaprosHeader 
        title="Form Lamaran Pekerjaan" 
        subtitle="Lengkapi data diri untuk melamar posisi ini"
        showSearch={false}
        userRole="applicant"
      />
      
      <div className="max-w-4xl mx-auto p-6">
        {renderStepIndicator()}
        
        <div className="card-enhanced p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg transition-colors ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft size={16} />
              Sebelumnya
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:from-purple-600 hover:to-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Selanjutnya
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                Kirim Lamaran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}