import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Upload, Phone, MapPin, GraduationCap, Briefcase, Languages, FileText, Camera, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  // Personal Information
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  address: z.string().min(10, "Alamat terlalu singkat"),
  city: z.string().min(2, "Nama kota tidak valid"),
  postal_code: z.string().min(5, "Kode pos tidak valid"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], { required_error: "Jenis kelamin wajib dipilih" }),
  nationality: z.string().min(2, "Kewarganegaraan wajib diisi"),
  id_number: z.string().min(16, "Nomor KTP/Passport tidak valid"),
  
  // Professional Information
  experience_years: z.number().min(0, "Pengalaman tidak boleh negatif"),
  education_level: z.enum(["high_school", "diploma", "bachelor", "master", "doctorate"], {
    required_error: "Tingkat pendidikan wajib dipilih"
  }),
  major: z.string().min(2, "Jurusan/bidang studi wajib diisi"),
  university: z.string().min(2, "Nama institusi pendidikan wajib diisi"),
  graduation_year: z.number().min(1950).max(new Date().getFullYear() + 10, "Tahun kelulusan tidak valid"),
  
  // Work Preferences
  work_type_preference: z.enum(["full_time", "part_time", "contract", "internship"], {
    required_error: "Preferensi tipe pekerjaan wajib dipilih"
  }),
  willing_to_relocate: z.boolean(),
  
  // Documents (URLs akan diisi setelah upload)
  cv_url: z.string().min(1, "CV wajib diunggah"),
  photo_url: z.string().min(1, "Foto profil wajib diunggah"),
  
  // Optional fields
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  expected_salary: z.string().optional(),
  bio: z.string().optional(),
  portfolio_url: z.string().optional(),
  linkedin_url: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ApplicantProfileFormProps {
  onComplete: (data: ProfileFormData) => void;
  existingProfile?: Partial<ProfileFormData>;
}

const educationLevels = {
  high_school: "SMA/SMK",
  diploma: "Diploma (D3)",
  bachelor: "Sarjana (S1)",
  master: "Magister (S2)",
  doctorate: "Doktor (S3)"
};

const workTypes = {
  full_time: "Full Time",
  part_time: "Part Time", 
  contract: "Kontrak",
  internship: "Magang"
};

export default function ApplicantProfileForm({ onComplete, existingProfile }: ApplicantProfileFormProps) {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(existingProfile?.skills || []);
  const [languages, setLanguages] = useState<string[]>(existingProfile?.languages || []);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      willing_to_relocate: false,
      experience_years: 0,
      graduation_year: new Date().getFullYear(),
      ...existingProfile
    }
  });

  const calculateProgress = () => {
    const formValues = form.watch();
    const requiredFields = [
      'full_name', 'phone', 'address', 'city', 'postal_code', 'birth_date',
      'gender', 'nationality', 'id_number', 'education_level', 'major',
      'university', 'graduation_year', 'work_type_preference', 'cv_url', 'photo_url'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = formValues[field as keyof ProfileFormData];
      return value !== "" && value !== undefined && value !== null;
    });
    
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      const updated = [...languages, newLanguage.trim()];
      setLanguages(updated);
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter(l => l !== language));
  };

  // Mock upload function - in real app, this would upload to storage
  const handleFileUpload = async (file: File, type: 'cv' | 'photo') => {
    const setUploading = type === 'cv' ? setUploadingCV : setUploadingPhoto;
    const fieldName = type === 'cv' ? 'cv_url' : 'photo_url';
    
    setUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock URL - in real app, this would be actual uploaded file URL
    const mockUrl = `https://storage.example.com/${type}/${Date.now()}_${file.name}`;
    form.setValue(fieldName, mockUrl);
    
    setUploading(false);
    toast({
      title: "File berhasil diunggah",
      description: `${type === 'cv' ? 'CV' : 'Foto profil'} telah diunggah dengan sukses`,
    });
  };

  const onSubmit = (data: ProfileFormData) => {
    const completeData = {
      ...data,
      skills,
      languages,
      completion_percentage: calculateProgress(),
      profile_completed: calculateProgress() === 100
    };
    
    onComplete(completeData);
    
    toast({
      title: "Profil berhasil disimpan",
      description: "Data profil Anda telah tersimpan dengan lengkap",
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lengkapi Profil Anda
          </CardTitle>
          <CardDescription>
            Isi data profil lengkap sebelum melamar pekerjaan. Data ini wajib diisi dengan benar.
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Kelengkapan Profil</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { step: 1, title: "Data Pribadi", icon: User },
          { step: 2, title: "Pendidikan & Karir", icon: GraduationCap },
          { step: 3, title: "Keahlian & Preferensi", icon: Briefcase },
          { step: 4, title: "Dokumen", icon: FileText }
        ].map(({ step, title, icon: Icon }) => (
          <Card key={step} className={`cursor-pointer transition-colors ${
            currentStep === step ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
          }`} onClick={() => setCurrentStep(step)}>
            <CardContent className="p-4 text-center">
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{title}</div>
              <div className={`text-xs mt-1 ${currentStep === step ? 'text-blue-600' : 'text-gray-500'}`}>
                Langkah {step}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  {...form.register("full_name")}
                  placeholder="Masukkan nama lengkap"
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="081234567890"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Jakarta"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Kode Pos *</Label>
                <Input
                  id="postal_code"
                  {...form.register("postal_code")}
                  placeholder="12345"
                />
                {form.formState.errors.postal_code && (
                  <p className="text-sm text-red-600">{form.formState.errors.postal_code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date">Tanggal Lahir *</Label>
                <Input
                  id="birth_date"
                  type="date"
                  {...form.register("birth_date")}
                />
                {form.formState.errors.birth_date && (
                  <p className="text-sm text-red-600">{form.formState.errors.birth_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin *</Label>
                <Select onValueChange={(value) => form.setValue("gender", value as "male" | "female")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Kewarganegaraan *</Label>
                <Input
                  id="nationality"
                  {...form.register("nationality")}
                  placeholder="Indonesia"
                />
                {form.formState.errors.nationality && (
                  <p className="text-sm text-red-600">{form.formState.errors.nationality.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">Nomor KTP/Passport *</Label>
                <Input
                  id="id_number"
                  {...form.register("id_number")}
                  placeholder="1234567890123456"
                />
                {form.formState.errors.id_number && (
                  <p className="text-sm text-red-600">{form.formState.errors.id_number.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Pendidikan & Karir
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_level">Tingkat Pendidikan *</Label>
                <Select onValueChange={(value) => form.setValue("education_level", value as keyof typeof educationLevels)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(educationLevels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.education_level && (
                  <p className="text-sm text-red-600">{form.formState.errors.education_level.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Jurusan/Bidang Studi *</Label>
                <Input
                  id="major"
                  {...form.register("major")}
                  placeholder="Teknik Informatika"
                />
                {form.formState.errors.major && (
                  <p className="text-sm text-red-600">{form.formState.errors.major.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">Nama Institusi Pendidikan *</Label>
                <Input
                  id="university"
                  {...form.register("university")}
                  placeholder="Universitas Indonesia"
                />
                {form.formState.errors.university && (
                  <p className="text-sm text-red-600">{form.formState.errors.university.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduation_year">Tahun Kelulusan *</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  {...form.register("graduation_year", { valueAsNumber: true })}
                  placeholder="2023"
                />
                {form.formState.errors.graduation_year && (
                  <p className="text-sm text-red-600">{form.formState.errors.graduation_year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_years">Pengalaman Kerja (Tahun) *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  {...form.register("experience_years", { valueAsNumber: true })}
                  placeholder="0"
                />
                {form.formState.errors.experience_years && (
                  <p className="text-sm text-red-600">{form.formState.errors.experience_years.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_position">Posisi Saat Ini</Label>
                <Input
                  id="current_position"
                  {...form.register("current_position")}
                  placeholder="Software Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_company">Perusahaan Saat Ini</Label>
                <Input
                  id="current_company"
                  {...form.register("current_company")}
                  placeholder="PT Tech Indonesia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_salary">Ekspektasi Gaji</Label>
                <Input
                  id="expected_salary"
                  {...form.register("expected_salary")}
                  placeholder="Rp 8.000.000"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Keahlian & Preferensi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="work_type_preference">Preferensi Tipe Pekerjaan *</Label>
                <Select onValueChange={(value) => form.setValue("work_type_preference", value as keyof typeof workTypes)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe pekerjaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(workTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.work_type_preference && (
                  <p className="text-sm text-red-600">{form.formState.errors.work_type_preference.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="willing_to_relocate"
                    checked={form.watch("willing_to_relocate")}
                    onCheckedChange={(checked) => form.setValue("willing_to_relocate", !!checked)}
                  />
                  <Label htmlFor="willing_to_relocate">Bersedia untuk relokasi</Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Keahlian</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Tambah keahlian"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Bahasa yang Dikuasai</Label>
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Tambah bahasa"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  />
                  <Button type="button" onClick={addLanguage} variant="outline">
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <Badge key={language} variant="secondary" className="cursor-pointer" onClick={() => removeLanguage(language)}>
                      {language} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio/Deskripsi Diri</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">URL Portfolio</Label>
                  <Input
                    id="portfolio_url"
                    {...form.register("portfolio_url")}
                    placeholder="https://portfolio.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    {...form.register("linkedin_url")}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Dokumen
              </CardTitle>
              <CardDescription>
                Upload CV dan foto profil Anda. Kedua dokumen ini wajib diunggah.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Curriculum Vitae (CV) *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">
                      Upload file CV dalam format PDF, DOC, atau DOCX
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'cv');
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('cv-upload')?.click()}
                      disabled={uploadingCV}
                    >
                      {uploadingCV ? "Mengupload..." : "Pilih File CV"}
                    </Button>
                    {form.watch("cv_url") && (
                      <p className="text-sm text-green-600 mt-2">✓ CV berhasil diunggah</p>
                    )}
                  </div>
                  {form.formState.errors.cv_url && (
                    <p className="text-sm text-red-600">{form.formState.errors.cv_url.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Foto Profil *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">
                      Upload foto profil dalam format JPG, PNG, atau JPEG
                    </p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'photo');
                      }}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? "Mengupload..." : "Pilih Foto"}
                    </Button>
                    {form.watch("photo_url") && (
                      <p className="text-sm text-green-600 mt-2">✓ Foto berhasil diunggah</p>
                    )}
                  </div>
                  {form.formState.errors.photo_url && (
                    <p className="text-sm text-red-600">{form.formState.errors.photo_url.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Sebelumnya
          </Button>
          
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Selanjutnya
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={progress < 100}
              >
                {progress < 100 ? `Lengkapi Profil (${progress}%)` : "Simpan Profil"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}