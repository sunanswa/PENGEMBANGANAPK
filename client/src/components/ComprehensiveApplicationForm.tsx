import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, GraduationCap, Briefcase, FileText, Car, CreditCard, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema validasi lengkap sesuai kebutuhan admin
const comprehensiveSchema = z.object({
  // Posisi & Penempatan
  position_applied: z.string().min(1, "Posisi yang dilamar wajib diisi"),
  placement_location: z.string().min(1, "Penempatan wajib diisi"),
  
  // Data Pribadi Lengkap
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d{16}$/, "NIK harus berupa angka"),
  phone: z.string().min(10, "Nomor HP tidak valid"),
  birth_place: z.string().min(2, "Tempat lahir wajib diisi"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Jenis kelamin wajib dipilih" }),
  marital_status: z.enum(["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"], {
    required_error: "Status perkawinan wajib dipilih"
  }),
  religion: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"], {
    required_error: "Agama wajib dipilih"
  }),
  father_name: z.string().min(2, "Nama ayah wajib diisi"),
  mother_name: z.string().min(2, "Nama ibu wajib diisi"),
  
  // Alamat Lengkap
  ktp_address: z.string().min(10, "Alamat KTP wajib diisi"),
  domicile_address: z.string().min(10, "Alamat domisili wajib diisi"),
  rt_rw: z.string().min(1, "RT/RW wajib diisi (format: 01/02)"),
  house_number: z.string().min(1, "Nomor rumah wajib diisi"),
  kelurahan: z.string().min(2, "Kelurahan wajib diisi"),
  kecamatan: z.string().min(2, "Kecamatan wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  postal_code: z.string().min(5, "Kode pos tidak valid"),
  
  // Pendidikan
  education_level: z.enum(["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"], {
    required_error: "Tingkat pendidikan wajib dipilih"
  }),
  school_name: z.string().min(2, "Nama sekolah wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  entry_year: z.coerce.number().min(1950).max(new Date().getFullYear(), "Tahun masuk tidak valid"),
  graduation_year: z.coerce.number().min(1950).max(new Date().getFullYear() + 10, "Tahun lulus tidak valid"),
  gpa: z.string().optional(),
  
  // Pengalaman Kerja
  work_experience: z.string().min(10, "Pengalaman kerja wajib diisi minimal 10 karakter"),
  leasing_experience: z.string().min(5, "Pengalaman leasing wajib diisi"),
  company_name: z.string().optional(),
  job_position: z.string().optional(),
  work_period: z.string().optional(),
  job_description: z.string().optional(),
  
  // Kepemilikan & Dokumen
  private_vehicle: z.enum(["Ada", "Tidak Ada"], { required_error: "Status kendaraan pribadi wajib dipilih" }),
  original_ktp: z.enum(["Ada", "Tidak Ada"], { required_error: "Status KTP asli wajib dipilih" }),
  sim_c: z.enum(["Ada", "Tidak Ada"], { required_error: "Status SIM C wajib dipilih" }),
  sim_a: z.enum(["Ada", "Tidak Ada"], { required_error: "Status SIM A wajib dipilih" }),
  skck: z.enum(["Ada", "Tidak Ada"], { required_error: "Status SKCK wajib dipilih" }),
  npwp: z.enum(["Ada", "Tidak Ada"], { required_error: "Status NPWP wajib dipilih" }),
  bad_credit_history: z.enum(["Ada", "Tidak Ada"], { required_error: "Status riwayat buruk kredit wajib dipilih" }),
  
  // Motivasi & CV
  application_reason: z.string().min(20, "Alasan melamar minimal 20 karakter"),
  cv_url: z.string().min(1, "CV wajib diunggah"),
});

type FormData = z.infer<typeof comprehensiveSchema>;

interface ComprehensiveApplicationFormProps {
  jobId: number;
  jobTitle: string;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

const educationLevels = ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"];
const genderOptions = ["Laki-laki", "Perempuan"];
const maritalOptions = ["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"];
const religionOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"];
const yesNoOptions = ["Ada", "Tidak Ada"];

export default function ComprehensiveApplicationForm({ 
  jobId, 
  jobTitle, 
  onSubmit, 
  onClose 
}: ComprehensiveApplicationFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<FormData>({
    resolver: zodResolver(comprehensiveSchema),
    defaultValues: {
      position_applied: jobTitle,
      placement_location: "",
      cv_url: "",
    }
  });

  // Hitung umur otomatis dari tanggal lahir
  const [calculatedAge, setCalculatedAge] = useState<number>(0);
  const birthDate = form.watch("birth_date");

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    }
  }, [birthDate]);

  const handleFileUpload = async (file: File): Promise<string> => {
    // Simulasi upload file - dalam implementasi nyata akan upload ke server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/uploads/${file.name}`);
      }, 1000);
    });
  };

  const onCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await handleFileUpload(file);
        form.setValue("cv_url", url);
        toast({
          title: "CV berhasil diunggah",
          description: `File ${file.name} telah diunggah.`,
        });
      } catch (error) {
        toast({
          title: "Gagal mengunggah CV",
          description: "Silakan coba lagi.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (data: FormData) => {
    const dataWithAge = {
      ...data,
      age: calculatedAge
    };
    onSubmit(dataWithAge);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Posisi & Data Pribadi</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position_applied">Posisi yang Dilamar *</Label>
                <Input
                  id="position_applied"
                  {...form.register("position_applied")}
                  readOnly
                  className="bg-gray-50"
                />
                {form.formState.errors.position_applied && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.position_applied.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="placement_location">Penempatan *</Label>
                <Input
                  id="placement_location"
                  placeholder="Contoh: Jakarta Pusat"
                  {...form.register("placement_location")}
                />
                {form.formState.errors.placement_location && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.placement_location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  placeholder="Nama lengkap sesuai KTP"
                  {...form.register("full_name")}
                />
                {form.formState.errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nik">NIK *</Label>
                <Input
                  id="nik"
                  placeholder="16 digit NIK"
                  maxLength={16}
                  {...form.register("nik")}
                />
                {form.formState.errors.nik && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.nik.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">No HP *</Label>
                <Input
                  id="phone"
                  placeholder="08xxxxxxxxxx"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="birth_place">Tempat Lahir *</Label>
                <Input
                  id="birth_place"
                  placeholder="Kota tempat lahir"
                  {...form.register("birth_place")}
                />
                {form.formState.errors.birth_place && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.birth_place.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="birth_date">Tanggal Lahir *</Label>
                <Input
                  id="birth_date"
                  type="date"
                  {...form.register("birth_date")}
                />
                {calculatedAge > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Umur: {calculatedAge} tahun</p>
                )}
                {form.formState.errors.birth_date && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.birth_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Jenis Kelamin *</Label>
                <Select onValueChange={(value) => form.setValue("gender", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="marital_status">Status Perkawinan *</Label>
                <Select onValueChange={(value) => form.setValue("marital_status", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status perkawinan" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.marital_status && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.marital_status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="religion">Agama *</Label>
                <Select onValueChange={(value) => form.setValue("religion", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    {religionOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.religion && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.religion.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="father_name">Nama Ayah *</Label>
                <Input
                  id="father_name"
                  placeholder="Nama lengkap ayah"
                  {...form.register("father_name")}
                />
                {form.formState.errors.father_name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.father_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mother_name">Nama Ibu *</Label>
                <Input
                  id="mother_name"
                  placeholder="Nama lengkap ibu"
                  {...form.register("mother_name")}
                />
                {form.formState.errors.mother_name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.mother_name.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Alamat Lengkap</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="ktp_address">Alamat KTP *</Label>
                <Textarea
                  id="ktp_address"
                  placeholder="Alamat sesuai KTP"
                  {...form.register("ktp_address")}
                />
                {form.formState.errors.ktp_address && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.ktp_address.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="domicile_address">Alamat Domisili *</Label>
                <Textarea
                  id="domicile_address"
                  placeholder="Alamat tempat tinggal saat ini"
                  {...form.register("domicile_address")}
                />
                {form.formState.errors.domicile_address && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.domicile_address.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rt_rw">RT/RW *</Label>
                <Input
                  id="rt_rw"
                  placeholder="Contoh: 01/02"
                  {...form.register("rt_rw")}
                />
                {form.formState.errors.rt_rw && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.rt_rw.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="house_number">Nomor Rumah *</Label>
                <Input
                  id="house_number"
                  placeholder="Nomor rumah"
                  {...form.register("house_number")}
                />
                {form.formState.errors.house_number && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.house_number.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kelurahan">Kelurahan *</Label>
                <Input
                  id="kelurahan"
                  placeholder="Nama kelurahan"
                  {...form.register("kelurahan")}
                />
                {form.formState.errors.kelurahan && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.kelurahan.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kecamatan">Kecamatan *</Label>
                <Input
                  id="kecamatan"
                  placeholder="Nama kecamatan"
                  {...form.register("kecamatan")}
                />
                {form.formState.errors.kecamatan && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.kecamatan.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  placeholder="Nama kota"
                  {...form.register("city")}
                />
                {form.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postal_code">Kode Pos *</Label>
                <Input
                  id="postal_code"
                  placeholder="5 digit kode pos"
                  maxLength={5}
                  {...form.register("postal_code")}
                />
                {form.formState.errors.postal_code && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.postal_code.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <GraduationCap className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Pendidikan</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education_level">Tingkat Pendidikan *</Label>
                <Select onValueChange={(value) => form.setValue("education_level", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.education_level && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.education_level.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="school_name">Nama Sekolah *</Label>
                <Input
                  id="school_name"
                  placeholder="Nama institusi pendidikan"
                  {...form.register("school_name")}
                />
                {form.formState.errors.school_name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.school_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="major">Jurusan *</Label>
                <Input
                  id="major"
                  placeholder="Nama jurusan/bidang studi"
                  {...form.register("major")}
                />
                {form.formState.errors.major && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.major.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="entry_year">Tahun Masuk *</Label>
                <Input
                  id="entry_year"
                  type="number"
                  placeholder="2018"
                  {...form.register("entry_year", { valueAsNumber: true })}
                />
                {form.formState.errors.entry_year && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.entry_year.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="graduation_year">Tahun Lulus *</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  placeholder="2022"
                  {...form.register("graduation_year", { valueAsNumber: true })}
                />
                {form.formState.errors.graduation_year && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.graduation_year.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gpa">IPK (Opsional)</Label>
                <Input
                  id="gpa"
                  placeholder="Contoh: 3.45"
                  {...form.register("gpa")}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="work_experience">Pengalaman Kerja *</Label>
                <Textarea
                  id="work_experience"
                  placeholder="Deskripsikan pengalaman kerja secara umum"
                  {...form.register("work_experience")}
                />
                {form.formState.errors.work_experience && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.work_experience.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="leasing_experience">Pengalaman Leasing *</Label>
                <Textarea
                  id="leasing_experience"
                  placeholder="Deskripsikan pengalaman di bidang leasing/financing"
                  {...form.register("leasing_experience")}
                />
                {form.formState.errors.leasing_experience && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.leasing_experience.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Nama Perusahaan (Terakhir)</Label>
                  <Input
                    id="company_name"
                    placeholder="Nama perusahaan terakhir"
                    {...form.register("company_name")}
                  />
                </div>

                <div>
                  <Label htmlFor="job_position">Posisi Jabatan (Terakhir)</Label>
                  <Input
                    id="job_position"
                    placeholder="Posisi terakhir"
                    {...form.register("job_position")}
                  />
                </div>

                <div>
                  <Label htmlFor="work_period">Periode Kerja</Label>
                  <Input
                    id="work_period"
                    placeholder="Jan 2020 - Des 2022"
                    {...form.register("work_period")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="job_description">Deskripsi Tugas</Label>
                <Textarea
                  id="job_description"
                  placeholder="Deskripsikan tugas dan tanggung jawab"
                  {...form.register("job_description")}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Car className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Kepemilikan & Dokumen</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="private_vehicle">Kendaraan Pribadi *</Label>
                <Select onValueChange={(value) => form.setValue("private_vehicle", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.private_vehicle && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.private_vehicle.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="original_ktp">KTP Asli *</Label>
                <Select onValueChange={(value) => form.setValue("original_ktp", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.original_ktp && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.original_ktp.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sim_c">SIM C *</Label>
                <Select onValueChange={(value) => form.setValue("sim_c", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.sim_c && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.sim_c.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sim_a">SIM A *</Label>
                <Select onValueChange={(value) => form.setValue("sim_a", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.sim_a && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.sim_a.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="skck">SKCK *</Label>
                <Select onValueChange={(value) => form.setValue("skck", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.skck && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.skck.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="npwp">NPWP *</Label>
                <Select onValueChange={(value) => form.setValue("npwp", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.npwp && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.npwp.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bad_credit_history">Riwayat Buruk Kredit *</Label>
                <Select onValueChange={(value) => form.setValue("bad_credit_history", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.bad_credit_history && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.bad_credit_history.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Motivasi & CV</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="application_reason">Alasan Melamar *</Label>
                <Textarea
                  id="application_reason"
                  placeholder="Jelaskan alasan Anda melamar di posisi ini minimal 20 karakter"
                  {...form.register("application_reason")}
                />
                {form.formState.errors.application_reason && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.application_reason.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cv_upload">Upload CV *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cv_upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={onCVUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {form.watch("cv_url") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      CV tersimpan
                    </Badge>
                  )}
                </div>
                {form.formState.errors.cv_url && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.cv_url.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Form Aplikasi Lengkap</CardTitle>
              <CardDescription>
                Lengkapi semua data yang diperlukan untuk melamar posisi: <strong>{jobTitle}</strong>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Langkah {currentStep} dari {totalSteps}</span>
              <span>{Math.round(progress)}% selesai</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh]">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStepContent()}
          </form>
        </CardContent>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Sebelumnya
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Selanjutnya
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Kirim Aplikasi
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}