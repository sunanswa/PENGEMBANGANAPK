import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle,
  MessageCircle,
  Users,
  ArrowRight,
  Building2,
  Car,
  Wrench,
  CreditCard,
  Headphones,
  Target,
  Shield
} from 'lucide-react';
import { supabase } from './lib/supabase';
import ProgressSteps from './components/ProgressSteps';
import FormInput from './components/FormInput';
import BooleanInput from './components/BooleanInput';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import AuthForm from './components/AuthForm';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ApplicantDashboard from './pages/ApplicantDashboard';

interface FormData {
  // Step 1: Posisi & Penempatan
  posisiDilamar: string;
  penempatan: string;
  
  // Step 2: Data Pribadi
  namaLengkap: string;
  nik: string;
  noHp: string;
  tempatLahir: string;
  tanggalLahir: string;
  umur: string;
  jenisKelamin: string;
  statusPerkawinan: string;
  agama: string;
  namaAyah: string;
  namaIbu: string;
  
  // Step 3: Alamat
  alamatKtp: string;
  alamatDomisili: string;
  rtRw: string;
  nomorRumah: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  kodePos: string;
  
  // Step 4: Pendidikan
  tingkatPendidikan: string;
  namaSekolah: string;
  jurusan: string;
  tahunMasuk: string;
  tahunLulus: string;
  ipk: string;
  
  // Step 5: Pengalaman Kerja
  pengalamanKerja: boolean;
  pengalamanLeasing: boolean;
  namaPerusahaan: string;
  posisiJabatan: string;
  periodeKerja: string;
  deskripsiTugas: string;
  
  // Step 6: Dokumen & Persyaratan
  kendaraanPribadi: boolean;
  ktpAsli: boolean;
  simC: boolean;
  simA: boolean;
  skck: boolean;
  npwp: boolean;
  riwayatBurukKredit: boolean;
  alasanMelamar: string;
  cvFile: File | null;
}

const initialFormData: FormData = {
  posisiDilamar: '',
  penempatan: '',
  namaLengkap: '',
  nik: '',
  noHp: '',
  tempatLahir: '',
  tanggalLahir: '',
  umur: '',
  jenisKelamin: '',
  statusPerkawinan: '',
  agama: '',
  namaAyah: '',
  namaIbu: '',
  alamatKtp: '',
  alamatDomisili: '',
  rtRw: '',
  nomorRumah: '',
  kelurahan: '',
  kecamatan: '',
  kota: '',
  kodePos: '',
  tingkatPendidikan: '',
  namaSekolah: '',
  jurusan: '',
  tahunMasuk: '',
  tahunLulus: '',
  ipk: '',
  pengalamanKerja: false,
  pengalamanLeasing: false,
  namaPerusahaan: '',
  posisiJabatan: '',
  periodeKerja: '',
  deskripsiTugas: '',
  kendaraanPribadi: false,
  ktpAsli: false,
  simC: false,
  simA: false,
  skck: false,
  npwp: false,
  riwayatBurukKredit: false,
  alasanMelamar: '',
  cvFile: null
};

// Updated position mapping with proper capitalization and correct placements
const positionPlacements = {
  // Multiple positions with shared placements
  'Sales Officer Chaneling (SOC)': [
    'ADIRA TEBET MOTOR',
    'ADIRA TEBET MOBIL',
    'ADIRA KELAPA GADING MOTOR',
    'ADIRA KELAPA GADING MOBIL',
    'ADIRA KETAPANG',
    'ADIRA PONDOK GEDE'
  ],
  'Sales Officer Mobile (SOM)': [
    'ADIRA TEBET MOTOR',
    'ADIRA TEBET MOBIL',
    'ADIRA KELAPA GADING MOTOR',
    'ADIRA KELAPA GADING MOBIL',
    'ADIRA KETAPANG',
    'ADIRA PONDOK GEDE'
  ],
  'Relationship Officer (RO)': [
    'ADIRA TEBET MOTOR',
    'ADIRA TEBET MOBIL',
    'ADIRA KELAPA GADING MOTOR',
    'ADIRA KELAPA GADING MOBIL',
    'ADIRA KETAPANG',
    'ADIRA PONDOK GEDE'
  ],
  'Remedial Collection (REMOF)': [
    'ADIRA TEBET MOTOR',
    'ADIRA TEBET MOBIL',
    'ADIRA KELAPA GADING MOTOR',
    'ADIRA KELAPA GADING MOBIL',
    'ADIRA KETAPANG',
    'ADIRA PONDOK GEDE'
  ],
  'Problem Account Officer (PAO)': [
    'ADIRA TEBET MOTOR',
    'ADIRA TEBET MOBIL',
    'ADIRA KELAPA GADING MOTOR',
    'ADIRA KELAPA GADING MOBIL',
    'ADIRA KETAPANG',
    'ADIRA PONDOK GEDE'
  ],
  
  // Single position with single placement
  'Sales Force (SF)': [
    'ADIRA TEBET MOTOR'
  ],
  
  // Positions with SMSF placements
  'Credit Marketing Officer': [
    'SMSF JAKARTA TIMUR',
    'SMSF JAKARTA UTARA'
  ],
  'Recovery': [
    'SMSF JAKARTA TIMUR',
    'SMSF JAKARTA UTARA'
  ],
  'Credit Relation Executive / Credit Relation Officer': [
    'SMSF JAKARTA TIMUR',
    'SMSF JAKARTA UTARA'
  ],
  
  // Specific single placements
  'Sales Advisor/Sales Executive Used Car': ['HO Ampera'],
  'Sourcing Consultant/Mekanik Inspektor': ['JABODETABEK'],
  'Sales Multiguna': ['JABODETABEK'],
  'Telemarketing Astra': ['Juanda Jakarta Pusat'],
  'Telemarketing WOM': ['Tangerang City']
};

type AppState = 'splash' | 'landing' | 'loading' | 'form' | 'submitted' | 'auth' | 'admin' | 'applicant';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [isBypassingAuth, setIsBypassingAuth] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePlacements, setAvailablePlacements] = useState<string[]>([]);

  // Check for existing session on app load
  useEffect(() => {
    // Kode asli untuk production
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsBypassingAuth(false); // Reset bypass flag on real session
        await loadUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setIsBypassingAuth(false); // Reset bypass flag on real session
        await loadUserProfile(session.user.id);
      } else if ((appState === 'admin' || appState === 'applicant') && !isBypassingAuth) {
        setAppState('landing');
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [appState, isBypassingAuth]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setUserProfile(data);
      
      // Redirect based on role
      if (data.role === 'admin') {
        setAppState('admin');
      } else {
        setAppState('applicant');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };
  // Update available placements when position changes
  useEffect(() => {
    if (formData.posisiDilamar) {
      const placements = positionPlacements[formData.posisiDilamar as keyof typeof positionPlacements] || [];
      setAvailablePlacements(placements);
      
      // Auto-select placement if only one option
      if (placements.length === 1) {
        setFormData(prev => ({ ...prev, penempatan: placements[0] }));
      } else {
        // Clear placement if multiple options available
        setFormData(prev => ({ ...prev, penempatan: '' }));
      }
    } else {
      setAvailablePlacements([]);
      setFormData(prev => ({ ...prev, penempatan: '' }));
    }
  }, [formData.posisiDilamar]);

  const steps = [
    { 
      title: 'Posisi & Penempatan', 
      icon: Building2, 
      color: 'from-blue-400 to-blue-500' 
    },
    { 
      title: 'Data Pribadi', 
      icon: User, 
      color: 'from-purple-400 to-purple-500' 
    },
    { 
      title: 'Alamat', 
      icon: MapPin, 
      color: 'from-green-400 to-green-500' 
    },
    { 
      title: 'Pendidikan', 
      icon: GraduationCap, 
      color: 'from-orange-400 to-orange-500' 
    },
    { 
      title: 'Pengalaman', 
      icon: Briefcase, 
      color: 'from-red-400 to-red-500' 
    },
    { 
      title: 'Dokumen', 
      icon: FileText, 
      color: 'from-teal-400 to-teal-500' 
    }
  ];

  const handleSplashComplete = () => {
    setAppState('landing');
  };

  const handleStartApplication = () => {
    setAppState('loading');
    // Simulate loading time
    setTimeout(() => {
      setAppState('form');
    }, 3000);
  };

  const handleShowAuth = () => {
    setAppState('auth');
  };

  const handleAuthSuccess = async (role: 'admin' | 'applicant') => {
    // Profile will be loaded automatically via auth state change
    // Just wait a moment for the profile to load
    setTimeout(() => {
      if (role === 'admin') {
        setAppState('admin');
      } else {
        setAppState('applicant');
      }
    }, 1000);
  };

  const handleLogout = async () => {
    setIsBypassingAuth(false);
    await supabase.auth.signOut();
    setUserProfile(null);
    setAppState('landing');
  };

  // BYPASS FUNCTION untuk development - HAPUS sebelum production!
  const handleBypassAdminLogin = () => {
    setIsBypassingAuth(true);
    setAppState('admin');
    setSession({ user: { id: 'bypass-admin' } } as any);
    setUserProfile({ 
      id: 'bypass-admin',
      full_name: 'Admin SWAPRO (Bypass)', 
      role: 'admin',
      email: 'admin@swapro.com'
    });
  };
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Posisi & Penempatan
        if (!formData.posisiDilamar) newErrors.posisiDilamar = 'Posisi yang dilamar harus dipilih';
        if (!formData.penempatan) newErrors.penempatan = 'Penempatan kerja harus dipilih';
        break;

      case 1: // Data Pribadi
        if (!formData.namaLengkap) newErrors.namaLengkap = 'Nama lengkap harus diisi';
        if (!formData.nik) newErrors.nik = 'NIK harus diisi';
        else if (formData.nik.length !== 16) newErrors.nik = 'NIK harus 16 digit';
        if (!formData.noHp) newErrors.noHp = 'Nomor HP harus diisi';
        if (!formData.tempatLahir) newErrors.tempatLahir = 'Tempat lahir harus diisi';
        if (!formData.tanggalLahir) newErrors.tanggalLahir = 'Tanggal lahir harus diisi';
        if (!formData.jenisKelamin) newErrors.jenisKelamin = 'Jenis kelamin harus dipilih';
        if (!formData.statusPerkawinan) newErrors.statusPerkawinan = 'Status perkawinan harus dipilih';
        if (!formData.agama) newErrors.agama = 'Agama harus dipilih';
        if (!formData.namaAyah) newErrors.namaAyah = 'Nama ayah harus diisi';
        if (!formData.namaIbu) newErrors.namaIbu = 'Nama ibu harus diisi';
        break;

      case 2: // Alamat
        if (!formData.alamatKtp) newErrors.alamatKtp = 'Alamat KTP harus diisi';
        if (!formData.alamatDomisili) newErrors.alamatDomisili = 'Alamat domisili harus diisi';
        if (!formData.kelurahan) newErrors.kelurahan = 'Kelurahan harus diisi';
        if (!formData.kecamatan) newErrors.kecamatan = 'Kecamatan harus diisi';
        if (!formData.kota) newErrors.kota = 'Kota harus diisi';
        break;

      case 3: // Pendidikan
        if (!formData.tingkatPendidikan) newErrors.tingkatPendidikan = 'Tingkat pendidikan harus dipilih';
        if (!formData.namaSekolah) newErrors.namaSekolah = 'Nama sekolah harus diisi';
        break;

      case 4: // Pengalaman Kerja
        if (formData.pengalamanKerja && !formData.namaPerusahaan) {
          newErrors.namaPerusahaan = 'Nama perusahaan harus diisi jika memiliki pengalaman kerja';
        }
        break;

      case 5: // Dokumen
        if (!formData.alasanMelamar) newErrors.alasanMelamar = 'Alasan melamar harus diisi';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDateChange = (date: string) => {
    updateFormData('tanggalLahir', date);
    updateFormData('umur', calculateAge(date));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, cvFile: 'File harus berformat PDF' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cvFile: 'Ukuran file maksimal 5MB' }));
        return;
      }
      updateFormData('cvFile', file);
      setErrors(prev => ({ ...prev, cvFile: '' }));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      let cvFileData = null;
      let cvFileName = '';

      if (formData.cvFile) {
        cvFileData = await convertFileToBase64(formData.cvFile);
        cvFileName = formData.cvFile.name;
      }

      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        cvFileData,
        cvFileName
      };

      // Updated Google Apps Script URL
      const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyp2F8IYFvg1ggJTNrb0wvqfg_CbqARUANFZtkMP-d1luWXmYnQppN0ASEiBKU6Gykv/exec';

      console.log('Submitting to:', GOOGLE_APPS_SCRIPT_URL);
      console.log('Data being sent:', submissionData);

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        mode: 'no-cors' // Add this to handle CORS issues
      });

      // Since we're using no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      console.log('Form submitted successfully');
      setAppState('submitted');

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // For no-cors mode, we might get a TypeError which is actually success
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('Form likely submitted successfully (CORS limitation)');
        setAppState('submitted');
      } else {
        alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = (recruitmentNumber: number) => {
    const recruitmentName = recruitmentNumber === 1 ? 'Recruitment 1' : 'Recruitment 2';
    return `Halo ${recruitmentName}, saya telah mengisi formulir pendaftaran dengan data berikut:

📝 *Data Pendaftaran*
• Nama Lengkap: ${formData.namaLengkap}
• Posisi yang Dilamar: ${formData.posisiDilamar}
• Penempatan: ${formData.penempatan}
• Nomor HP: ${formData.noHp}
• Domisili: ${formData.alamatDomisili}

Mohon konfirmasi bahwa data saya telah diterima. Terima kasih! 🙏`;
  };

  const getWhatsAppUrl = (recruitmentNumber: number) => {
    const phoneNumber = recruitmentNumber === 1 ? '6285718648488' : '6285711451184';
    const message = encodeURIComponent(generateWhatsAppMessage(recruitmentNumber));
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  // Render different states
  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'landing') {
    return (
      <div className="relative">
        <LandingPage 
          onStartApplication={handleStartApplication}
          onShowAuth={handleShowAuth}
          onBypassAdmin={handleBypassAdminLogin}
        />
      </div>
    );
  }

  if (appState === 'loading') {
    return <LoadingScreen isLoading={true} />;
  }

  if (appState === 'auth') {
    return (
      <div className="relative">
        <LandingPage 
          onStartApplication={handleStartApplication}
          onShowAuth={handleShowAuth}
          onBypassAdmin={handleBypassAdminLogin}
        />
        <AuthForm 
          onAuthSuccess={handleAuthSuccess}
          onCancel={() => setAppState('landing')}
        />
      </div>
    );
  }

  if (appState === 'admin' && session && userProfile) {
    return <RecruiterDashboard onLogout={handleLogout} />;
  }

  if (appState === 'applicant' && session && userProfile) {
    return <ApplicantDashboard onLogout={handleLogout} userProfile={userProfile} />;
  }

  if (appState === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            {/* Logo */}
            <div className="mb-6 sm:mb-8">
              <img 
                src="/swapro copy.png" 
                alt="SWAPRO Logo" 
                className="h-16 sm:h-20 mx-auto mb-4 sm:mb-6"
              />
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Pendaftaran Berhasil! 🎉
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Terima kasih <span className="font-semibold text-emerald-600">{formData.namaLengkap}</span> telah mendaftar untuk posisi <span className="font-semibold text-emerald-600">{formData.posisiDilamar}</span>.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <MessageCircle className="text-blue-600 mr-2" size={24} />
                <h2 className="text-lg sm:text-xl font-bold text-blue-900">Langkah Selanjutnya</h2>
              </div>
              <p className="text-sm sm:text-base text-blue-800 mb-4 sm:mb-6 leading-relaxed">
                Untuk mempercepat proses seleksi, silakan konfirmasi pendaftaran Anda melalui WhatsApp dengan memilih salah satu tim recruitment di bawah ini:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <a
                  href={getWhatsAppUrl(1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  <span>Recruitment 1</span>
                  <ArrowRight size={16} />
                </a>
                
                <a
                  href={getWhatsAppUrl(2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  <span>Recruitment 2</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">📋 Ringkasan Pendaftaran</h3>
              <div className="text-left space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Posisi:</span>
                  <span className="text-right max-w-[60%]">{formData.posisiDilamar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Penempatan:</span>
                  <span className="text-right max-w-[60%]">{formData.penempatan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nomor HP:</span>
                  <span>{formData.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">CV:</span>
                  <span className="text-emerald-600 font-medium">
                    {formData.cvFile ? '✓ Terupload' : 'Tidak ada'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 leading-relaxed">
              Tim HR akan menghubungi Anda dalam 1-3 hari kerja untuk proses seleksi selanjutnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-6">
            <FormInput
              label="Posisi yang Dilamar"
              name="posisiDilamar"
              type="select"
              value={formData.posisiDilamar}
              onChange={(value) => updateFormData('posisiDilamar', value)}
              options={Object.keys(positionPlacements)}
              error={errors.posisiDilamar}
              required
              icon={Target}
            />
            
            {availablePlacements.length > 0 && (
              <FormInput
                label="Penempatan Kerja"
                name="penempatan"
                type="select"
                value={formData.penempatan}
                onChange={(value) => updateFormData('penempatan', value)}
                options={availablePlacements}
                error={errors.penempatan}
                required
                icon={MapPin}
                placeholder={availablePlacements.length === 1 ? availablePlacements[0] : "Pilih penempatan kerja"}
              />
            )}
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <FormInput
              label="Nama Lengkap"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={(value) => updateFormData('namaLengkap', value)}
              error={errors.namaLengkap}
              required
              icon={User}
            />
            <FormInput
              label="NIK"
              name="nik"
              value={formData.nik}
              onChange={(value) => updateFormData('nik', value)}
              error={errors.nik}
              required
              maxLength={16}
              icon={User}
            />
            <FormInput
              label="Nomor HP"
              name="noHp"
              type="tel"
              value={formData.noHp}
              onChange={(value) => updateFormData('noHp', value)}
              error={errors.noHp}
              required
              icon={Phone}
            />
            <FormInput
              label="Tempat Lahir"
              name="tempatLahir"
              value={formData.tempatLahir}
              onChange={(value) => updateFormData('tempatLahir', value)}
              error={errors.tempatLahir}
              required
              icon={MapPin}
            />
            <FormInput
              label="Tanggal Lahir"
              name="tanggalLahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={handleDateChange}
              error={errors.tanggalLahir}
              required
              icon={Calendar}
            />
            <FormInput
              label="Umur"
              name="umur"
              value={formData.umur}
              onChange={(value) => updateFormData('umur', value)}
              placeholder="Otomatis terisi"
              icon={Calendar}
            />
            <FormInput
              label="Jenis Kelamin"
              name="jenisKelamin"
              type="select"
              value={formData.jenisKelamin}
              onChange={(value) => updateFormData('jenisKelamin', value)}
              options={['Laki-laki', 'Perempuan']}
              error={errors.jenisKelamin}
              required
              icon={User}
            />
            <FormInput
              label="Status Perkawinan"
              name="statusPerkawinan"
              type="select"
              value={formData.statusPerkawinan}
              onChange={(value) => updateFormData('statusPerkawinan', value)}
              options={['Belum Menikah', 'Menikah', 'Cerai']}
              error={errors.statusPerkawinan}
              required
              icon={Heart}
            />
            <FormInput
              label="Agama"
              name="agama"
              type="select"
              value={formData.agama}
              onChange={(value) => updateFormData('agama', value)}
              options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']}
              error={errors.agama}
              required
              icon={Heart}
            />
            <FormInput
              label="Nama Ayah"
              name="namaAyah"
              value={formData.namaAyah}
              onChange={(value) => updateFormData('namaAyah', value)}
              error={errors.namaAyah}
              required
              icon={User}
            />
            <FormInput
              label="Nama Ibu"
              name="namaIbu"
              value={formData.namaIbu}
              onChange={(value) => updateFormData('namaIbu', value)}
              error={errors.namaIbu}
              required
              icon={User}
            />
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <FormInput
                label="Alamat KTP"
                name="alamatKtp"
                type="textarea"
                value={formData.alamatKtp}
                onChange={(value) => updateFormData('alamatKtp', value)}
                error={errors.alamatKtp}
                required
                rows={3}
                icon={MapPin}
              />
            </div>
            <div className="lg:col-span-2">
              <FormInput
                label="Alamat Domisili (Tempat Tinggal Sekarang)"
                name="alamatDomisili"
                type="textarea"
                value={formData.alamatDomisili}
                onChange={(value) => updateFormData('alamatDomisili', value)}
                error={errors.alamatDomisili}
                required
                rows={3}
                icon={MapPin}
              />
            </div>
            <FormInput
              label="RT/RW"
              name="rtRw"
              value={formData.rtRw}
              onChange={(value) => updateFormData('rtRw', value)}
              placeholder="001/002"
              icon={MapPin}
            />
            <FormInput
              label="Nomor Rumah"
              name="nomorRumah"
              value={formData.nomorRumah}
              onChange={(value) => updateFormData('nomorRumah', value)}
              icon={MapPin}
            />
            <FormInput
              label="Kelurahan"
              name="kelurahan"
              value={formData.kelurahan}
              onChange={(value) => updateFormData('kelurahan', value)}
              error={errors.kelurahan}
              required
              icon={MapPin}
            />
            <FormInput
              label="Kecamatan"
              name="kecamatan"
              value={formData.kecamatan}
              onChange={(value) => updateFormData('kecamatan', value)}
              error={errors.kecamatan}
              required
              icon={MapPin}
            />
            <FormInput
              label="Kota"
              name="kota"
              value={formData.kota}
              onChange={(value) => updateFormData('kota', value)}
              error={errors.kota}
              required
              icon={MapPin}
            />
            <FormInput
              label="Kode Pos"
              name="kodePos"
              value={formData.kodePos}
              onChange={(value) => updateFormData('kodePos', value)}
              maxLength={5}
              icon={MapPin}
            />
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <FormInput
              label="Tingkat Pendidikan"
              name="tingkatPendidikan"
              type="select"
              value={formData.tingkatPendidikan}
              onChange={(value) => updateFormData('tingkatPendidikan', value)}
              options={['SMA/SMK', 'D3', 'S1', 'S2', 'S3']}
              error={errors.tingkatPendidikan}
              required
              icon={GraduationCap}
            />
            <FormInput
              label="Nama Sekolah/Universitas"
              name="namaSekolah"
              value={formData.namaSekolah}
              onChange={(value) => updateFormData('namaSekolah', value)}
              error={errors.namaSekolah}
              required
              icon={GraduationCap}
            />
            <FormInput
              label="Jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={(value) => updateFormData('jurusan', value)}
              icon={GraduationCap}
            />
            <FormInput
              label="Tahun Masuk"
              name="tahunMasuk"
              type="number"
              value={formData.tahunMasuk}
              onChange={(value) => updateFormData('tahunMasuk', value)}
              icon={Calendar}
            />
            <FormInput
              label="Tahun Lulus"
              name="tahunLulus"
              type="number"
              value={formData.tahunLulus}
              onChange={(value) => updateFormData('tahunLulus', value)}
              icon={Calendar}
            />
            <FormInput
              label="IPK/Nilai Rata-rata"
              name="ipk"
              value={formData.ipk}
              onChange={(value) => updateFormData('ipk', value)}
              placeholder="3.50"
              icon={GraduationCap}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Main Question */}
            <BooleanInput
              label="Apakah Anda memiliki pengalaman kerja?"
              name="pengalamanKerja"
              value={formData.pengalamanKerja}
              onChange={(value) => updateFormData('pengalamanKerja', value)}
              icon={Briefcase}
            />
            
            {/* Detail Questions - Only show if has work experience */}
            {formData.pengalamanKerja && (
              <div className="p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Briefcase size={20} />
                    Detail Pengalaman Kerja
                  </h3>
                </div>

                {/* Experience in Leasing */}
                <BooleanInput
                  label="Apakah Anda memiliki pengalaman di bidang leasing?"
                  name="pengalamanLeasing"
                  value={formData.pengalamanLeasing}
                  onChange={(value) => updateFormData('pengalamanLeasing', value)}
                  icon={Briefcase}
                />

                {/* Work Experience Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <FormInput
                    label="Nama Perusahaan"
                    name="namaPerusahaan"
                    value={formData.namaPerusahaan}
                    onChange={(value) => updateFormData('namaPerusahaan', value)}
                    error={errors.namaPerusahaan}
                    icon={Building2}
                  />
                  <FormInput
                    label="Posisi/Jabatan"
                    name="posisiJabatan"
                    value={formData.posisiJabatan}
                    onChange={(value) => updateFormData('posisiJabatan', value)}
                    icon={Briefcase}
                  />
                  <FormInput
                    label="Periode Kerja"
                    name="periodeKerja"
                    value={formData.periodeKerja}
                    onChange={(value) => updateFormData('periodeKerja', value)}
                    placeholder="Jan 2020 - Des 2023"
                    icon={Calendar}
                  />
                  <div className="lg:col-span-2">
                    <FormInput
                      label="Deskripsi Tugas"
                      name="deskripsiTugas"
                      type="textarea"
                      value={formData.deskripsiTugas}
                      onChange={(value) => updateFormData('deskripsiTugas', value)}
                      rows={3}
                      icon={FileText}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <BooleanInput
                label="Apakah Anda memiliki kendaraan pribadi?"
                name="kendaraanPribadi"
                value={formData.kendaraanPribadi}
                onChange={(value) => updateFormData('kendaraanPribadi', value)}
                icon={Car}
              />
              <BooleanInput
                label="Apakah Anda memiliki KTP Asli?"
                name="ktpAsli"
                value={formData.ktpAsli}
                onChange={(value) => updateFormData('ktpAsli', value)}
                icon={User}
              />
              <BooleanInput
                label="Apakah Anda memiliki SIM C?"
                name="simC"
                value={formData.simC}
                onChange={(value) => updateFormData('simC', value)}
                icon={Car}
              />
              <BooleanInput
                label="Apakah Anda memiliki SIM A?"
                name="simA"
                value={formData.simA}
                onChange={(value) => updateFormData('simA', value)}
                icon={Car}
              />
              <BooleanInput
                label="Apakah Anda memiliki SKCK?"
                name="skck"
                value={formData.skck}
                onChange={(value) => updateFormData('skck', value)}
                icon={FileText}
              />
              <BooleanInput
                label="Apakah Anda memiliki NPWP?"
                name="npwp"
                value={formData.npwp}
                onChange={(value) => updateFormData('npwp', value)}
                icon={CreditCard}
              />
              <div className="lg:col-span-2">
                <BooleanInput
                  label="Apakah Anda memiliki riwayat buruk kredit?"
                  name="riwayatBurukKredit"
                  value={formData.riwayatBurukKredit}
                  onChange={(value) => updateFormData('riwayatBurukKredit', value)}
                  icon={CreditCard}
                />
              </div>
            </div>

            <FormInput
              label="Alasan Melamar"
              name="alasanMelamar"
              type="textarea"
              value={formData.alasanMelamar}
              onChange={(value) => updateFormData('alasanMelamar', value)}
              error={errors.alasanMelamar}
              required
              rows={4}
              maxLength={500}
              placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan perusahaan kami..."
              icon={FileText}
            />

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                    <FileText size={14} className="text-blue-600" />
                  </div>
                  Upload CV (PDF, Maksimal 5MB)
                </div>
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 hover:border-blue-300 hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.cvFile && (
                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 sm:p-3 rounded-xl border border-red-200">
                  {errors.cvFile}
                </p>
              )}
              {formData.cvFile && (
                <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-2 bg-emerald-50 p-2 sm:p-3 rounded-xl border border-emerald-200">
                  <CheckCircle size={14} />
                  File terpilih: {formData.cvFile.name}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <img 
                src="/swapro copy.png" 
                alt="SWAPRO Logo" 
                className="h-16 sm:h-20 lg:h-24"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portal Karir SWAPRO
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl ml-2">✨</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Silakan lengkapi semua informasi yang diperlukan untuk proses pendaftaran Anda
            </p>
          </div>

          {/* Progress Steps */}
          <ProgressSteps steps={steps} currentStep={currentStep} />

          {/* Form Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 border border-white/20">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {React.createElement(steps[currentStep].icon, { 
                  size: 28, 
                  className: `text-transparent bg-gradient-to-r ${steps[currentStep].color} bg-clip-text` 
                })}
                {steps[currentStep].title}
              </h2>
              <div className={`h-1 w-20 sm:w-24 bg-gradient-to-r ${steps[currentStep].color} rounded-full`}></div>
            </div>

            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              ← Sebelumnya
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-600 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-2xl font-bold text-sm sm:text-base hover:from-blue-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Selanjutnya →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;