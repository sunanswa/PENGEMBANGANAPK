import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertJobPostingSchema, type User } from "@shared/schema";
import { z } from "zod";
import * as communication from "./communication";

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

  const httpServer = createServer(app);

  return httpServer;
}
