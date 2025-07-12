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

// New tables for Interview Management and Screening
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

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertScreeningAssessment = z.infer<typeof insertScreeningAssessmentSchema>;
export type ScreeningAssessment = typeof screening_assessments.$inferSelect;
