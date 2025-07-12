import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: "pending" | "reviewing" | "interview" | "accepted" | "rejected";
  applied_date: string;
  last_updated: string;
  notes?: string;
  interview_date?: string;
}

export default function Applications() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Mock data for now - replace with actual API call
  const mockApplications: Application[] = [
    {
      id: "1",
      job_title: "Software Developer",
      company: "PT Tech Indonesia",
      status: "interview",
      applied_date: "2024-01-15",
      last_updated: "2024-01-18",
      interview_date: "2024-01-22",
      notes: "Interview dijadwalkan untuk hari Senin pukul 10:00 WIB"
    },
    {
      id: "2", 
      job_title: "Marketing Manager",
      company: "PT Digital Marketing",
      status: "reviewing",
      applied_date: "2024-01-10",
      last_updated: "2024-01-16",
      notes: "Dokumen sedang dalam tahap review oleh tim HR"
    },
    {
      id: "3",
      job_title: "UI/UX Designer", 
      company: "PT Creative Studio",
      status: "pending",
      applied_date: "2024-01-20",
      last_updated: "2024-01-20"
    }
  ];

  const { data: applications = mockApplications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: false // Using mock data for now
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewing":
        return <AlertCircle className="h-4 w-4" />;
      case "interview":
        return <Calendar className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "reviewing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Review";
      case "reviewing":
        return "Sedang Direview";
      case "interview":
        return "Interview";
      case "accepted":
        return "Diterima";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const filteredApplications = selectedStatus === "all" 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    reviewing: applications.filter(app => app.status === "reviewing").length,
    interview: applications.filter(app => app.status === "interview").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Lamaran Saya</h1>
        <p className="text-green-100">{applications.length} lamaran aktif</p>
      </div>

      {/* Status Tabs */}
      <div className="p-4">
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              Semua ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="interview" className="text-xs">
              Interview ({statusCounts.interview})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="mt-4">
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedStatus === "all" 
                        ? "Anda belum memiliki lamaran. Mulai lamar pekerjaan sekarang!"
                        : `Tidak ada lamaran dengan status "${getStatusText(selectedStatus)}"`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {application.job_title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {application.company}
                          </p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            <span className="text-xs">{getStatusText(application.status)}</span>
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Tanggal Lamar</p>
                            <p className="font-medium">{formatDate(application.applied_date)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Terakhir Update</p>
                            <p className="font-medium">{formatDate(application.last_updated)}</p>
                          </div>
                        </div>

                        {/* Interview Date */}
                        {application.interview_date && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Interview Dijadwalkan</span>
                            </div>
                            <p className="text-sm text-purple-700 dark:text-purple-200 mt-1">
                              {formatDate(application.interview_date)}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {application.notes && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              {application.notes}
                            </p>
                          </div>
                        )}

                        {/* Action Button */}
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}