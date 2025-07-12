import { useState } from "react";
import { Search, MapPin, Clock, Building } from "lucide-react";

export default function SimpleJobListings() {
  const [searchTerm, setSearchTerm] = useState("");

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
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Lamar Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}