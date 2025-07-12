import { useState } from "react";
import { Search, MapPin, Clock, Building, X, Upload, FileText, User, Briefcase } from "lucide-react";

export default function SimpleJobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    
    // Professional Info
    position: "",
    experience: "",
    expectedSalary: "",
    availableDate: "",
    
    // Documents
    cv: null as File | null,
    coverLetter: "",
    portfolio: "",
    
    // Additional
    motivation: "",
    skills: ""
  });

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Software Developer",
      company: "PT Tech Solutions",
      location: "Jakarta",
      salary: "Rp 8.000.000 - Rp 12.000.000",
      type: "Full-time",
      description: "Kami mencari software developer yang berpengalaman dalam React dan Node.js untuk bergabung dengan tim kami."
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "PT Digital Marketing",
      location: "Bandung",
      salary: "Rp 10.000.000 - Rp 15.000.000",
      type: "Full-time",
      description: "Posisi marketing manager untuk mengelola strategi pemasaran digital dan tim marketing."
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "PT Analytics Corp",
      location: "Surabaya",
      salary: "Rp 7.000.000 - Rp 10.000.000",
      type: "Contract",
      description: "Mencari data analyst untuk menganalisis data bisnis dan membuat laporan insights."
    }
  ];

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyNow = (job: any) => {
    setSelectedJob(job);
    setApplicationData(prev => ({ ...prev, position: job.title }));
    setShowApplicationForm(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData(prev => ({ ...prev, cv: file }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitApplication = () => {
    // Here you would typically send the application to the server
    alert("Lamaran berhasil dikirim! Terima kasih atas minat Anda.");
    setShowApplicationForm(false);
    setCurrentStep(1);
    setApplicationData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      position: "",
      experience: "",
      expectedSalary: "",
      availableDate: "",
      cv: null,
      coverLetter: "",
      portfolio: "",
      motivation: "",
      skills: ""
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
              <input
                type="text"
                value={applicationData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={applicationData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nomor Telepon *</label>
              <input
                type="tel"
                value={applicationData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <textarea
                value={applicationData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Lahir</label>
              <input
                type="date"
                value={applicationData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Informasi Profesional</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Posisi yang Dilamar</label>
              <input
                type="text"
                value={applicationData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pengalaman Kerja *</label>
              <select
                value={applicationData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Pilih pengalaman</option>
                <option value="fresh-graduate">Fresh Graduate</option>
                <option value="1-2-years">1-2 Tahun</option>
                <option value="3-5-years">3-5 Tahun</option>
                <option value="5-plus-years">5+ Tahun</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gaji yang Diharapkan</label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                placeholder="Contoh: Rp 8.000.000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Dapat Mulai Kerja</label>
              <input
                type="date"
                value={applicationData.availableDate}
                onChange={(e) => handleInputChange("availableDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keahlian *</label>
              <textarea
                value={applicationData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="Sebutkan keahlian yang relevan (pisahkan dengan koma)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Dokumen Lamaran</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Upload CV/Resume *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Klik untuk upload CV
                </label>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, atau DOCX (Max 5MB)</p>
                {applicationData.cv && (
                  <p className="text-green-600 mt-2">✓ {applicationData.cv.name}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover Letter</label>
              <textarea
                value={applicationData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                placeholder="Tuliskan cover letter Anda..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
              <input
                type="url"
                value={applicationData.portfolio}
                onChange={(e) => handleInputChange("portfolio", e.target.value)}
                placeholder="https://portfolio-anda.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Ringkasan Lamaran:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nama:</span> {applicationData.fullName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {applicationData.email}
                </div>
                <div>
                  <span className="font-medium">Telepon:</span> {applicationData.phone}
                </div>
                <div>
                  <span className="font-medium">Posisi:</span> {applicationData.position}
                </div>
                <div>
                  <span className="font-medium">Pengalaman:</span> {applicationData.experience}
                </div>
                <div>
                  <span className="font-medium">CV:</span> {applicationData.cv ? "✓ Uploaded" : "Belum upload"}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Motivasi Bergabung *</label>
              <textarea
                value={applicationData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                placeholder="Mengapa Anda tertarik bergabung dengan perusahaan ini?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Dengan mengirim lamaran ini, Anda menyetujui bahwa data yang diberikan adalah benar dan dapat diverifikasi.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Lowongan Kerja
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Temukan pekerjaan impian Anda
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Cari pekerjaan atau perusahaan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                </div>
              </div>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {job.type}
              </span>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{job.salary}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              {job.description}
            </p>

            {/* Action Button */}
            <button 
              onClick={() => handleApplyNow(job)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Lamar Sekarang
            </button>
          </div>
        ))}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lamar: {selectedJob?.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedJob?.company}
                </p>
              </div>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          step < currentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Pribadi</span>
                <span>Profesional</span>
                <span>Dokumen</span>
                <span>Review</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && (!applicationData.fullName || !applicationData.email || !applicationData.phone)) ||
                      (currentStep === 2 && (!applicationData.experience || !applicationData.skills)) ||
                      (currentStep === 3 && !applicationData.cv)
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjutkan
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitApplication}
                    disabled={!applicationData.motivation}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kirim Lamaran
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}