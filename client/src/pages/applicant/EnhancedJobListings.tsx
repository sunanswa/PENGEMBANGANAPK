import React, { useState } from 'react';
import JobCard from '@/components/JobCard';
import EnhancedJobCard from '@/components/EnhancedJobCard';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Star, 
  Bookmark, 
  BookmarkPlus,
  ArrowRight,
  Users,
  Eye,
  Briefcase,
  TrendingUp,
  Target,
  ChevronDown,
  X,
  SlidersHorizontal,
  Calendar,
  Award,
  CheckCircle
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  postedDate: string;
  applicants: number;
  match: number;
  saved: boolean;
  urgent: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
}

export default function EnhancedJobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    type: "",
    experience: "",
    company: ""
  });
  const [sortBy, setSortBy] = useState("relevance");

  const jobs: Job[] = [
    {
      id: 1,
      title: "Sales Promotion Boy (SPB)",
      company: "PT BESS TREND INDONESIA",
      companyLogo: "🏢",
      location: "Kota Adm. Jakarta Selatan, DKI J...",
      salary: "Rp 2.500.000 - Rp 3.800.000",
      type: "Full-time",
      experience: "SMP",
      postedDate: "2 hari lalu",
      applicants: 800,
      match: 92,
      saved: true,
      urgent: true,
      description: "Kami mencari Sales Promotion Boy yang energik untuk bergabung dengan tim sales kami. Anda akan bertanggung jawab untuk mempromosikan produk dan layanan perusahaan.",
      requirements: [
        "Minimal pendidikan SMP",
        "Usia maksimal 25 tahun",
        "Memiliki kendaraan pribadi (motor)",
        "Komunikatif dan ramah"
      ],
      benefits: [
        "Walk-in Interview",
        "800 Kuota Daftar",
        "Bonus penjualan",
        "Asuransi kesehatan"
      ],
      skills: ["Sales", "Communication", "Marketing", "Customer Service"]
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "PT Digital Innovation",
      companyLogo: "💻",
      location: "Bandung",
      salary: "Rp 10.000.000 - Rp 15.000.000",
      type: "Full-time",
      experience: "2-4 tahun",
      postedDate: "1 hari lalu",
      applicants: 32,
      match: 78,
      saved: false,
      urgent: false,
      description: "Join our growing team as a Frontend Developer. You'll work on cutting-edge web applications using modern technologies and frameworks.",
      requirements: [
        "2+ tahun pengalaman frontend development",
        "Expert dalam React dan TypeScript",
        "Pengalaman dengan state management (Redux/Zustand)",
        "Pemahaman yang baik tentang responsive design"
      ],
      benefits: [
        "Work from home options",
        "Learning allowance",
        "Health insurance",
        "Annual company retreat"
      ],
      skills: ["React", "TypeScript", "Redux", "Tailwind CSS", "Next.js"]
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "PT Startup Unicorn",
      companyLogo: "🦄",
      location: "Remote",
      salary: "Rp 12.000.000 - Rp 18.000.000",
      type: "Contract",
      experience: "2-5 tahun",
      postedDate: "3 hari lalu",
      applicants: 28,
      match: 85,
      saved: true,
      urgent: false,
      description: "We're looking for a versatile Full Stack Developer to join our fast-paced startup environment. You'll work on both frontend and backend systems.",
      requirements: [
        "Strong background in both frontend and backend",
        "Experience with JavaScript/TypeScript ecosystem",
        "Database design and optimization skills",
        "API design and development experience"
      ],
      benefits: [
        "Equity/stock options",
        "Unlimited PTO",
        "Remote work",
        "Latest tech equipment"
      ],
      skills: ["JavaScript", "Node.js", "React", "PostgreSQL", "GraphQL"]
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "PT Enterprise Corp",
      companyLogo: "🏭",
      location: "Surabaya",
      salary: "Rp 9.000.000 - Rp 13.000.000",
      type: "Full-time",
      experience: "1-3 tahun",
      postedDate: "1 minggu lalu",
      applicants: 52,
      match: 65,
      saved: false,
      urgent: false,
      description: "Looking for a Backend Developer to maintain and improve our enterprise-level applications and microservices architecture.",
      requirements: [
        "1+ tahun pengalaman backend development",
        "Proficient dalam Java atau Python",
        "Experience dengan databases dan SQL",
        "Understanding of microservices architecture"
      ],
      benefits: [
        "Comprehensive health coverage",
        "Performance bonus",
        "Career development program",
        "Paid certification courses"
      ],
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Kubernetes"]
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType = !filters.type || job.type === filters.type;
      const matchesExperience = !filters.experience || job.experience.includes(filters.experience);
      
      return matchesSearch && matchesLocation && matchesType && matchesExperience;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date": return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case "salary": return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''));
        case "match": return b.match - a.match;
        case "applicants": return a.applicants - b.applicants;
        default: return b.match - a.match; // relevance
      }
    });

  const clearFilters = () => {
    setFilters({
      location: "",
      salary: "",
      type: "",
      experience: "",
      company: ""
    });
  };

  const renderJobCard = (job: Job) => (
    <div 
      key={job.id}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{job.companyLogo}</div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
              {job.urgent && (
                <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
        </div>
        <button
          onClick={() => toggleSaveJob(job.id)}
          className={`p-2 rounded-lg transition-colors ${
            savedJobs.includes(job.id)
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {savedJobs.includes(job.id) ? <Bookmark className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Briefcase className="h-4 w-4" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{job.applicants} pelamar</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
            +{job.skills.length - 3} lainnya
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{job.match}% Match</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{job.postedDate}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedJob(job)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Detail
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-1">
            <span>Lamar</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderJobDetail = () => {
    if (!selectedJob) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{selectedJob.companyLogo}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedJob.company}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Job Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Lokasi</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedJob.location}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Gaji</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedJob.salary}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Tipe</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedJob.type}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pengalaman</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedJob.experience}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi Pekerjaan</h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedJob.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Persyaratan</h3>
              <ul className="space-y-2">
                {selectedJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Benefits</h3>
              <ul className="space-y-2">
                {selectedJob.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSaveJob(selectedJob.id)}
                className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  savedJobs.includes(selectedJob.id)
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}
              >
                {savedJobs.includes(selectedJob.id) ? <Bookmark className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                <span>{savedJobs.includes(selectedJob.id) ? 'Tersimpan' : 'Simpan'}</span>
              </button>
              <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Lamar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* SWAPRO Header */}
      <SwaprosHeader 
        title="Cari Pekerjaan" 
        subtitle="Temukan pekerjaan impian Anda dengan SWAPRO"
        showSearch={true}
        userRole="applicant"
      />
      
      <div className="p-4 pb-20">
        {/* Search and Filters */}
      <div className="card-enhanced p-6 mb-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pekerjaan atau perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-swapro-outline flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="relevance">Relevansi</option>
            <option value="date">Terbaru</option>
            <option value="salary">Gaji</option>
            <option value="match">Match Score</option>
            <option value="applicants">Fewest Applicants</option>
          </select>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Lokasi</option>
              <option value="jakarta">Jakarta</option>
              <option value="bandung">Bandung</option>
              <option value="surabaya">Surabaya</option>
              <option value="remote">Remote</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Tipe</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Level</option>
              <option value="0-1">Entry Level (0-1 tahun)</option>
              <option value="1-3">Junior (1-3 tahun)</option>
              <option value="3-5">Mid Level (3-5 tahun)</option>
              <option value="5+">Senior (5+ tahun)</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Menampilkan {filteredJobs.length} dari {jobs.length} pekerjaan
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Eye className="h-4 w-4" />
          <span>Saved: {savedJobs.length}</span>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tidak ada pekerjaan ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <EnhancedJobCard 
              key={job.id}
              job={{
                id: job.id.toString(),
                title: job.title,
                company: job.company,
                companyLogo: job.companyLogo,
                location: job.location,
                salary: job.salary,
                type: job.type as 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship',
                workType: 'Onsite' as 'Onsite' | 'Remote' | 'Hybrid',
                postedDate: job.postedDate,
                applicants: job.applicants,
                urgency: job.urgent ? 'high' : 'medium',
                benefits: job.benefits,
                requirements: job.requirements,
                description: job.description,
                rating: 4.5,
                featured: job.saved,
                match: job.match,
                saved: job.saved
              }}
              onClick={() => setSelectedJob(job)}
              onSave={() => handleSaveJob(job.id)}
              onApply={() => setSelectedJob(job)}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Muat Lebih Banyak
          </button>
        </div>
      )}

        {/* Job Detail Modal */}
        {renderJobDetail()}
      </div>
    </div>
  );
}