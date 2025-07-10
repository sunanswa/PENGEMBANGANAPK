import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  User,
  Shield,
  Users,
  Chrome,
  ArrowLeft
} from 'lucide-react';
import { signUp, signIn, signInWithGoogle } from '../lib/supabase';

interface AuthFormProps {
  onAuthSuccess: (role: 'recruiter' | 'applicant') => void;
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'role-select'>('role-select');
  const [selectedRole, setSelectedRole] = useState<'recruiter' | 'applicant' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: 'recruiter' | 'applicant') => {
    setSelectedRole(role);
    setMode('signup');
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Google auth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error.message || 'Gagal login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Password tidak cocok');
        }
        if (formData.password.length < 6) {
          throw new Error('Password minimal 6 karakter');
        }
        if (!selectedRole) {
          throw new Error('Pilih role terlebih dahulu');
        }

        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          selectedRole
        );

        if (error) throw error;

        if (data.user) {
          onAuthSuccess(selectedRole);
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;

        if (data.user) {
          // We'll determine the role in the parent component
          onAuthSuccess('applicant'); // Default, will be overridden
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Peran Anda</h2>
        <p className="text-gray-600">Bergabunglah sebagai recruiter atau pelamar kerja</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handleRoleSelect('recruiter')}
          className="group p-6 border-2 border-gray-200 rounded-3xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Recruiter / HR</h3>
              <p className="text-gray-600 text-sm">Kelola lowongan pekerjaan dan rekrutmen</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect('applicant')}
          className="group p-6 border-2 border-gray-200 rounded-3xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Pelamar Kerja</h3>
              <p className="text-gray-600 text-sm">Cari dan lamar pekerjaan yang tersedia</p>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Sudah punya akun?</p>
        <button
          onClick={() => setMode('login')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Masuk ke akun existing
        </button>
      </div>

      <button
        onClick={onCancel}
        className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
      >
        Kembali
      </button>
    </div>
  );

  const renderAuthForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {mode === 'login' ? <LogIn size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'Masuk ke Akun' : `Daftar sebagai ${selectedRole === 'recruiter' ? 'Recruiter' : 'Pelamar'}`}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' 
            ? 'Masuk untuk mengakses dashboard Anda' 
            : 'Buat akun baru untuk memulai perjalanan karir Anda'
          }
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-100 rounded-lg">
                  <User size={14} className="text-green-600" />
                </div>
                Nama Lengkap
              </div>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Masukkan nama lengkap"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded-lg">
                <Mail size={14} className="text-blue-600" />
              </div>
              Email
            </div>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 rounded-lg">
                <Lock size={14} className="text-purple-600" />
              </div>
              Password
            </div>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              placeholder={mode === 'signup' ? 'Minimal 6 karakter' : 'Masukkan password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-purple-100 rounded-lg">
                  <Lock size={14} className="text-purple-600" />
                </div>
                Konfirmasi Password
              </div>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Ulangi password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLoading 
              ? (mode === 'login' ? 'Masuk...' : 'Mendaftar...') 
              : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')
            }
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Chrome size={20} />
            {mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}
          </button>
        </div>
      </form>

      <div className="text-center space-y-3">
        <button
          onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          {mode === 'login' 
            ? 'Belum punya akun? Daftar sekarang' 
            : 'Sudah punya akun? Masuk di sini'
          }
        </button>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              if (mode === 'signup') {
                setMode('role-select');
                setSelectedRole(null);
              } else {
                onCancel();
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-semibold"
          >
            <ArrowLeft size={16} />
            {mode === 'signup' ? 'Pilih Role Lain' : 'Kembali'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        {mode === 'role-select' ? renderRoleSelection() : renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthForm;