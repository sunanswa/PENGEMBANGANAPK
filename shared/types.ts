// Shared types for cross-role synchronization
export interface SyncedJobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  postedDate: string;
  applicants: number;
  match?: number;
  saved?: boolean;
  urgent: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  status: 'active' | 'closed' | 'draft' | 'urgent';
}

export interface SyncedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  appliedDate: string;
  status: 'submitted' | 'viewed' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
  interviewDate?: string;
  interviewType?: 'phone' | 'video' | 'onsite';
  feedback?: string;
  recruiterName?: string;
  lastUpdate: string;
  urgency: 'low' | 'medium' | 'high';
  documents?: SyncedDocument[];
  notes?: string;
  location: string;
  salary: string;
}

export interface SyncedCandidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  profileCompletion: number;
  lastActive: string;
  totalApplications: number;
  successfulApplications: number;
  averageRating?: number;
  skillScore: number;
  experience: SyncedExperience[];
  education: SyncedEducation[];
  skills: SyncedSkill[];
  documents: SyncedDocument[];
}

export interface SyncedInterview {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  interviewerName: string;
  interviewerRole: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  duration: string;
  location?: string;
  meetingLink?: string;
  phoneNumber?: string;
  notes?: string;
  preparation?: string[];
  feedback?: string;
  rating?: number;
  recruiterNotes?: string;
}

export interface SyncedMessage {
  id: string;
  applicationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'applicant';
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  status: 'sent' | 'delivered' | 'read';
  jobTitle: string;
  company: string;
}

export interface SyncedDocument {
  id: string;
  candidateId: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  size: string;
  url?: string;
  reviewedBy?: string;
  reviewDate?: string;
  rejectionReason?: string;
}

export interface SyncedExperience {
  id: string;
  candidateId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface SyncedEducation {
  id: string;
  candidateId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface SyncedSkill {
  id: string;
  candidateId: string;
  name: string;
  level: number;
  verified: boolean;
  endorsements: number;
}

export interface SyncedNotification {
  id: string;
  userId: string;
  userRole: 'admin' | 'applicant';
  title: string;
  message: string;
  type: 'application' | 'interview' | 'message' | 'document' | 'system';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
  timestamp: string;
}

export interface SyncedStats {
  // Admin stats
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalCandidates: number;
  pendingReviews: number;
  scheduledInterviews: number;
  
  // Applicant stats
  myApplications: number;
  pendingApplications: number;
  interviews: number;
  acceptedApplications: number;
  rejectedApplications: number;
  profileViews: number;
  savedJobs: number;
}

// Real-time sync events
export interface SyncEvent {
  type: 'job_created' | 'job_updated' | 'application_submitted' | 'application_status_changed' | 
        'interview_scheduled' | 'interview_updated' | 'message_sent' | 'document_uploaded' | 
        'document_reviewed' | 'notification_created';
  data: any;
  userId?: string;
  userRole?: 'admin' | 'applicant';
  timestamp: string;
}