import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertJobPostingSchema, insertStatusUpdateSchema, insertSlikCheckSchema, type User } from "@shared/schema";
import { z } from "zod";
import * as communication from "./communication";
import * as analytics from "./analytics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, you'd check the password hash
      // For demo purposes, accept any password
      res.json({ user: { ...user, id: user.id.toString() } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, id: user.id.toString() } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Job posting routes
  app.get("/api/job-postings", async (req, res) => {
    try {
      const { status } = req.query;
      let jobPostings = await storage.getJobPostings();
      
      if (status && status !== 'all') {
        jobPostings = jobPostings.filter(job => job.status === status);
      }
      
      // Convert IDs to strings for frontend compatibility
      const formattedJobs = jobPostings.map(job => ({
        ...job,
        id: job.id.toString(),
        created_at: job.created_at.toISOString(),
        updated_at: job.updated_at.toISOString()
      }));
      
      res.json(formattedJobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job postings" });
    }
  });

  app.get("/api/job-postings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const jobPosting = await storage.getJobPosting(id);
      if (!jobPosting) {
        return res.status(404).json({ error: "Job posting not found" });
      }

      res.json({
        ...jobPosting,
        id: jobPosting.id.toString(),
        created_at: jobPosting.created_at.toISOString(),
        updated_at: jobPosting.updated_at.toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job posting" });
    }
  });

  app.post("/api/job-postings", async (req, res) => {
    try {
      const jobData = insertJobPostingSchema.parse(req.body);
      const jobPosting = await storage.createJobPosting(jobData);
      
      res.json({
        ...jobPosting,
        id: jobPosting.id.toString(),
        created_at: jobPosting.created_at.toISOString(),
        updated_at: jobPosting.updated_at.toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid job data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create job posting" });
    }
  });

  app.put("/api/job-postings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const jobData = insertJobPostingSchema.partial().parse(req.body);
      const jobPosting = await storage.updateJobPosting(id, jobData);
      
      if (!jobPosting) {
        return res.status(404).json({ error: "Job posting not found" });
      }

      res.json({
        ...jobPosting,
        id: jobPosting.id.toString(),
        created_at: jobPosting.created_at.toISOString(),
        updated_at: jobPosting.updated_at.toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid job data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update job posting" });
    }
  });

  app.delete("/api/job-postings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const success = await storage.deleteJobPosting(id);
      if (!success) {
        return res.status(404).json({ error: "Job posting not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job posting" });
    }
  });

  // Communication routes
  app.get("/api/communication/stats", async (req, res) => {
    try {
      const stats = communication.getCommunicationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get communication stats" });
    }
  });

  app.get("/api/communication/templates", async (req, res) => {
    try {
      const templates = communication.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get templates" });
    }
  });

  app.post("/api/communication/templates", async (req, res) => {
    try {
      const template = communication.createTemplate(req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.get("/api/communication/history", async (req, res) => {
    try {
      const history = communication.getMessageHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to get message history" });
    }
  });

  app.get("/api/communication/automation", async (req, res) => {
    try {
      const rules = communication.getAutomationRules();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ error: "Failed to get automation rules" });
    }
  });

  app.post("/api/communication/send", async (req, res) => {
    try {
      const { type, recipients, subject, content, templateId, variables } = req.body;
      
      if (!type || !recipients || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let processedContent = content;
      let processedSubject = subject;

      // Apply template variables if provided
      if (variables) {
        processedContent = communication.replaceTemplateVariables(content, variables);
        if (subject) {
          processedSubject = communication.replaceTemplateVariables(subject, variables);
        }
      }

      const result = await communication.sendBulkMessage(
        type,
        Array.isArray(recipients) ? recipients : [recipients],
        processedContent,
        processedSubject,
        templateId
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/communication/send-email", async (req, res) => {
    try {
      const { to, subject, content, variables } = req.body;
      
      if (!to || !subject || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let processedContent = content;
      let processedSubject = subject;

      if (variables) {
        processedContent = communication.replaceTemplateVariables(content, variables);
        processedSubject = communication.replaceTemplateVariables(subject, variables);
      }

      const success = await communication.sendEmail({
        to: Array.isArray(to) ? to : [to],
        subject: processedSubject,
        content: processedContent
      });

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/communication/send-sms", async (req, res) => {
    try {
      const { to, message, variables } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let processedMessage = message;

      if (variables) {
        processedMessage = communication.replaceTemplateVariables(message, variables);
      }

      const success = await communication.sendSMS({
        to: Array.isArray(to) ? to : [to],
        message: processedMessage
      });

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  app.post("/api/communication/send-whatsapp", async (req, res) => {
    try {
      const { to, message, variables } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let processedMessage = message;

      if (variables) {
        processedMessage = communication.replaceTemplateVariables(message, variables);
      }

      const success = await communication.sendWhatsApp({
        to: Array.isArray(to) ? to : [to],
        message: processedMessage
      });

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to send WhatsApp" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      const dateRange = req.query.range as string || '30d';
      const data = analytics.getAnalyticsOverview(dateRange);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get analytics overview" });
    }
  });

  app.get("/api/analytics/funnel", async (req, res) => {
    try {
      const dateRange = req.query.range as string || '30d';
      const data = analytics.getFunnelData(dateRange);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get funnel data" });
    }
  });

  app.get("/api/analytics/time-to-hire", async (req, res) => {
    try {
      const dateRange = req.query.range as string || '30d';
      const data = analytics.getTimeToHireData(dateRange);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get time-to-hire data" });
    }
  });

  app.get("/api/analytics/channels", async (req, res) => {
    try {
      const dateRange = req.query.range as string || '30d';
      const data = analytics.getChannelData(dateRange);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get channel data" });
    }
  });

  app.get("/api/analytics/ai-predictions", async (req, res) => {
    try {
      const data = await analytics.getAIPredictions();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI predictions" });
    }
  });

  app.post("/api/analytics/predict-candidate", async (req, res) => {
    try {
      const { candidateData } = req.body;
      const probability = await analytics.generateCandidateSuccessPrediction(candidateData);
      res.json({ successProbability: probability });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate candidate prediction" });
    }
  });

  app.get("/api/analytics/insights", async (req, res) => {
    try {
      const dateRange = req.query.range as string || '30d';
      const data = analytics.getRecruitmentInsights(dateRange);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get recruitment insights" });
    }
  });

  app.post("/api/analytics/generate-report", async (req, res) => {
    try {
      const { type, dateRange } = req.body;
      
      // In a real implementation, this would generate and email a comprehensive report
      const reportData = {
        overview: analytics.getAnalyticsOverview(dateRange),
        funnel: analytics.getFunnelData(dateRange),
        timeToHire: analytics.getTimeToHireData(dateRange),
        channels: analytics.getChannelData(dateRange),
        insights: analytics.getRecruitmentInsights(dateRange)
      };

      // Mock report generation
      setTimeout(() => {
        console.log(`Generated ${type} report for ${dateRange} period`);
      }, 1000);

      res.json({ 
        success: true, 
        message: 'Report generation started. You will receive it via email shortly.',
        reportId: `RPT-${Date.now()}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Status Update routes
  app.post("/api/candidates/:id/status-update", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      const { status, notes, old_status, updated_by } = req.body;
      
      if (!candidateId || !status || !old_status || !updated_by) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const statusUpdateData = insertStatusUpdateSchema.parse({
        candidate_id: candidateId,
        old_status,
        new_status: status,
        notes,
        updated_by
      });

      const statusUpdate = await storage.createStatusUpdate(statusUpdateData);
      
      // Also update the candidate's current status
      await storage.updateCandidate(candidateId, { status });

      res.json({ 
        success: true, 
        statusUpdate: {
          ...statusUpdate,
          id: statusUpdate.id.toString(),
          created_at: statusUpdate.created_at.toISOString()
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create status update" });
    }
  });

  app.get("/api/candidates/:id/status-history", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      if (!candidateId) {
        return res.status(400).json({ error: "Invalid candidate ID" });
      }

      const statusUpdates = await storage.getStatusUpdatesByCandidate(candidateId);
      
      const formattedUpdates = statusUpdates.map(update => ({
        ...update,
        id: update.id.toString(),
        created_at: update.created_at.toISOString()
      }));

      res.json(formattedUpdates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch status history" });
    }
  });

  // SLIK Check routes
  app.post("/api/candidates/:id/slik-check", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      const { check_type, status, score, risk_level, findings, details, checked_by, notes } = req.body;
      
      if (!candidateId || !checked_by) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const slikCheckData = insertSlikCheckSchema.parse({
        candidate_id: candidateId,
        check_type: check_type || 'manual',
        status: status || 'pending',
        score,
        risk_level,
        findings,
        details,
        checked_by,
        notes
      });

      const slikCheck = await storage.createSlikCheck(slikCheckData);

      res.json({ 
        success: true, 
        slikCheck: {
          ...slikCheck,
          id: slikCheck.id.toString(),
          created_at: slikCheck.created_at.toISOString(),
          updated_at: slikCheck.updated_at.toISOString()
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid SLIK check data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create SLIK check" });
    }
  });

  app.get("/api/candidates/:id/slik-checks", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      if (!candidateId) {
        return res.status(400).json({ error: "Invalid candidate ID" });
      }

      const slikChecks = await storage.getSlikChecksByCandidate(candidateId);
      
      const formattedChecks = slikChecks.map(check => ({
        ...check,
        id: check.id.toString(),
        created_at: check.created_at.toISOString(),
        updated_at: check.updated_at.toISOString()
      }));

      res.json(formattedChecks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SLIK checks" });
    }
  });

  app.put("/api/slik-checks/:id", async (req, res) => {
    try {
      const checkId = parseInt(req.params.id);
      const updates = req.body;
      
      if (!checkId) {
        return res.status(400).json({ error: "Invalid SLIK check ID" });
      }

      const updatedCheck = await storage.updateSlikCheck(checkId, updates);
      
      if (!updatedCheck) {
        return res.status(404).json({ error: "SLIK check not found" });
      }

      res.json({
        success: true,
        slikCheck: {
          ...updatedCheck,
          id: updatedCheck.id.toString(),
          created_at: updatedCheck.created_at.toISOString(),
          updated_at: updatedCheck.updated_at.toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update SLIK check" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
