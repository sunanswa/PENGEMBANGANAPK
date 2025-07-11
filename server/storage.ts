import { users, jobPostings, type User, type InsertUser, type JobPosting, type InsertJobPosting } from "@shared/schema";
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
}

export const storage = new DatabaseStorage();
