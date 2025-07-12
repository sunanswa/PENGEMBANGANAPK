import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building, Clock, DollarSign, Users, FileText, AlertTriangle, Send, X } from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  locations: string[];
  positions_needed?: number;
  requirements?: string;
  salary_range?: string;
  employment_type?: string;
  created_at: string;
}

interface ApplicationFormProps {
  job: JobPosting;
  onSubmit: (applicationData: any) => void;
  onCancel: () => void;
}

const applicationSchema = z.object({
  cover_letter: z.string().min(100, "Surat lamaran minimal 100 karakter"),
  motivation: z.string().min(50, "Motivasi minimal 50 karakter"),
  expected_salary: z.string().optional(),
  available_start_date: z.string().min(1, "Tanggal mulai kerja wajib diisi"),
  preferred_location: z.string().min(1, "Lokasi preferensi wajib dipilih"),
  willing_to_relocate: z.boolean(),
  terms_agreed: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan"
  }),
  privacy_agreed: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui kebijakan privasi"
  }),
  additional_notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplicationForm({ job, onSubmit, onCancel }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      willing_to_relocate: false,
      terms_agreed: false,
      privacy_agreed: false,
      preferred_location: job.locations[0] || "",
      available_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const applicationData = {
      job_id: job.id,
      job_title: job.title,
      company: "SWAPRO",
      ...data,
      applied_date: new Date().toISOString(),
      status: "pending"
    };
    
    onSubmit(applicationData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lamar Pekerjaan</h2>
              <p className="text-gray-600 dark:text-gray-400">Lengkapi formulir aplikasi untuk posisi yang Anda pilih</p>
            </div>
            <Button variant="ghost" onClick={onCancel} className="p-2">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Information */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      SWAPRO
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.locations.join(", ")}
                    </div>
                    {job.employment_type && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.employment_type}
                      </div>
                    )}
                    {job.salary_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary_range}
                      </div>
                    )}
                  </div>
                </div>
                {job.positions_needed && job.positions_needed > 1 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.positions_needed} posisi
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Important Notice */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                    Perhatian Penting
                  </h3>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Anda hanya dapat melamar ke satu posisi di SWAPRO</li>
                    <li>• Aplikasi yang sudah dikirim tidak dapat diubah atau dibatalkan</li>
                    <li>• Pastikan semua informasi yang Anda berikan adalah benar dan akurat</li>
                    <li>• Proses seleksi akan dimulai setelah Anda mengirim aplikasi ini</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Surat Lamaran
                </CardTitle>
                <CardDescription>
                  Tuliskan surat lamaran yang menjelaskan mengapa Anda tertarik dengan posisi ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("cover_letter")}
                  placeholder="Kepada Tim HR SWAPRO,

Saya tertarik untuk melamar posisi [posisi] yang tersedia di perusahaan Anda. Dengan latar belakang pendidikan dan pengalaman yang saya miliki..."
                  rows={8}
                  className="resize-none"
                />
                {form.formState.errors.cover_letter && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.cover_letter.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Minimal 100 karakter. Saat ini: {form.watch("cover_letter")?.length || 0} karakter
                </p>
              </CardContent>
            </Card>

            {/* Motivation */}
            <Card>
              <CardHeader>
                <CardTitle>Motivasi Melamar</CardTitle>
                <CardDescription>
                  Jelaskan motivasi Anda melamar posisi ini dan apa yang membuat Anda cocok
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("motivation")}
                  placeholder="Saya termotivasi melamar posisi ini karena..."
                  rows={4}
                  className="resize-none"
                />
                {form.formState.errors.motivation && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.motivation.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Minimal 50 karakter. Saat ini: {form.watch("motivation")?.length || 0} karakter
                </p>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Pekerjaan</CardTitle>
                <CardDescription>
                  Informasi mengenai preferensi dan ketersediaan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected_salary">Ekspektasi Gaji (Opsional)</Label>
                    <Input
                      id="expected_salary"
                      {...form.register("expected_salary")}
                      placeholder="Rp 8.000.000 - Rp 12.000.000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="available_start_date">Tanggal Mulai Kerja *</Label>
                    <Input
                      id="available_start_date"
                      type="date"
                      {...form.register("available_start_date")}
                    />
                    {form.formState.errors.available_start_date && (
                      <p className="text-sm text-red-600">{form.formState.errors.available_start_date.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_location">Lokasi Preferensi *</Label>
                  <select
                    {...form.register("preferred_location")}
                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="">Pilih lokasi preferensi</option>
                    {job.locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {form.formState.errors.preferred_location && (
                    <p className="text-sm text-red-600">{form.formState.errors.preferred_location.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="willing_to_relocate"
                    checked={form.watch("willing_to_relocate")}
                    onCheckedChange={(checked) => form.setValue("willing_to_relocate", !!checked)}
                  />
                  <Label htmlFor="willing_to_relocate" className="text-sm">
                    Saya bersedia untuk relokasi jika diperlukan
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Catatan Tambahan (Opsional)</CardTitle>
                <CardDescription>
                  Informasi tambahan yang ingin Anda sampaikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("additional_notes")}
                  placeholder="Informasi tambahan, pengalaman khusus, atau hal lain yang ingin Anda sampaikan..."
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Persetujuan</CardTitle>
                <CardDescription>
                  Baca dan setujui syarat dan ketentuan sebelum mengirim aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms_agreed"
                    checked={form.watch("terms_agreed")}
                    onCheckedChange={(checked) => form.setValue("terms_agreed", !!checked)}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms_agreed" className="font-medium">
                      Saya menyetujui syarat dan ketentuan
                    </Label>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Saya memahami bahwa aplikasi ini hanya dapat dikirim satu kali dan tidak dapat diubah. 
                      Saya menjamin bahwa semua informasi yang diberikan adalah benar dan akurat.
                    </p>
                  </div>
                </div>
                {form.formState.errors.terms_agreed && (
                  <p className="text-sm text-red-600">{form.formState.errors.terms_agreed.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy_agreed"
                    checked={form.watch("privacy_agreed")}
                    onCheckedChange={(checked) => form.setValue("privacy_agreed", !!checked)}
                  />
                  <div className="text-sm">
                    <Label htmlFor="privacy_agreed" className="font-medium">
                      Saya menyetujui kebijakan privasi
                    </Label>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Saya menyetujui penggunaan data pribadi saya untuk keperluan proses rekrutmen sesuai 
                      dengan kebijakan privasi SWAPRO.
                    </p>
                  </div>
                </div>
                {form.formState.errors.privacy_agreed && (
                  <p className="text-sm text-red-600">{form.formState.errors.privacy_agreed.message}</p>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mengirim Aplikasi...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Kirim Aplikasi
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}