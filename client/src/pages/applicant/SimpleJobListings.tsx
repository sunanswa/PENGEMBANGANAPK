import { useState } from "react";
import { Search, MapPin, Clock, Building, X, Upload, FileText, User, Briefcase } from "lucide-react";

export default function SimpleJobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);
  const [applicationData, setApplicationData] = useState({
    // Data Pribadi
    fullName: "",
    nik: "",
    phone: "",
    birthPlace: "",
    birthDate: "",
    age: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    fatherName: "",
    motherName: "",
    
    // Alamat
    ktpAddress: "",
    currentAddress: "",
    rtRw: "",
    houseNumber: "",
    subDistrict: "",
    district: "",
    city: "",
    postalCode: "",
    
    // Pendidikan
    educationLevel: "",
    schoolName: "",
    major: "",
    graduationYear: "",
    gpa: "",
    
    // Pengalaman
    hasWorkExperience: "",
    
    // Detail Pengalaman (jika Ya)
    hasLeasingExperience: "",
    companyName: "",
    jobPosition: "",
    workPeriod: "",
    jobDescription: "",
    
    // Dokumen
    hasVehicle: "",
    hasOriginalKTP: "",
    hasSIMC: "",
    hasSIMA: "",
    hasSKCK: "",
    hasNPWP: "",
    hasCreditHistory: "",
    
    // CV dan Motivasi
    cv: null as File | null,
    motivation: "",
    
    // Job specific
    position: ""
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
    if (currentStep < totalSteps) {
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

  const handleInputChange = (field: string, value: string | File | null) => {
    setApplicationData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Update total steps based on work experience
      if (field === "hasWorkExperience") {
        if (value === "ya") {
          setTotalSteps(5); // Add experience detail step
        } else {
          setTotalSteps(4); // Remove experience detail step
          // Clear experience detail fields
          newData.hasLeasingExperience = "";
          newData.companyName = "";
          newData.jobPosition = "";
          newData.workPeriod = "";
          newData.jobDescription = "";
        }
      }
      
      return newData;
    });
  };

  const handleSubmitApplication = () => {
    // Here you would typically send the application to the server
    alert("Lamaran berhasil dikirim! Terima kasih atas minat Anda.");
    setShowApplicationForm(false);
    setCurrentStep(1);
    setApplicationData({
      fullName: "",
      nik: "",
      phone: "",
      birthPlace: "",
      birthDate: "",
      age: "",
      gender: "",
      maritalStatus: "",
      religion: "",
      fatherName: "",
      motherName: "",
      ktpAddress: "",
      currentAddress: "",
      rtRw: "",
      houseNumber: "",
      subDistrict: "",
      district: "",
      city: "",
      postalCode: "",
      educationLevel: "",
      schoolName: "",
      major: "",
      graduationYear: "",
      gpa: "",
      hasWorkExperience: "",
      hasLeasingExperience: "",
      companyName: "",
      jobPosition: "",
      workPeriod: "",
      jobDescription: "",
      hasVehicle: "",
      hasOriginalKTP: "",
      hasSIMC: "",
      hasSIMA: "",
      hasSKCK: "",
      hasNPWP: "",
      hasCreditHistory: "",
      cv: null,
      motivation: "",
      position: ""
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Data Pribadi</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  👤 Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={applicationData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  👤 NIK *
                </label>
                <input
                  type="text"
                  value={applicationData.nik}
                  onChange={(e) => handleInputChange("nik", e.target.value)}
                  placeholder="Masukkan nik"
                  maxLength={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">0/16</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📞 Nomor HP *
                </label>
                <input
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Masukkan nomor hp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📍 Tempat Lahir *
                </label>
                <input
                  type="text"
                  value={applicationData.birthPlace}
                  onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                  placeholder="Masukkan tempat lahir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📅 Tanggal Lahir *
                </label>
                <input
                  type="date"
                  value={applicationData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🎂 Umur
                </label>
                <input
                  type="text"
                  value={applicationData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Otomatis terisi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  👤 Jenis Kelamin *
                </label>
                <select
                  value={applicationData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  💍 Status Perkawinan *
                </label>
                <select
                  value={applicationData.maritalStatus}
                  onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Pilih Status Perkawinan</option>
                  <option value="belum-menikah">Belum Menikah</option>
                  <option value="menikah">Menikah</option>
                  <option value="cerai">Cerai</option>
                  <option value="janda-duda">Janda/Duda</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  💙 Agama *
                </label>
                <select
                  value={applicationData.religion}
                  onChange={(e) => handleInputChange("religion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Pilih Agama</option>
                  <option value="islam">Islam</option>
                  <option value="kristen">Kristen</option>
                  <option value="katolik">Katolik</option>
                  <option value="hindu">Hindu</option>
                  <option value="buddha">Buddha</option>
                  <option value="konghucu">Konghucu</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  👤 Nama Ayah *
                </label>
                <input
                  type="text"
                  value={applicationData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  placeholder="Masukkan nama ayah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                👤 Nama Ibu *
              </label>
              <input
                type="text"
                value={applicationData.motherName}
                onChange={(e) => handleInputChange("motherName", e.target.value)}
                placeholder="Masukkan nama ibu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Alamat</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📍 Alamat KTP *
                </label>
                <textarea
                  value={applicationData.ktpAddress}
                  onChange={(e) => handleInputChange("ktpAddress", e.target.value)}
                  placeholder="Masukkan alamat ktp"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📍 Alamat Domisili (Tempat Tinggal Sekarang) *
                </label>
                <textarea
                  value={applicationData.currentAddress}
                  onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                  placeholder="Masukkan alamat domisili (tempat tinggal sekarang)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 RT/RW
                  </label>
                  <input
                    type="text"
                    value={applicationData.rtRw}
                    onChange={(e) => handleInputChange("rtRw", e.target.value)}
                    placeholder="001/002"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 Nomor Rumah
                  </label>
                  <input
                    type="text"
                    value={applicationData.houseNumber}
                    onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                    placeholder="Masukkan nomor rumah"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 Kelurahan *
                  </label>
                  <input
                    type="text"
                    value={applicationData.subDistrict}
                    onChange={(e) => handleInputChange("subDistrict", e.target.value)}
                    placeholder="Masukkan kelurahan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 Kecamatan *
                  </label>
                  <input
                    type="text"
                    value={applicationData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="Masukkan kecamatan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 Kota *
                  </label>
                  <input
                    type="text"
                    value={applicationData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Masukkan kota"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📍 Kode Pos
                  </label>
                  <input
                    type="text"
                    value={applicationData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="Masukkan kode pos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">0/5</div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300">Pendidikan</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🎓 Tingkat Pendidikan *
                </label>
                <select
                  value={applicationData.educationLevel}
                  onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Pilih Tingkat Pendidikan</option>
                  <option value="sd">SD</option>
                  <option value="smp">SMP</option>
                  <option value="sma">SMA</option>
                  <option value="smk">SMK</option>
                  <option value="d3">Diploma 3</option>
                  <option value="s1">Sarjana (S1)</option>
                  <option value="s2">Magister (S2)</option>
                  <option value="s3">Doktor (S3)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🎓 Nama Sekolah/Universitas *
                </label>
                <input
                  type="text"
                  value={applicationData.schoolName}
                  onChange={(e) => handleInputChange("schoolName", e.target.value)}
                  placeholder="Masukkan nama sekolah/universitas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🎓 Jurusan
                </label>
                <input
                  type="text"
                  value={applicationData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="Masukkan jurusan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📅 Tahun Masuk
                </label>
                <input
                  type="text"
                  value={applicationData.graduationYear}
                  onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                  placeholder="Masukkan tahun masuk"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📅 Tahun Lulus
                </label>
                <input
                  type="text"
                  placeholder="Masukkan tahun lulus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🎓 IPK/Nilai Rata-rata
                </label>
                <input
                  type="text"
                  value={applicationData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  placeholder="3.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 mt-8">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">Pengalaman</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                🏢 Apakah Anda memiliki pengalaman kerja?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasWorkExperience"
                    value="ya"
                    checked={applicationData.hasWorkExperience === "ya"}
                    onChange={(e) => handleInputChange("hasWorkExperience", e.target.value)}
                    className="mr-2"
                  />
                  Ya
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasWorkExperience"
                    value="tidak"
                    checked={applicationData.hasWorkExperience === "tidak"}
                    onChange={(e) => handleInputChange("hasWorkExperience", e.target.value)}
                    className="mr-2"
                  />
                  Tidak
                </label>
              </div>
            </div>
          </div>
        );
      
      case 4:
        // Show experience detail step or skip to documents
        if (totalSteps === 5 && applicationData.hasWorkExperience === "ya") {
          return (
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 mb-6">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Pengalaman</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🏢 Apakah Anda memiliki pengalaman kerja?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasWorkExperience"
                      value="ya"
                      checked={applicationData.hasWorkExperience === "ya"}
                      onChange={(e) => handleInputChange("hasWorkExperience", e.target.value)}
                      className="mr-2 text-green-500"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasWorkExperience"
                      value="tidak"
                      checked={applicationData.hasWorkExperience === "tidak"}
                      onChange={(e) => handleInputChange("hasWorkExperience", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              {applicationData.hasWorkExperience === "ya" && (
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center mb-4">
                    <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">🏢 Detail Pengalaman Kerja</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                      🏢 Apakah Anda memiliki pengalaman di bidang leasing?
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasLeasingExperience"
                          value="ya"
                          checked={applicationData.hasLeasingExperience === "ya"}
                          onChange={(e) => handleInputChange("hasLeasingExperience", e.target.value)}
                          className="mr-2"
                        />
                        Ya
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasLeasingExperience"
                          value="tidak"
                          checked={applicationData.hasLeasingExperience === "tidak"}
                          onChange={(e) => handleInputChange("hasLeasingExperience", e.target.value)}
                          className="mr-2"
                        />
                        Tidak
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                        🏢 Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        value={applicationData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Masukkan nama perusahaan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                        👤 Posisi/Jabatan
                      </label>
                      <input
                        type="text"
                        value={applicationData.jobPosition}
                        onChange={(e) => handleInputChange("jobPosition", e.target.value)}
                        placeholder="Masukkan posisi/jabatan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                      📅 Periode Kerja
                    </label>
                    <input
                      type="text"
                      value={applicationData.workPeriod}
                      onChange={(e) => handleInputChange("workPeriod", e.target.value)}
                      placeholder="Jan 2020 - Des 2023"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                      📄 Deskripsi Tugas
                    </label>
                    <textarea
                      value={applicationData.jobDescription}
                      onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                      placeholder="Masukkan deskripsi tugas"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }
        // If no work experience (totalSteps = 4), show documents
        if (totalSteps === 4) {
          return (
            <div className="space-y-4">
              <div className="border-l-4 border-teal-500 pl-4 mb-6">
                <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300">Dokumen</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    🚗 Apakah Anda memiliki kendaraan pribadi?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasVehicle"
                        value="ya"
                        checked={applicationData.hasVehicle === "ya"}
                        onChange={(e) => handleInputChange("hasVehicle", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasVehicle"
                        value="tidak"
                        checked={applicationData.hasVehicle === "tidak"}
                        onChange={(e) => handleInputChange("hasVehicle", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    👤 Apakah Anda memiliki KTP Asli?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasOriginalKTP"
                        value="ya"
                        checked={applicationData.hasOriginalKTP === "ya"}
                        onChange={(e) => handleInputChange("hasOriginalKTP", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasOriginalKTP"
                        value="tidak"
                        checked={applicationData.hasOriginalKTP === "tidak"}
                        onChange={(e) => handleInputChange("hasOriginalKTP", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📄 Apakah Anda memiliki SIM C?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSIMC"
                        value="ya"
                        checked={applicationData.hasSIMC === "ya"}
                        onChange={(e) => handleInputChange("hasSIMC", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSIMC"
                        value="tidak"
                        checked={applicationData.hasSIMC === "tidak"}
                        onChange={(e) => handleInputChange("hasSIMC", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📄 Apakah Anda memiliki SIM A?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSIMA"
                        value="ya"
                        checked={applicationData.hasSIMA === "ya"}
                        onChange={(e) => handleInputChange("hasSIMA", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSIMA"
                        value="tidak"
                        checked={applicationData.hasSIMA === "tidak"}
                        onChange={(e) => handleInputChange("hasSIMA", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📄 Apakah Anda memiliki SKCK?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSKCK"
                        value="ya"
                        checked={applicationData.hasSKCK === "ya"}
                        onChange={(e) => handleInputChange("hasSKCK", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSKCK"
                        value="tidak"
                        checked={applicationData.hasSKCK === "tidak"}
                        onChange={(e) => handleInputChange("hasSKCK", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                    📄 Apakah Anda memiliki NPWP?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasNPWP"
                        value="ya"
                        checked={applicationData.hasNPWP === "ya"}
                        onChange={(e) => handleInputChange("hasNPWP", e.target.value)}
                        className="mr-2"
                      />
                      Ya
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasNPWP"
                        value="tidak"
                        checked={applicationData.hasNPWP === "tidak"}
                        onChange={(e) => handleInputChange("hasNPWP", e.target.value)}
                        className="mr-2"
                      />
                      Tidak
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Apakah Anda memiliki riwayat buruk kredit?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCreditHistory"
                      value="ya"
                      checked={applicationData.hasCreditHistory === "ya"}
                      onChange={(e) => handleInputChange("hasCreditHistory", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCreditHistory"
                      value="tidak"
                      checked={applicationData.hasCreditHistory === "tidak"}
                      onChange={(e) => handleInputChange("hasCreditHistory", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Upload CV/Resume *
                </label>
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
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Alasan Melamar *
                </label>
                <textarea
                  value={applicationData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan perusahaan kami..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">0/500</div>
              </div>
            </div>
          );
        }
        return null;
      
      case 5:
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-teal-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300">Dokumen</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  🚗 Apakah Anda memiliki kendaraan pribadi?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasVehicle"
                      value="ya"
                      checked={applicationData.hasVehicle === "ya"}
                      onChange={(e) => handleInputChange("hasVehicle", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasVehicle"
                      value="tidak"
                      checked={applicationData.hasVehicle === "tidak"}
                      onChange={(e) => handleInputChange("hasVehicle", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  👤 Apakah Anda memiliki KTP Asli?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasOriginalKTP"
                      value="ya"
                      checked={applicationData.hasOriginalKTP === "ya"}
                      onChange={(e) => handleInputChange("hasOriginalKTP", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasOriginalKTP"
                      value="tidak"
                      checked={applicationData.hasOriginalKTP === "tidak"}
                      onChange={(e) => handleInputChange("hasOriginalKTP", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Apakah Anda memiliki SIM C?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSIMC"
                      value="ya"
                      checked={applicationData.hasSIMC === "ya"}
                      onChange={(e) => handleInputChange("hasSIMC", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSIMC"
                      value="tidak"
                      checked={applicationData.hasSIMC === "tidak"}
                      onChange={(e) => handleInputChange("hasSIMC", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Apakah Anda memiliki SIM A?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSIMA"
                      value="ya"
                      checked={applicationData.hasSIMA === "ya"}
                      onChange={(e) => handleInputChange("hasSIMA", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSIMA"
                      value="tidak"
                      checked={applicationData.hasSIMA === "tidak"}
                      onChange={(e) => handleInputChange("hasSIMA", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Apakah Anda memiliki SKCK?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSKCK"
                      value="ya"
                      checked={applicationData.hasSKCK === "ya"}
                      onChange={(e) => handleInputChange("hasSKCK", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasSKCK"
                      value="tidak"
                      checked={applicationData.hasSKCK === "tidak"}
                      onChange={(e) => handleInputChange("hasSKCK", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  📄 Apakah Anda memiliki NPWP?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasNPWP"
                      value="ya"
                      checked={applicationData.hasNPWP === "ya"}
                      onChange={(e) => handleInputChange("hasNPWP", e.target.value)}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasNPWP"
                      value="tidak"
                      checked={applicationData.hasNPWP === "tidak"}
                      onChange={(e) => handleInputChange("hasNPWP", e.target.value)}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                📄 Apakah Anda memiliki riwayat buruk kredit?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasCreditHistory"
                    value="ya"
                    checked={applicationData.hasCreditHistory === "ya"}
                    onChange={(e) => handleInputChange("hasCreditHistory", e.target.value)}
                    className="mr-2"
                  />
                  Ya
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasCreditHistory"
                    value="tidak"
                    checked={applicationData.hasCreditHistory === "tidak"}
                    onChange={(e) => handleInputChange("hasCreditHistory", e.target.value)}
                    className="mr-2"
                  />
                  Tidak
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                📄 Upload CV/Resume *
              </label>
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
              <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                📄 Alasan Melamar *
              </label>
              <textarea
                value={applicationData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan perusahaan kami..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">0/500</div>
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
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
                    {step < totalSteps && (
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
                <span>Data Pribadi</span>
                <span>Alamat</span>
                <span>Pendidikan</span>
                {totalSteps === 5 && <span>Pengalaman</span>}
                <span>Dokumen</span>
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
                
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && (!applicationData.fullName || !applicationData.nik || !applicationData.phone || !applicationData.birthPlace || !applicationData.birthDate || !applicationData.gender || !applicationData.maritalStatus || !applicationData.religion || !applicationData.fatherName || !applicationData.motherName)) ||
                      (currentStep === 2 && (!applicationData.ktpAddress || !applicationData.currentAddress || !applicationData.subDistrict || !applicationData.district || !applicationData.city)) ||
                      (currentStep === 3 && (!applicationData.educationLevel || !applicationData.schoolName)) ||
                      (currentStep === 4 && totalSteps === 5 && applicationData.hasWorkExperience === "ya" && (!applicationData.companyName || !applicationData.jobPosition)) ||
                      (currentStep === totalSteps && (!applicationData.cv || !applicationData.motivation))
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjutkan
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitApplication}
                    disabled={!applicationData.cv || !applicationData.motivation}
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