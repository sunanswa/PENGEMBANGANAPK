import type { Express } from "express";
import { syncStore } from "@shared/syncStore";

export function registerSyncRoutes(app: Express) {
  // Get all jobs for both admin and applicant
  app.get('/api/sync/jobs', async (req, res) => {
    try {
      const jobs = syncStore.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching synced jobs:', error);
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  // Get applications (filtered by role)
  app.get('/api/sync/applications', async (req, res) => {
    try {
      const { candidateId } = req.query;
      const applications = candidateId 
        ? syncStore.getApplicationsByCandidate(candidateId as string)
        : syncStore.getApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching synced applications:', error);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  // Get candidates (admin only)
  app.get('/api/sync/candidates', async (req, res) => {
    try {
      const candidates = syncStore.getCandidates();
      res.json(candidates);
    } catch (error) {
      console.error('Error fetching synced candidates:', error);
      res.status(500).json({ message: 'Failed to fetch candidates' });
    }
  });

  // Get interviews (filtered by role)
  app.get('/api/sync/interviews', async (req, res) => {
    try {
      const { candidateId } = req.query;
      const interviews = candidateId 
        ? syncStore.getInterviewsByCandidate(candidateId as string)
        : syncStore.getInterviews();
      res.json(interviews);
    } catch (error) {
      console.error('Error fetching synced interviews:', error);
      res.status(500).json({ message: 'Failed to fetch interviews' });
    }
  });

  // Get notifications by user
  app.get('/api/sync/notifications/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = syncStore.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching synced notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  // Get stats by role
  app.get('/api/sync/stats', async (req, res) => {
    try {
      const { role, userId } = req.query;
      const stats = syncStore.getStats(role as 'admin' | 'applicant', userId as string);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching synced stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  // Update application status (cross-role sync)
  app.patch('/api/sync/applications/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      syncStore.updateApplication(id, updates);
      
      const updatedApplication = syncStore.getApplication(id);
      res.json(updatedApplication);
    } catch (error) {
      console.error('Error updating synced application:', error);
      res.status(500).json({ message: 'Failed to update application' });
    }
  });

  // Add new job (admin only)
  app.post('/api/sync/jobs', async (req, res) => {
    try {
      const jobData = req.body;
      syncStore.addJob(jobData);
      res.json(jobData);
    } catch (error) {
      console.error('Error adding synced job:', error);
      res.status(500).json({ message: 'Failed to add job' });
    }
  });

  // Update job (admin only)
  app.patch('/api/sync/jobs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      syncStore.updateJob(id, updates);
      
      const updatedJob = syncStore.getJob(id);
      res.json(updatedJob);
    } catch (error) {
      console.error('Error updating synced job:', error);
      res.status(500).json({ message: 'Failed to update job' });
    }
  });

  // Add new interview
  app.post('/api/sync/interviews', async (req, res) => {
    try {
      const interviewData = req.body;
      syncStore.addInterview(interviewData);
      res.json(interviewData);
    } catch (error) {
      console.error('Error adding synced interview:', error);
      res.status(500).json({ message: 'Failed to add interview' });
    }
  });

  // Add new application
  app.post('/api/sync/applications', async (req, res) => {
    try {
      const applicationData = req.body;
      syncStore.addApplication(applicationData);
      res.json(applicationData);
    } catch (error) {
      console.error('Error adding synced application:', error);
      res.status(500).json({ message: 'Failed to add application' });
    }
  });

  // Get messages for application
  app.get('/api/sync/messages/:applicationId', async (req, res) => {
    try {
      const { applicationId } = req.params;
      const messages = syncStore.getMessages(applicationId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching synced messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Add new message
  app.post('/api/sync/messages', async (req, res) => {
    try {
      const messageData = req.body;
      syncStore.addMessage(messageData);
      res.json(messageData);
    } catch (error) {
      console.error('Error adding synced message:', error);
      res.status(500).json({ message: 'Failed to add message' });
    }
  });

  // Get documents for candidate
  app.get('/api/sync/documents/:candidateId', async (req, res) => {
    try {
      const { candidateId } = req.params;
      const documents = syncStore.getDocuments(candidateId);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching synced documents:', error);
      res.status(500).json({ message: 'Failed to fetch documents' });
    }
  });

  // Update document status
  app.patch('/api/sync/documents/:candidateId/:documentId', async (req, res) => {
    try {
      const { candidateId, documentId } = req.params;
      const updates = req.body;
      syncStore.updateDocument(candidateId, documentId, updates);
      
      const documents = syncStore.getDocuments(candidateId);
      const updatedDocument = documents.find(doc => doc.id === documentId);
      res.json(updatedDocument);
    } catch (error) {
      console.error('Error updating synced document:', error);
      res.status(500).json({ message: 'Failed to update document' });
    }
  });

  // Mark notification as read
  app.patch('/api/sync/notifications/:userId/:notificationId/read', async (req, res) => {
    try {
      const { userId, notificationId } = req.params;
      syncStore.markNotificationAsRead(userId, notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  // Initialize sync store with mock data
  app.post('/api/sync/initialize', async (req, res) => {
    try {
      syncStore.initializeMockData();
      res.json({ message: 'Sync store initialized with mock data' });
    } catch (error) {
      console.error('Error initializing sync store:', error);
      res.status(500).json({ message: 'Failed to initialize sync store' });
    }
  });

  // Force sync with backend
  app.post('/api/sync/force-sync', async (req, res) => {
    try {
      await syncStore.syncWithBackend();
      res.json({ message: 'Sync completed successfully' });
    } catch (error) {
      console.error('Error forcing sync:', error);
      res.status(500).json({ message: 'Failed to force sync' });
    }
  });
}