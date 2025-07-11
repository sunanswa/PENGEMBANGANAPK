import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertJobPostingSchema, type User } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
