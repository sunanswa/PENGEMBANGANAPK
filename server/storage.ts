import { 
  users, jobPostings, candidates, applications, interviews, screening_assessments, status_updates, slik_checks,
  type User, type JobPosting, type Candidate, type Application, type Interview, type ScreeningAssessment, type StatusUpdate, type SlikCheck,
  type InsertUser, type InsertJobPosting, type InsertCandidate, type InsertApplication, 
  type InsertInterview, type InsertScreeningAssessment, type InsertStatusUpdate, type InsertSlikCheck
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getJobPostings(): Promise<JobPosting[]>;
  getJobPosting(id: number): Promise<JobPosting | undefined>;
  createJobPosting(jobPosting: InsertJobPosting): Promise<JobPosting>;
  updateJobPosting(id: number, jobPosting: Partial<InsertJobPosting>): Promise<JobPosting | undefined>;
  deleteJobPosting(id: number): Promise<boolean>;

  // Candidates
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  
  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;
  
  // Interviews
  getInterviews(): Promise<Interview[]>;
  getInterview(id: number): Promise<Interview | undefined>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: number): Promise<boolean>;
  
  // Screening Assessments
  getScreeningAssessments(): Promise<ScreeningAssessment[]>;
  getScreeningAssessment(id: number): Promise<ScreeningAssessment | undefined>;
  createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment>;
  updateScreeningAssessment(id: number, assessment: Partial<InsertScreeningAssessment>): Promise<ScreeningAssessment | undefined>;
  
  // Status Updates
  getStatusUpdates(): Promise<StatusUpdate[]>;
  getStatusUpdatesByCandidate(candidateId: number): Promise<StatusUpdate[]>;
  createStatusUpdate(statusUpdate: InsertStatusUpdate): Promise<StatusUpdate>;
  
  // SLIK Checks
  getSlikChecks(): Promise<SlikCheck[]>;
  getSlikChecksByCandidate(candidateId: number): Promise<SlikCheck[]>;
  createSlikCheck(slikCheck: InsertSlikCheck): Promise<SlikCheck>;
  updateSlikCheck(id: number, slikCheck: Partial<InsertSlikCheck>): Promise<SlikCheck | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getJobPostings(): Promise<JobPosting[]> {
    return await db.select().from(jobPostings).orderBy(jobPostings.created_at);
  }

  async getJobPosting(id: number): Promise<JobPosting | undefined> {
    const [jobPosting] = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return jobPosting || undefined;
  }

  async createJobPosting(insertJobPosting: InsertJobPosting): Promise<JobPosting> {
    const [jobPosting] = await db
      .insert(jobPostings)
      .values(insertJobPosting)
      .returning();
    return jobPosting;
  }

  async updateJobPosting(id: number, updates: Partial<InsertJobPosting>): Promise<JobPosting | undefined> {
    const [jobPosting] = await db
      .update(jobPostings)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(jobPostings.id, id))
      .returning();
    return jobPosting || undefined;
  }

  async deleteJobPosting(id: number): Promise<boolean> {
    const result = await db.delete(jobPostings).where(eq(jobPostings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Candidates methods
  async getCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates);
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate || undefined;
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values({ ...insertCandidate, updated_at: new Date() })
      .returning();
    return candidate;
  }

  async updateCandidate(id: number, updates: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const [candidate] = await db
      .update(candidates)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return candidate || undefined;
  }

  // Applications methods
  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  // Interviews methods
  async getInterviews(): Promise<Interview[]> {
    return await db.select().from(interviews);
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview || undefined;
  }

  async createInterview(insertInterview: InsertInterview): Promise<Interview> {
    const [interview] = await db
      .insert(interviews)
      .values({ ...insertInterview, updated_at: new Date() })
      .returning();
    return interview;
  }

  async updateInterview(id: number, updates: Partial<InsertInterview>): Promise<Interview | undefined> {
    const [interview] = await db
      .update(interviews)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return interview || undefined;
  }

  async deleteInterview(id: number): Promise<boolean> {
    try {
      await db.delete(interviews).where(eq(interviews.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting interview:", error);
      return false;
    }
  }

  // Screening Assessments methods
  async getScreeningAssessments(): Promise<ScreeningAssessment[]> {
    return await db.select().from(screening_assessments);
  }

  async getScreeningAssessment(id: number): Promise<ScreeningAssessment | undefined> {
    const [assessment] = await db.select().from(screening_assessments).where(eq(screening_assessments.id, id));
    return assessment || undefined;
  }

  async createScreeningAssessment(insertAssessment: InsertScreeningAssessment): Promise<ScreeningAssessment> {
    const [assessment] = await db
      .insert(screening_assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async updateScreeningAssessment(id: number, updates: Partial<InsertScreeningAssessment>): Promise<ScreeningAssessment | undefined> {
    const [assessment] = await db
      .update(screening_assessments)
      .set(updates)
      .where(eq(screening_assessments.id, id))
      .returning();
    return assessment || undefined;
  }

  // Status Updates methods
  async getStatusUpdates(): Promise<StatusUpdate[]> {
    return await db.select().from(status_updates).orderBy(status_updates.created_at);
  }

  async getStatusUpdatesByCandidate(candidateId: number): Promise<StatusUpdate[]> {
    return await db.select().from(status_updates)
      .where(eq(status_updates.candidate_id, candidateId))
      .orderBy(status_updates.created_at);
  }

  async createStatusUpdate(insertStatusUpdate: InsertStatusUpdate): Promise<StatusUpdate> {
    const [statusUpdate] = await db
      .insert(status_updates)
      .values(insertStatusUpdate)
      .returning();
    return statusUpdate;
  }

  // SLIK Checks methods
  async getSlikChecks(): Promise<SlikCheck[]> {
    return await db.select().from(slik_checks).orderBy(slik_checks.created_at);
  }

  async getSlikChecksByCandidate(candidateId: number): Promise<SlikCheck[]> {
    return await db.select().from(slik_checks)
      .where(eq(slik_checks.candidate_id, candidateId))
      .orderBy(slik_checks.created_at);
  }

  async createSlikCheck(insertSlikCheck: InsertSlikCheck): Promise<SlikCheck> {
    const [slikCheck] = await db
      .insert(slik_checks)
      .values({ ...insertSlikCheck, updated_at: new Date() })
      .returning();
    return slikCheck;
  }

  async updateSlikCheck(id: number, updates: Partial<InsertSlikCheck>): Promise<SlikCheck | undefined> {
    const [slikCheck] = await db
      .update(slik_checks)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(slik_checks.id, id))
      .returning();
    return slikCheck || undefined;
  }
}

export const storage = new DatabaseStorage();
