import { useState, useEffect } from 'react';
import { syncStore } from '@shared/syncStore';
import { 
  SyncedJobPosting, 
  SyncedApplication, 
  SyncedCandidate, 
  SyncedInterview, 
  SyncedMessage,
  SyncedDocument,
  SyncedNotification,
  SyncedStats 
} from '@shared/types';

// Custom hook for synchronized data across admin and applicant roles
export function useSync(userRole: 'admin' | 'applicant', userId?: string) {
  const [jobs, setJobs] = useState<SyncedJobPosting[]>([]);
  const [applications, setApplications] = useState<SyncedApplication[]>([]);
  const [candidates, setCandidates] = useState<SyncedCandidate[]>([]);
  const [interviews, setInterviews] = useState<SyncedInterview[]>([]);
  const [notifications, setNotifications] = useState<SyncedNotification[]>([]);
  const [stats, setStats] = useState<SyncedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initialize mock data
    syncStore.initializeMockData();
    
    // Set initial data
    setJobs(syncStore.getJobs());
    setApplications(userRole === 'admin' ? syncStore.getApplications() : syncStore.getApplicationsByCandidate(userId || ''));
    setCandidates(syncStore.getCandidates());
    setInterviews(userRole === 'admin' ? syncStore.getInterviews() : syncStore.getInterviewsByCandidate(userId || ''));
    setNotifications(syncStore.getNotifications(userId || ''));
    setStats(syncStore.getStats(userRole, userId));
    setIsLoading(false);

    // Subscribe to updates
    const unsubscribers = [
      syncStore.subscribe('jobs_updated', (updatedJobs: SyncedJobPosting[]) => {
        setJobs(updatedJobs);
        setStats(syncStore.getStats(userRole, userId));
      }),
      
      syncStore.subscribe('applications_updated', (updatedApplications: SyncedApplication[]) => {
        if (userRole === 'admin') {
          setApplications(updatedApplications);
        } else {
          setApplications(syncStore.getApplicationsByCandidate(userId || ''));
        }
        setStats(syncStore.getStats(userRole, userId));
      }),
      
      syncStore.subscribe('candidates_updated', (updatedCandidates: SyncedCandidate[]) => {
        setCandidates(updatedCandidates);
        setStats(syncStore.getStats(userRole, userId));
      }),
      
      syncStore.subscribe('interviews_updated', (updatedInterviews: SyncedInterview[]) => {
        if (userRole === 'admin') {
          setInterviews(updatedInterviews);
        } else {
          setInterviews(syncStore.getInterviewsByCandidate(userId || ''));
        }
        setStats(syncStore.getStats(userRole, userId));
      }),
      
      syncStore.subscribe('notifications_updated', (data: { userId: string, notifications: SyncedNotification[] }) => {
        if (data.userId === userId) {
          setNotifications(data.notifications);
        }
      }),
      
      syncStore.subscribe('sync_started', () => setIsSyncing(true)),
      syncStore.subscribe('sync_completed', () => setIsSyncing(false)),
      syncStore.subscribe('sync_failed', () => setIsSyncing(false))
    ];

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [userRole, userId]);

  const actions = {
    // Job actions
    addJob: (job: SyncedJobPosting) => syncStore.addJob(job),
    updateJob: (id: string, updates: Partial<SyncedJobPosting>) => syncStore.updateJob(id, updates),
    deleteJob: (id: string) => syncStore.deleteJob(id),
    
    // Application actions
    addApplication: (application: SyncedApplication) => syncStore.addApplication(application),
    updateApplication: (id: string, updates: Partial<SyncedApplication>) => syncStore.updateApplication(id, updates),
    
    // Interview actions
    addInterview: (interview: SyncedInterview) => syncStore.addInterview(interview),
    updateInterview: (id: string, updates: Partial<SyncedInterview>) => syncStore.updateInterview(id, updates),
    
    // Message actions
    getMessages: (applicationId: string) => syncStore.getMessages(applicationId),
    addMessage: (message: SyncedMessage) => syncStore.addMessage(message),
    
    // Document actions
    getDocuments: (candidateId: string) => syncStore.getDocuments(candidateId),
    addDocument: (document: SyncedDocument) => syncStore.addDocument(document),
    updateDocument: (candidateId: string, documentId: string, updates: Partial<SyncedDocument>) => 
      syncStore.updateDocument(candidateId, documentId, updates),
    
    // Notification actions
    markNotificationAsRead: (notificationId: string) => syncStore.markNotificationAsRead(userId || '', notificationId),
    getUnreadCount: () => syncStore.getUnreadNotificationCount(userId || ''),
    
    // Candidate actions
    updateCandidate: (id: string, updates: Partial<SyncedCandidate>) => syncStore.updateCandidate(id, updates),
    
    // Sync actions
    syncWithBackend: () => syncStore.syncWithBackend()
  };

  return {
    // Data
    jobs,
    applications,
    candidates,
    interviews,
    notifications,
    stats,
    
    // State
    isLoading,
    isSyncing,
    
    // Actions
    ...actions
  };
}

// Specialized hooks for specific use cases
export function useJobSync() {
  const [jobs, setJobs] = useState<SyncedJobPosting[]>([]);
  
  useEffect(() => {
    setJobs(syncStore.getJobs());
    
    const unsubscribe = syncStore.subscribe('jobs_updated', (updatedJobs: SyncedJobPosting[]) => {
      setJobs(updatedJobs);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    jobs,
    addJob: (job: SyncedJobPosting) => syncStore.addJob(job),
    updateJob: (id: string, updates: Partial<SyncedJobPosting>) => syncStore.updateJob(id, updates),
    deleteJob: (id: string) => syncStore.deleteJob(id)
  };
}

export function useApplicationSync(candidateId?: string) {
  const [applications, setApplications] = useState<SyncedApplication[]>([]);
  
  useEffect(() => {
    const apps = candidateId 
      ? syncStore.getApplicationsByCandidate(candidateId)
      : syncStore.getApplications();
    setApplications(apps);
    
    const unsubscribe = syncStore.subscribe('applications_updated', () => {
      const updatedApps = candidateId 
        ? syncStore.getApplicationsByCandidate(candidateId)
        : syncStore.getApplications();
      setApplications(updatedApps);
    });
    
    return unsubscribe;
  }, [candidateId]);
  
  return {
    applications,
    addApplication: (application: SyncedApplication) => syncStore.addApplication(application),
    updateApplication: (id: string, updates: Partial<SyncedApplication>) => syncStore.updateApplication(id, updates)
  };
}

export function useNotificationSync(userId: string) {
  const [notifications, setNotifications] = useState<SyncedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    setNotifications(syncStore.getNotifications(userId));
    setUnreadCount(syncStore.getUnreadNotificationCount(userId));
    
    const unsubscribe = syncStore.subscribe('notifications_updated', (data: { userId: string, notifications: SyncedNotification[] }) => {
      if (data.userId === userId) {
        setNotifications(data.notifications);
        setUnreadCount(syncStore.getUnreadNotificationCount(userId));
      }
    });
    
    return unsubscribe;
  }, [userId]);
  
  return {
    notifications,
    unreadCount,
    markAsRead: (notificationId: string) => syncStore.markNotificationAsRead(userId, notificationId)
  };
}

export function useChatSync(applicationId: string) {
  const [messages, setMessages] = useState<SyncedMessage[]>([]);
  
  useEffect(() => {
    setMessages(syncStore.getMessages(applicationId));
    
    const unsubscribe = syncStore.subscribe('messages_updated', (data: { applicationId: string, messages: SyncedMessage[] }) => {
      if (data.applicationId === applicationId) {
        setMessages(data.messages);
      }
    });
    
    return unsubscribe;
  }, [applicationId]);
  
  return {
    messages,
    addMessage: (message: SyncedMessage) => syncStore.addMessage(message)
  };
}