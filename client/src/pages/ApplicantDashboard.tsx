import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, MapPin, Clock, Building, LogOut, Filter, Star, User, FileText, AlertCircle, CheckCircle } from "lucide-react";
import ApplicantProfileForm from "@/components/ApplicantProfileForm";
import ApplicationStatusCard from "@/components/ApplicationStatusCard";
import ApplicationForm from "@/components/ApplicationForm";

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

interface ApplicantProfile {
  id: string;
  profile_completed: boolean;
  completion_percentage: number;
  has_applied: boolean;
  full_name?: string;
  phone?: string;
  cv_url?: string;
  photo_url?: string;
}

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: "pending" | "reviewing" | "interview" | "accepted" | "rejected" | "withdrawn";
  applied_date: string;
  last_updated: string;
  notes?: string;
}

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

export default function ApplicantDashboard({ onLogout, userProfile }: ApplicantDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<JobPosting | null>(null);
  const [profileData, setProfileData] = useState<ApplicantProfile | null>(null);

  // Mock data - in real app, this would come from API
  const mockProfile: ApplicantProfile = {
    id: "1",
    profile_completed: false,
    completion_percentage: 45,
    has_applied: false,
    full_name: userProfile?.full_name || "John Doe",
    phone: "081234567890"
  };

  const mockApplication: Application | null = null; // Set to null if no application exists
  
  // Use profileData state if available, otherwise use mockProfile
  const currentProfile = profileData || mockProfile;

  // Fetch job postings
  const { data: jobPostings = [], isLoading } = useQuery<JobPosting[]>({
    queryKey: ['/api/job-postings'],
  });

  // Filter jobs based on search criteria
  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || job.locations.some(loc => 
      loc.toLowerCase().includes(selectedLocation.toLowerCase())
    );
    const matchesEmployment = !employmentFilter || job.employment_type === employmentFilter;
    
    return matchesSearch && matchesLocation && matchesEmployment && job.status === 'active';
  });

  // Get unique locations and employment types for filters
  const allLocations = [...new Set(jobPostings.flatMap(job => job.locations))];
  const allEmploymentTypes = [...new Set(jobPostings.map(job => job.employment_type).filter(Boolean))];

  const handleLogout = () => {
    onLogout();
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    if (!currentProfile.profile_completed) {
      setActiveTab("profile");
      return;
    }
    
    if (currentProfile.has_applied) {
      alert("Anda sudah melamar ke satu posisi. Anda hanya dapat melamar ke satu posisi saja.");
      return;
    }
    
    // Find the job and open application form
    const job = filteredJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJobForApplication(job);
    }
  };

  const handleProfileComplete = (profileData: any) => {
    console.log("Profile completed:", profileData);
    // Update profile data
    setProfileData(prev => ({
      ...mockProfile,
      profile_completed: true,
      completion_percentage: 100,
      ...profileData
    }));
    setActiveTab("jobs");
  };

  const handleApplicationSubmit = (applicationData: any) => {
    console.log("Application submitted:", applicationData);
    // Update profile to mark as applied
    setProfileData(prev => prev ? {
      ...prev,
      has_applied: true
    } : null);
    
    // Close application form
    setSelectedJobForApplication(null);
    
    // Switch to application status tab
    setActiveTab("application");
    
    alert("Aplikasi berhasil dikirim! Tim HR akan menghubungi Anda dalam 1-3 hari kerja.");
  };

  const handleApplicationCancel = () => {
    setSelectedJobForApplication(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat lowongan kerja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SWAPRO</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Portal Pelamar
              </Badge>
              {mockProfile.full_name && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Selamat datang, {mockProfile.full_name}
                </span>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Completion Alert */}
        {!mockProfile.profile_completed && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Profil belum lengkap!</strong> Anda perlu melengkapi profil ({mockProfile.completion_percentage}%) 
                  sebelum dapat melamar pekerjaan.
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setActiveTab("profile")}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Lengkapi Sekarang
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Cari Lowongan
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil Saya
              {!mockProfile.profile_completed && (
                <Badge variant="destructive" className="text-xs ml-1">!</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="application" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Status Aplikasi
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Bantuan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Search & Filters */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filter Pencarian
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cari Pekerjaan</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Masukkan kata kunci..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lokasi</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                      >
                        <option value="">Semua Lokasi</option>
                        {allLocations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Employment Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipe Pekerjaan</label>
                      <select
                        value={employmentFilter}
                        onChange={(e) => setEmploymentFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                      >
                        <option value="">Semua Tipe</option>
                        {allEmploymentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedLocation("");
                        setEmploymentFilter("");
                      }}
                    >
                      Reset Filter
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Job Listings */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Lowongan Kerja Tersedia
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ditemukan {filteredJobs.length} lowongan kerja yang sesuai dengan kriteria Anda
                  </p>
                </div>

                <div className="space-y-6">
                  {filteredJobs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Tidak Ada Lowongan Ditemukan
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Coba ubah kriteria pencarian atau filter untuk melihat lowongan lainnya.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.locations.join(", ")}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(job.created_at).toLocaleDateString('id-ID')}
                                </div>
                                {job.employment_type && (
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-1" />
                                    {job.employment_type}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              {job.status === 'urgent' && (
                                <Badge variant="destructive" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                              {job.salary_range && (
                                <Badge variant="secondary" className="text-xs">
                                  {job.salary_range}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4 line-clamp-3">
                            {job.description}
                          </CardDescription>
                          
                          {job.requirements && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                                Persyaratan:
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {job.requirements}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              {job.positions_needed && (
                                <span>{job.positions_needed} posisi tersedia</span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Lihat Detail
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleApply(job.id, job.title)}
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={!currentProfile.profile_completed || currentProfile.has_applied}
                              >
                                {!currentProfile.profile_completed 
                                  ? "Lengkapi Profil Dulu" 
                                  : currentProfile.has_applied 
                                    ? "Sudah Melamar" 
                                    : "Lamar Sekarang"
                                }
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Status Profil Anda
                </CardTitle>
                <CardDescription>
                  Kelengkapan profil sangat penting untuk meningkatkan peluang diterima kerja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Kelengkapan Profil</span>
                    <span className="text-sm font-medium">{currentProfile.completion_percentage}%</span>
                  </div>
                  <Progress value={currentProfile.completion_percentage} className="h-2" />
                  
                  {currentProfile.profile_completed ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Profil sudah lengkap! Anda dapat mulai melamar pekerjaan.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Profil belum lengkap. Lengkapi untuk dapat melamar pekerjaan.
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <ApplicantProfileForm 
              onComplete={handleProfileComplete}
              existingProfile={currentProfile}
            />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Status Aplikasi Anda
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Pantau status aplikasi pekerjaan yang telah Anda kirimkan
              </p>
              
              <ApplicationStatusCard 
                application={mockApplication}
                onViewDetails={() => console.log("View details")}
                onWithdraw={() => console.log("Withdraw application")}
              />
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Panduan Penggunaan Platform</CardTitle>
                <CardDescription>
                  Informasi penting tentang proses aplikasi dan ketentuan platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ketentuan Aplikasi</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Setiap pelamar hanya dapat melamar ke satu posisi</li>
                      <li>• Profil harus lengkap 100% sebelum dapat melamar</li>
                      <li>• Dokumen CV dan foto profil wajib diunggah</li>
                      <li>• Data yang diisi harus valid dan dapat dipertanggungjawabkan</li>
                      <li>• Aplikasi yang sudah disubmit tidak dapat diubah</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Proses Seleksi</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• <strong>Pending:</strong> Aplikasi dalam antrian review</li>
                      <li>• <strong>Reviewing:</strong> Tim HR sedang mengevaluasi aplikasi</li>
                      <li>• <strong>Interview:</strong> Anda dipanggil untuk tahap interview</li>
                      <li>• <strong>Accepted:</strong> Selamat! Aplikasi Anda diterima</li>
                      <li>• <strong>Rejected:</strong> Aplikasi belum berhasil kali ini</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Tips Sukses Aplikasi</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Lengkapi profil dengan data yang akurat dan terkini</li>
                      <li>• Upload CV yang rapi dan profesional</li>
                      <li>• Gunakan foto profil yang sopan dan profesional</li>
                      <li>• Pilih posisi yang sesuai dengan keahlian dan pengalaman</li>
                      <li>• Pastikan kontak yang dicantumkan aktif dan mudah dihubungi</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Form Modal */}
      {selectedJobForApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ApplicationForm
              job={selectedJobForApplication}
              onSubmit={handleApplicationSubmit}
              onCancel={handleApplicationCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}