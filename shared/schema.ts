import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  role: text("role", { enum: ["admin", "applicant"] }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Enhanced applicant profiles with mandatory fields
export const applicantProfiles = pgTable("applicant_profiles", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull().unique(),
  
  // Personal Information (Mandatory)
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postal_code: text("postal_code").notNull(),
  birth_date: timestamp("birth_date").notNull(),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  nationality: text("nationality").notNull(),
  id_number: text("id_number").notNull().unique(), // KTP/Passport
  
  // Professional Information (Mandatory)
  current_position: text("current_position"),
  current_company: text("current_company"),
  experience_years: integer("experience_years").notNull(),
  education_level: text("education_level", { 
    enum: ["high_school", "diploma", "bachelor", "master", "doctorate"] 
  }).notNull(),
  major: text("major").notNull(),
  university: text("university").notNull(),
  graduation_year: integer("graduation_year").notNull(),
  
  // Skills and Preferences
  skills: text("skills").array().notNull().default([]),
  languages: text("languages").array().notNull().default([]),
  expected_salary: text("expected_salary"),
  work_type_preference: text("work_type_preference", {
    enum: ["full_time", "part_time", "contract", "internship"]
  }).notNull(),
  willing_to_relocate: boolean("willing_to_relocate").notNull().default(false),
  
  // Documents (Mandatory)
  cv_url: text("cv_url").notNull(),
  photo_url: text("photo_url").notNull(),
  
  // Additional Info
  bio: text("bio"),
  portfolio_url: text("portfolio_url"),
  linkedin_url: text("linkedin_url"),
  
  // Application Status
  has_applied: boolean("has_applied").notNull().default(false),
  applied_job_id: integer("applied_job_id").references(() => jobPostings.id),
  application_date: timestamp("application_date"),
  
  // Profile Completion
  profile_completed: boolean("profile_completed").notNull().default(false),
  completion_percentage: integer("completion_percentage").notNull().default(0),
  
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  locations: text("locations").array().notNull().default([]),
  maps_links: text("maps_links").array().default([]),
  positions_needed: integer("positions_needed").default(1),
  status: text("status", { enum: ["active", "closed", "draft", "urgent"] }).notNull().default("draft"),
  requirements: text("requirements"),
  salary_range: text("salary_range"),
  employment_type: text("employment_type"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  full_name: true,
  role: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertApplicantProfileSchema = createInsertSchema(applicantProfiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
  completion_percentage: true,
  profile_completed: true,
});

// Simple applications table for one-job restriction
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull().unique(), // One application per user
  job_posting_id: integer("job_posting_id").references(() => jobPostings.id).notNull(),
  status: text("status", { 
    enum: ["pending", "reviewing", "interview", "accepted", "rejected", "withdrawn"] 
  }).notNull().default("pending"),
  cover_letter: text("cover_letter"),
  notes: text("notes"),
  applied_at: timestamp("applied_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Keep existing tables but simplified
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  full_name: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  resume_url: text("resume_url"),
  cover_letter: text("cover_letter"),
  skills: text("skills").array(),
  experience_years: integer("experience_years"),
  education: text("education"),
  current_position: text("current_position"),
  current_company: text("current_company"),
  expected_salary: text("expected_salary"),
  availability: text("availability"),
  status: text("status").$type<"new" | "screened" | "interview" | "offer" | "hired" | "rejected">().notNull().default("new"),
  screening_score: integer("screening_score"),
  screening_notes: text("screening_notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  candidate_id: integer("candidate_id").references(() => candidates.id).notNull(),
  job_posting_id: integer("job_posting_id").references(() => jobPostings.id).notNull(),
  status: text("status").$type<"applied" | "screening" | "interview" | "offer" | "hired" | "rejected">().notNull().default("applied"),
  applied_at: timestamp("applied_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  application_id: integer("application_id").references(() => applications.id).notNull(),
  interviewer_name: text("interviewer_name").notNull(),
  interviewer_email: text("interviewer_email").notNull(),
  scheduled_at: timestamp("scheduled_at").notNull(),
  duration_minutes: integer("duration_minutes").default(60),
  interview_type: text("interview_type").$type<"phone" | "video" | "in_person" | "technical">().notNull(),
  meeting_link: text("meeting_link"),
  location: text("location"),
  status: text("status").$type<"scheduled" | "completed" | "cancelled" | "no_show">().notNull().default("scheduled"),
  score: integer("score"),
  feedback: text("feedback"),
  technical_assessment: text("technical_assessment"),
  cultural_fit_score: integer("cultural_fit_score"),
  recommendation: text("recommendation").$type<"strong_hire" | "hire" | "maybe" | "no_hire">(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const screening_assessments = pgTable("screening_assessments", {
  id: serial("id").primaryKey(),
  candidate_id: integer("candidate_id").references(() => candidates.id).notNull(),
  job_posting_id: integer("job_posting_id").references(() => jobPostings.id).notNull(),
  assessment_type: text("assessment_type").$type<"skills" | "personality" | "cognitive" | "technical">().notNull(),
  questions: text("questions").array(),
  answers: text("answers").array(),
  score: integer("score"),
  max_score: integer("max_score"),
  passed: boolean("passed").default(false),
  time_taken_minutes: integer("time_taken_minutes"),
  auto_generated: boolean("auto_generated").default(true),
  ai_analysis: text("ai_analysis"),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const status_updates = pgTable("status_updates", {
  id: serial("id").primaryKey(),
  candidate_id: integer("candidate_id").references(() => candidates.id).notNull(),
  old_status: text("old_status").notNull(),
  new_status: text("new_status").notNull(),
  notes: text("notes"),
  updated_by: text("updated_by").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const slik_checks = pgTable("slik_checks", {
  id: serial("id").primaryKey(),
  candidate_id: integer("candidate_id").references(() => candidates.id).notNull(),
  check_type: text("check_type").$type<"manual" | "automatic">().notNull().default("manual"),
  status: text("status").$type<"pending" | "approved" | "rejected" | "requires_review">().notNull().default("pending"),
  score: integer("score"),
  risk_level: text("risk_level").$type<"low" | "medium" | "high" | "very_high">(),
  findings: text("findings").array(),
  details: text("details"),
  checked_by: text("checked_by").notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applied_at: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertScreeningAssessmentSchema = createInsertSchema(screening_assessments).omit({
  id: true,
  created_at: true,
});

export const insertStatusUpdateSchema = createInsertSchema(status_updates).omit({
  id: true,
  created_at: true,
});

export const insertSlikCheckSchema = createInsertSchema(slik_checks).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Add job application schema
export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  applied_at: true,
  updated_at: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;

// New types for applicant profiles and applications
export type InsertApplicantProfile = z.infer<typeof insertApplicantProfileSchema>;
export type ApplicantProfile = typeof applicantProfiles.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertScreeningAssessment = z.infer<typeof insertScreeningAssessmentSchema>;
export type ScreeningAssessment = typeof screening_assessments.$inferSelect;
export type InsertStatusUpdate = z.infer<typeof insertStatusUpdateSchema>;
export type StatusUpdate = typeof status_updates.$inferSelect;
export type InsertSlikCheck = z.infer<typeof insertSlikCheckSchema>;
export type SlikCheck = typeof slik_checks.$inferSelect;
