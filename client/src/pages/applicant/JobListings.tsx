import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search, MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ComprehensiveApplicationForm from "@/components/ComprehensiveApplicationForm";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string[];
  salary_range?: string;
  employment_type?: string;
  description: string;
  requirements?: string;
  created_at: string;
}

export default function JobListings() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<JobPosting[]>({
    queryKey: ["/api/job-postings"],
  });

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApply = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleApplicationSubmit = (applicationData: any) => {
    toast({
      title: "Aplikasi Berhasil Dikirim!",
      description: "Aplikasi Anda sedang dalam proses review. Kami akan menghubungi Anda segera.",
    });
    setSelectedJob(null);
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return "Gaji dapat dinegosiasi";
    return salary;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="pb-20 p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Lowongan Kerja</h1>
            <p className="text-blue-100">{jobs.length} posisi tersedia</p>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari posisi, perusahaan, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Lowongan Baru: Software Developer</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">PT Tech Indonesia - 2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Aplikasi Anda sedang direview</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Marketing Manager - 1 hari yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="p-4 space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Tidak ada lowongan yang sesuai dengan pencarian Anda." : "Belum ada lowongan tersedia."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1 text-gray-600 dark:text-gray-400">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                  </div>
                  {job.employment_type && (
                    <Badge variant="secondary">
                      {job.employment_type}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location.join(", ")}</span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(job.salary_range)}</span>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Diposting {formatDate(job.created_at)}</span>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {job.description.substring(0, 150)}...
                  </p>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button 
                      onClick={() => handleApply(job)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Lamar Sekarang
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Form Modal */}
      {selectedJob && (
        <ComprehensiveApplicationForm
          jobId={parseInt(selectedJob.id)}
          jobTitle={selectedJob.title}
          onSubmit={handleApplicationSubmit}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}