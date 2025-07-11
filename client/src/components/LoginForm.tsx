import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Gagal login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Recruiter</h2>
          <p className="text-gray-600">Masuk ke dashboard untuk mengelola lowongan</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
              placeholder="recruiter@swapro.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Masukkan password"
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
              <LogIn size={20} />
              {isLoading ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo Login:</strong><br />
            Email: admin@swapro.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;