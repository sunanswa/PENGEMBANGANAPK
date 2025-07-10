import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Users, 
  MapPin, 
  Star, 
  Building2, 
  Award, 
  Clock, 
  Shield,
  Heart,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  Handshake,
  Phone,
  Headphones,
  UserCheck,
  Globe,
  Briefcase,
  Settings
} from 'lucide-react';

interface LandingPageProps {
  onStartApplication: () => void;
  onShowAuth: () => void;
  onBypassAdmin?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartApplication, onShowAuth, onBypassAdmin }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Users, number: '1,000+', label: 'Tenaga Kerja Aktif', color: 'from-blue-400 to-blue-500' },
    { icon: Handshake, number: '50+', label: 'Klien Terpercaya', color: 'from-orange-400 to-orange-500' },
    { icon: Award, number: '15+', label: 'Tahun Pengalaman', color: 'from-purple-400 to-purple-500' },
    { icon: Globe, number: '70+', label: 'Kota Jangkauan', color: 'from-green-400 to-green-500' }
  ];

  const services = [
    { 
      title: 'Penyediaan SDM', 
      icon: Users, 
      description: 'Solusi tenaga kerja berkualitas untuk berbagai industri',
      color: 'from-blue-400 to-blue-500'
    },
    { 
      title: 'Telemarketing & Call Center', 
      icon: Headphones, 
      description: 'Layanan terintegrasi dari perangkat hingga manajemen pelanggan',
      color: 'from-orange-400 to-orange-500'
    },
    { 
      title: 'Layanan Alihdaya', 
      icon: Settings, 
      description: 'Solusi outsourcing efektif dan efisien untuk perusahaan',
      color: 'from-purple-400 to-purple-500'
    },
    { 
      title: 'Rekrutmen Profesional', 
      icon: UserCheck, 
      description: 'Layanan rekrutmen untuk Financial & Non-Financial Industry',
      color: 'from-green-400 to-green-500'
    }
  ];

  const positions = [
    { 
      title: 'Sales Officer Chaneling (SOC)', 
      icon: Target, 
      locations: 6, 
      type: 'Sales & Marketing',
      color: 'from-blue-400 to-blue-500'
    },
    { 
      title: 'Credit Marketing Officer', 
      icon: TrendingUp, 
      locations: 2, 
      type: 'Credit & Finance',
      color: 'from-orange-400 to-orange-500'
    },
    { 
      title: 'Telemarketing Specialist', 
      icon: Phone, 
      locations: 2, 
      type: 'Call Center & Communication',
      color: 'from-purple-400 to-purple-500'
    },
    { 
      title: 'Recovery Officer', 
      icon: Zap, 
      locations: 2, 
      type: 'Collection & Recovery',
      color: 'from-green-400 to-green-500'
    }
  ];

  const benefits = [
    { icon: Shield, title: 'Jaminan Kesehatan', desc: 'BPJS & Asuransi Swasta Lengkap' },
    { icon: TrendingUp, title: 'Jenjang Karir Jelas', desc: 'Program Pengembangan Berkelanjutan' },
    { icon: Award, title: 'Bonus & Insentif', desc: 'Reward Berdasarkan Performa Kerja' },
    { icon: Clock, title: 'Work-Life Balance', desc: 'Jam Kerja Fleksibel & Cuti Tahunan' },
    { icon: Users, title: 'Tim Profesional', desc: 'Lingkungan Kerja Supportif & Kolaboratif' },
    { icon: Heart, title: 'Employee Wellness', desc: 'Program Kesehatan Mental & Fisik' }
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      position: 'Sales Officer - Financial Industry',
      text: 'SWAPRO memberikan kesempatan karir yang luar biasa. Dengan pengalaman 15+ tahun, mereka benar-benar memahami kebutuhan industri dan karyawan.',
      rating: 5
    },
    {
      name: 'Ahmad Rizki',
      position: 'Credit Officer - Banking Sector',
      text: 'Bergabung dengan SWAPRO adalah keputusan terbaik. Jangkauan nasional di 70+ kota memberikan peluang karir yang sangat luas.',
      rating: 5
    },
    {
      name: 'Maya Sari',
      position: 'Call Center Supervisor',
      text: 'Layanan terintegrasi SWAPRO dari teknologi hingga manajemen sangat profesional. Tim yang solid dan benefit yang kompetitif.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-orange-100/20"></div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo */}
            <div className="mb-8 sm:mb-12">
              <img 
                src="/swapro copy.png" 
                alt="SWAPRO Logo" 
                className="h-20 sm:h-24 lg:h-32 mx-auto drop-shadow-lg"
              />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portal Karir SWAPRO
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl ml-2">✨</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
              Bergabunglah dengan perusahaan penyedia SDM terpercaya dengan 
              <span className="font-semibold text-blue-600"> 15+ tahun pengalaman</span> melayani 
              <span className="font-semibold text-orange-600"> Financial & Non-Financial Industry</span>
            </p>

            {/* Company Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 max-w-4xl mx-auto shadow-lg border border-white/20">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Berawal dari melayani <span className="font-semibold text-blue-600">SWATAMA Group</span> sejak 2008, 
                kini SWAPRO telah berkembang menjadi perusahaan alihdaya terdepan dengan 
                <span className="font-semibold text-orange-600"> jangkauan nasional di 70+ kota</span> dan 
                <span className="font-semibold text-purple-600"> perwakilan di 10 kota besar Indonesia</span>.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onStartApplication}
                className="group bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Play size={24} className="group-hover:scale-110 transition-transform" />
                Mulai Pendaftaran Sekarang
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onShowAuth}
                className="group bg-white text-blue-600 border-2 border-blue-500 px-8 sm:px-12 py-4 sm:py-6 rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Shield size={24} className="group-hover:rotate-12 transition-transform" />
                Login / Daftar Akun
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 delay-${index * 100}`}
                >
                  <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* BYPASS BUTTON - HAPUS sebelum production! */}
        {onBypassAdmin && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={onBypassAdmin}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              title="Bypass ke Admin Dashboard (Development Only)"
            >
              <Shield size={20} />
              <span className="hidden sm:inline">Admin Bypass</span>
            </button>
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Layanan Terintegrasi SWAPRO
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Dari penyediaan SDM hingga layanan alihdaya, kami memberikan solusi terbaik untuk kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto`}>
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Posisi yang Tersedia
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan posisi yang sesuai dengan passion dan keahlian Anda di berbagai industri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {positions.map((position, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r ${position.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto`}>
                  <position.icon size={32} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
                  {position.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 sm:mb-4 text-center">{position.type}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold">
                  <MapPin size={16} />
                  {position.locations} Lokasi Tersedia
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Mengapa Bergabung dengan SWAPRO?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Nikmati berbagai benefit dan fasilitas terbaik dari perusahaan dengan pengalaman 15+ tahun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <benefit.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Journey Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Perjalanan SWAPRO
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Dari layanan sederhana hingga menjadi pemimpin industri alihdaya
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2008 - Awal Mula</h3>
                  <p className="text-gray-600">Melayani SWATAMA Group dalam penyediaan SDM</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Headphones size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ekspansi Layanan</h3>
                  <p className="text-gray-600">Mengembangkan telemarketing & call center terintegrasi</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Jangkauan Nasional</h3>
                  <p className="text-gray-600">Melayani 70+ kota dengan 10 perwakilan besar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Kata Mereka tentang SWAPRO
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Dengarkan pengalaman langsung dari profesional yang bergabung dengan SWAPRO
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="text-center">
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <div className="font-bold text-lg sm:text-xl text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {testimonials[currentTestimonial].position}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 sm:mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Siap Bergabung dengan SWAPRO?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan profesional yang telah mempercayai SWAPRO sebagai partner karir terbaik selama 15+ tahun
          </p>
          
          <button
            onClick={onStartApplication}
            className="group bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-6 rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
            Daftar Sekarang - Gratis!
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-6">
            <button
              onClick={onShowAuth}
              className="text-blue-100 hover:text-white font-semibold underline transition-colors"
            >
              Sudah punya akun? Login di sini
            </button>
          </div>

          <p className="text-blue-100 text-sm sm:text-base mt-6 sm:mt-8">
            Proses pendaftaran hanya membutuhkan 5-10 menit • Jangkauan nasional 70+ kota
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;