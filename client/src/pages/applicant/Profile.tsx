import { useState } from "react";
import { User, Edit3, Settings, LogOut, Phone, Mail, MapPin, Calendar, Briefcase, GraduationCap, Camera, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ApplicantProfileForm from "@/components/ApplicantProfileForm";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url?: string;
  address: string;
  city: string;
  birth_date: string;
  gender: string;
  education_level: string;
  university: string;
  major: string;
  graduation_year: number;
  experience_years: number;
  skills: string[];
  cv_url?: string;
  work_type_preference: string;
  expected_salary: string;
  profile_completion: number;
}

export default function Profile() {
  const { toast } = useToast();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock user data - replace with actual API call
  const mockUser: UserProfile = {
    id: "1",
    full_name: "Ahmad Rizki Pratama",
    email: "ahmad.rizki@email.com",
    phone: "+62 812-3456-7890",
    photo_url: "/api/placeholder/150/150",
    address: "Jl. Sudirman No. 123",
    city: "Jakarta",
    birth_date: "1995-05-15",
    gender: "Laki-laki",
    education_level: "S1",
    university: "Universitas Indonesia",
    major: "Teknik Informatika",
    graduation_year: 2018,
    experience_years: 5,
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    cv_url: "/cv/ahmad-rizki-cv.pdf",
    work_type_preference: "Full Time",
    expected_salary: "Rp 12.000.000",
    profile_completion: 95
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(mockUser);

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleProfileUpdate = (updatedData: any) => {
    setUserProfile(prev => ({ ...prev, ...updatedData }));
    setShowEditForm(false);
    toast({
      title: "Profil Berhasil Diperbarui",
      description: "Data profil Anda telah berhasil disimpan.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    });
    // Implement actual logout logic here
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <h1 className="text-xl font-bold">Profile Saya</h1>
        <p className="text-purple-100">Kelola informasi personal Anda</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.photo_url} alt={userProfile.full_name} />
                  <AvatarFallback className="text-lg">
                    {userProfile.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{userProfile.full_name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{userProfile.email}</p>
                
                {/* Profile Completion */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Kelengkapan Profil</span>
                    <span className={`text-sm font-semibold ${getCompletionColor(userProfile.profile_completion)}`}>
                      {userProfile.profile_completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userProfile.profile_completion}%` }}
                    />
                  </div>
                  {userProfile.profile_completion < 100 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Lengkapi profil untuk meningkatkan peluang diterima
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={handleEditProfile} className="flex-1">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        {showSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pengaturan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Ubah Password
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Notifikasi Email
              </Button>
              <Separator />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-medium">{userProfile.address}, {userProfile.city}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
                  <p className="font-medium">{formatDate(userProfile.birth_date)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Pendidikan & Pengalaman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Pendidikan Terakhir</p>
              <p className="font-medium">{userProfile.education_level} - {userProfile.major}</p>
              <p className="text-sm text-gray-600">{userProfile.university} ({userProfile.graduation_year})</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Pengalaman Kerja</p>
              <p className="font-medium">{userProfile.experience_years} tahun</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Keahlian</p>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Preferensi Kerja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tipe Pekerjaan</p>
              <p className="font-medium">{userProfile.work_type_preference}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ekspektasi Gaji</p>
              <p className="font-medium">{userProfile.expected_salary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Curriculum Vitae</p>
                    <p className="text-sm text-gray-500">PDF • Terupload</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Lihat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <ApplicantProfileForm
              onComplete={handleProfileUpdate}
              existingProfile={userProfile}
            />
          </div>
        </div>
      )}
    </div>
  );
}