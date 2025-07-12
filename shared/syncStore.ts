import { 
  SyncedJobPosting, 
  SyncedApplication, 
  SyncedCandidate, 
  SyncedInterview, 
  SyncedMessage, 
  SyncedDocument,
  SyncedNotification,
  SyncedStats,
  SyncEvent 
} from './types';

// Global sync store for cross-role data consistency
class SyncStore {
  private static instance: SyncStore;
  
  // Data stores
  private jobs: Map<string, SyncedJobPosting> = new Map();
  private applications: Map<string, SyncedApplication> = new Map();
  private candidates: Map<string, SyncedCandidate> = new Map();
  private interviews: Map<string, SyncedInterview> = new Map();
  private messages: Map<string, SyncedMessage[]> = new Map(); // keyed by applicationId
  private documents: Map<string, SyncedDocument[]> = new Map(); // keyed by candidateId
  private notifications: Map<string, SyncedNotification[]> = new Map(); // keyed by userId
  
  // Event listeners
  private listeners: Map<string, Function[]> = new Map();
  
  static getInstance(): SyncStore {
    if (!SyncStore.instance) {
      SyncStore.instance = new SyncStore();
    }
    return SyncStore.instance;
  }

  // Event system
  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    
    return () => {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Job management
  setJobs(jobs: SyncedJobPosting[]) {
    jobs.forEach(job => this.jobs.set(job.id, job));
    this.emit('jobs_updated', this.getJobs());
  }

  getJobs(): SyncedJobPosting[] {
    return Array.from(this.jobs.values());
  }

  getJob(id: string): SyncedJobPosting | undefined {
    return this.jobs.get(id);
  }

  addJob(job: SyncedJobPosting) {
    this.jobs.set(job.id, job);
    this.emit('job_added', job);
    this.emit('jobs_updated', this.getJobs());
  }

  updateJob(id: string, updates: Partial<SyncedJobPosting>) {
    const job = this.jobs.get(id);
    if (job) {
      const updatedJob = { ...job, ...updates };
      this.jobs.set(id, updatedJob);
      this.emit('job_updated', updatedJob);
      this.emit('jobs_updated', this.getJobs());
    }
  }

  deleteJob(id: string) {
    this.jobs.delete(id);
    this.emit('job_deleted', id);
    this.emit('jobs_updated', this.getJobs());
  }

  // Application management
  setApplications(applications: SyncedApplication[]) {
    applications.forEach(app => this.applications.set(app.id, app));
    this.emit('applications_updated', this.getApplications());
  }

  getApplications(): SyncedApplication[] {
    return Array.from(this.applications.values());
  }

  getApplicationsByCandidate(candidateId: string): SyncedApplication[] {
    return this.getApplications().filter(app => app.candidateId === candidateId);
  }

  getApplicationsByJob(jobId: string): SyncedApplication[] {
    return this.getApplications().filter(app => app.jobId === jobId);
  }

  getApplication(id: string): SyncedApplication | undefined {
    return this.applications.get(id);
  }

  addApplication(application: SyncedApplication) {
    this.applications.set(application.id, application);
    
    // Update job applicant count
    const job = this.jobs.get(application.jobId);
    if (job) {
      this.updateJob(application.jobId, { 
        applicants: job.applicants + 1 
      });
    }
    
    this.emit('application_added', application);
    this.emit('applications_updated', this.getApplications());
  }

  updateApplication(id: string, updates: Partial<SyncedApplication>) {
    const application = this.applications.get(id);
    if (application) {
      const updatedApplication = { ...application, ...updates };
      this.applications.set(id, updatedApplication);
      this.emit('application_updated', updatedApplication);
      this.emit('applications_updated', this.getApplications());
      
      // Notify both admin and applicant
      this.createNotification({
        id: `app_update_${Date.now()}`,
        userId: application.candidateId,
        userRole: 'applicant',
        title: 'Status Lamaran Diperbarui',
        message: `Status lamaran ${application.jobTitle} telah diperbarui menjadi ${updates.status}`,
        type: 'application',
        priority: 'medium',
        read: false,
        relatedId: id,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Candidate management
  setCandidates(candidates: SyncedCandidate[]) {
    candidates.forEach(candidate => this.candidates.set(candidate.id, candidate));
    this.emit('candidates_updated', this.getCandidates());
  }

  getCandidates(): SyncedCandidate[] {
    return Array.from(this.candidates.values());
  }

  getCandidate(id: string): SyncedCandidate | undefined {
    return this.candidates.get(id);
  }

  updateCandidate(id: string, updates: Partial<SyncedCandidate>) {
    const candidate = this.candidates.get(id);
    if (candidate) {
      const updatedCandidate = { ...candidate, ...updates };
      this.candidates.set(id, updatedCandidate);
      this.emit('candidate_updated', updatedCandidate);
      this.emit('candidates_updated', this.getCandidates());
    }
  }

  // Interview management
  setInterviews(interviews: SyncedInterview[]) {
    interviews.forEach(interview => this.interviews.set(interview.id, interview));
    this.emit('interviews_updated', this.getInterviews());
  }

  getInterviews(): SyncedInterview[] {
    return Array.from(this.interviews.values());
  }

  getInterviewsByCandidate(candidateId: string): SyncedInterview[] {
    return this.getInterviews().filter(interview => interview.candidateId === candidateId);
  }

  addInterview(interview: SyncedInterview) {
    this.interviews.set(interview.id, interview);
    
    // Update application status
    const application = Array.from(this.applications.values())
      .find(app => app.id === interview.applicationId);
    if (application) {
      this.updateApplication(interview.applicationId, {
        status: 'interview',
        interviewDate: interview.date,
        interviewType: interview.type
      });
    }
    
    this.emit('interview_added', interview);
    this.emit('interviews_updated', this.getInterviews());
    
    // Create notifications
    this.createNotification({
      id: `interview_${Date.now()}_candidate`,
      userId: interview.candidateId,
      userRole: 'applicant',
      title: 'Interview Dijadwalkan',
      message: `Interview untuk ${interview.jobTitle} dijadwalkan pada ${interview.date}`,
      type: 'interview',
      priority: 'high',
      read: false,
      relatedId: interview.id,
      timestamp: new Date().toISOString()
    });
  }

  updateInterview(id: string, updates: Partial<SyncedInterview>) {
    const interview = this.interviews.get(id);
    if (interview) {
      const updatedInterview = { ...interview, ...updates };
      this.interviews.set(id, updatedInterview);
      this.emit('interview_updated', updatedInterview);
      this.emit('interviews_updated', this.getInterviews());
    }
  }

  // Message management
  getMessages(applicationId: string): SyncedMessage[] {
    return this.messages.get(applicationId) || [];
  }

  addMessage(message: SyncedMessage) {
    const messages = this.messages.get(message.applicationId) || [];
    messages.push(message);
    this.messages.set(message.applicationId, messages);
    this.emit('message_added', message);
    this.emit('messages_updated', { applicationId: message.applicationId, messages });
    
    // Create notification for recipient
    this.createNotification({
      id: `msg_${Date.now()}`,
      userId: message.recipientId,
      userRole: message.senderRole === 'admin' ? 'applicant' : 'admin',
      title: 'Pesan Baru',
      message: `Pesan baru dari ${message.senderName} untuk ${message.jobTitle}`,
      type: 'message',
      priority: 'medium',
      read: false,
      relatedId: message.applicationId,
      timestamp: new Date().toISOString()
    });
  }

  // Document management
  getDocuments(candidateId: string): SyncedDocument[] {
    return this.documents.get(candidateId) || [];
  }

  addDocument(document: SyncedDocument) {
    const documents = this.documents.get(document.candidateId) || [];
    documents.push(document);
    this.documents.set(document.candidateId, documents);
    this.emit('document_added', document);
    this.emit('documents_updated', { candidateId: document.candidateId, documents });
  }

  updateDocument(candidateId: string, documentId: string, updates: Partial<SyncedDocument>) {
    const documents = this.documents.get(candidateId) || [];
    const index = documents.findIndex(doc => doc.id === documentId);
    if (index > -1) {
      documents[index] = { ...documents[index], ...updates };
      this.documents.set(candidateId, documents);
      this.emit('document_updated', documents[index]);
      this.emit('documents_updated', { candidateId, documents });
      
      // Notify candidate of document review
      if (updates.status) {
        this.createNotification({
          id: `doc_review_${Date.now()}`,
          userId: candidateId,
          userRole: 'applicant',
          title: 'Dokumen Direview',
          message: `Dokumen ${documents[index].name} telah direview: ${updates.status}`,
          type: 'document',
          priority: 'medium',
          read: false,
          relatedId: documentId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  // Notification management
  getNotifications(userId: string): SyncedNotification[] {
    return this.notifications.get(userId) || [];
  }

  createNotification(notification: SyncedNotification) {
    const notifications = this.notifications.get(notification.userId) || [];
    notifications.unshift(notification);
    this.notifications.set(notification.userId, notifications);
    this.emit('notification_added', notification);
    this.emit('notifications_updated', { userId: notification.userId, notifications });
  }

  markNotificationAsRead(userId: string, notificationId: string) {
    const notifications = this.notifications.get(userId) || [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set(userId, notifications);
      this.emit('notification_read', notification);
      this.emit('notifications_updated', { userId, notifications });
    }
  }

  getUnreadNotificationCount(userId: string): number {
    const notifications = this.notifications.get(userId) || [];
    return notifications.filter(n => !n.read).length;
  }

  // Statistics
  getStats(userRole: 'admin' | 'applicant', userId?: string): SyncedStats {
    if (userRole === 'admin') {
      const jobs = this.getJobs();
      const applications = this.getApplications();
      const candidates = this.getCandidates();
      const interviews = this.getInterviews();
      
      return {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalApplications: applications.length,
        totalCandidates: candidates.length,
        pendingReviews: applications.filter(a => a.status === 'submitted').length,
        scheduledInterviews: interviews.filter(i => i.status === 'scheduled').length,
        myApplications: 0,
        pendingApplications: 0,
        interviews: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        profileViews: 0,
        savedJobs: 0
      };
    } else {
      const myApplications = userId ? this.getApplicationsByCandidate(userId) : [];
      const myInterviews = userId ? this.getInterviewsByCandidate(userId) : [];
      
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalCandidates: 0,
        pendingReviews: 0,
        scheduledInterviews: 0,
        myApplications: myApplications.length,
        pendingApplications: myApplications.filter(a => ['submitted', 'viewed'].includes(a.status)).length,
        interviews: myInterviews.filter(i => i.status === 'scheduled').length,
        acceptedApplications: myApplications.filter(a => a.status === 'accepted').length,
        rejectedApplications: myApplications.filter(a => a.status === 'rejected').length,
        profileViews: userId ? (this.getCandidate(userId)?.profileCompletion || 0) : 0,
        savedJobs: this.getJobs().filter(j => j.saved).length
      };
    }
  }

  // Sync with backend
  async syncWithBackend() {
    try {
      // This would normally sync with your backend API
      console.log('Syncing with backend...');
      this.emit('sync_started', {});
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.emit('sync_completed', {});
    } catch (error) {
      console.error('Sync failed:', error);
      this.emit('sync_failed', error);
    }
  }

  // Initialize with mock data
  initializeMockData() {
    // Add mock jobs
    this.setJobs([
      {
        id: '1',
        title: 'Senior Software Developer',
        company: 'PT Tech Solutions',
        companyLogo: '🏢',
        location: 'Jakarta',
        salary: 'Rp 15.000.000 - Rp 20.000.000',
        type: 'Full-time',
        experience: '3-5 tahun',
        postedDate: '2025-07-10',
        applicants: 45,
        match: 92,
        saved: true,
        urgent: true,
        description: 'Looking for experienced software developer...',
        requirements: ['3+ years experience', 'React expertise', 'Node.js knowledge'],
        benefits: ['Health insurance', 'Flexible hours', 'Remote work'],
        skills: ['React', 'Node.js', 'TypeScript'],
        status: 'active'
      }
    ]);

    // Add mock applications
    this.setApplications([
      {
        id: '1',
        jobId: '1',
        jobTitle: 'Senior Software Developer',
        company: 'PT Tech Solutions',
        companyLogo: '🏢',
        candidateId: 'candidate1',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        candidatePhone: '+62 812-3456-7890',
        appliedDate: '2025-07-10',
        status: 'interview',
        interviewDate: '2025-07-15',
        interviewType: 'video',
        lastUpdate: '2025-07-12',
        urgency: 'high',
        location: 'Jakarta',
        salary: 'Rp 15.000.000 - Rp 20.000.000'
      }
    ]);

    // Add mock candidates
    this.setCandidates([
      {
        id: 'candidate1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+62 812-3456-7890',
        location: 'Jakarta, Indonesia',
        profileCompletion: 85,
        lastActive: '2025-07-12',
        totalApplications: 5,
        successfulApplications: 2,
        skillScore: 87,
        status: 'active',
        experience: [],
        education: [],
        skills: [],
        documents: []
      }
    ]);
  }
}

export const syncStore = SyncStore.getInstance();