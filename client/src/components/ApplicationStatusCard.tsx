import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, XCircle, Eye, MessageCircle } from "lucide-react";

interface ApplicationStatusCardProps {
  application: {
    id: string;
    job_title: string;
    company: string;
    status: "pending" | "reviewing" | "interview" | "accepted" | "rejected" | "withdrawn";
    applied_date: string;
    last_updated: string;
    notes?: string;
  } | null;
  onViewDetails?: () => void;
  onWithdraw?: () => void;
}

const statusConfig = {
  pending: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
    description: "Aplikasi Anda sedang dalam antrian untuk direview oleh tim HR"
  },
  reviewing: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Eye,
    description: "Tim HR sedang mengevaluasi aplikasi dan dokumen Anda"
  },
  interview: {
    label: "Tahap Interview",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: MessageCircle,
    description: "Selamat! Anda dipanggil untuk tahap interview"
  },
  accepted: {
    label: "Diterima",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
    description: "Selamat! Aplikasi Anda diterima"
  },
  rejected: {
    label: "Tidak Lolos",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
    description: "Mohon maaf, aplikasi Anda belum berhasil kali ini"
  },
  withdrawn: {
    label: "Dibatalkan",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: XCircle,
    description: "Aplikasi telah dibatalkan"
  }
};

export default function ApplicationStatusCard({ application, onViewDetails, onWithdraw }: ApplicationStatusCardProps) {
  if (!application) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Belum Ada Aplikasi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Anda belum melamar ke posisi manapun. Setiap pelamar hanya dapat melamar ke satu posisi.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Ketentuan Aplikasi
              </span>
            </div>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Anda hanya dapat melamar ke satu posisi</li>
              <li>• Pastikan profil sudah lengkap 100% sebelum melamar</li>
              <li>• Pilih posisi yang paling sesuai dengan kemampuan Anda</li>
              <li>• Aplikasi tidak dapat diubah setelah disubmit</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{application.job_title}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{application.company}</p>
          </div>
          <Badge className={`${config.color} border-0`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Status Aplikasi</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Tanggal Melamar:</span>
            <p className="text-gray-900 dark:text-gray-100">
              {new Date(application.applied_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Terakhir Diperbarui:</span>
            <p className="text-gray-900 dark:text-gray-100">
              {new Date(application.last_updated).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {application.notes && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Catatan dari HR
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {application.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button variant="outline" onClick={onViewDetails} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          )}
          
          {(application.status === "pending" || application.status === "reviewing") && onWithdraw && (
            <Button variant="destructive" onClick={onWithdraw} className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Batalkan Aplikasi
            </Button>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Informasi Penting
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Anda hanya dapat melamar ke satu posisi. Jika ingin melamar ke posisi lain, 
            batalkan aplikasi ini terlebih dahulu. Aplikasi yang dibatalkan tidak dapat dikembalikan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}