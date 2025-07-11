import { users, jobPostings, type User, type InsertUser, type JobPosting, type InsertJobPosting } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobPostings: Map<number, JobPosting>;
  private currentUserId: number;
  private currentJobId: number;

  constructor() {
    this.users = new Map();
    this.jobPostings = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;
    
    // Add some sample data
    this.addSampleData();
  }

  private addSampleData() {
    // Add sample users
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin",
      created_at: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    const applicantUser: User = {
      id: this.currentUserId++,
      email: "applicant@example.com",
      full_name: "John Doe",
      role: "applicant",
      created_at: new Date()
    };
    this.users.set(applicantUser.id, applicantUser);

    // Add sample job postings
    const sampleJobs: JobPosting[] = [
      {
        id: this.currentJobId++,
        title: "Sales Officer Chaneling (SOC)",
        description: "Bertanggung jawab untuk melakukan penjualan produk pembiayaan melalui channel dealer motor. Membangun dan memelihara hubungan baik dengan dealer partner.",
        locations: ["ADIRA TEBET MOTOR", "ADIRA KELAPA GADING MOTOR", "ADIRA PONDOK GEDE"],
        status: "active",
        requirements: "Minimal S1, pengalaman sales 2 tahun, memiliki SIM C",
        salary_range: "Rp 5.000.000 - Rp 8.000.000",
        employment_type: "full-time",
        created_at: new Date("2024-01-15T10:00:00Z"),
        updated_at: new Date("2024-01-15T10:00:00Z")
      },
      {
        id: this.currentJobId++,
        title: "Credit Marketing Officer",
        description: "Melakukan pemasaran produk kredit kepada calon nasabah, melakukan analisis kredit, dan memastikan target penjualan tercapai.",
        locations: ["SMSF JAKARTA TIMUR", "SMSF JAKARTA UTARA"],
        status: "active",
        requirements: "S1 Ekonomi/Manajemen, pengalaman banking 1 tahun",
        salary_range: "Rp 6.000.000 - Rp 9.000.000",
        employment_type: "full-time",
        created_at: new Date("2024-01-14T09:00:00Z"),
        updated_at: new Date("2024-01-14T09:00:00Z")
      },
      {
        id: this.currentJobId++,
        title: "Telemarketing Specialist",
        description: "Melakukan panggilan telepon untuk menawarkan produk dan layanan perusahaan kepada calon pelanggan.",
        locations: ["Juanda Jakarta Pusat", "Tangerang City"],
        status: "draft",
        requirements: "Minimal SMA, pengalaman telemarketing 1 tahun",
        salary_range: "Rp 4.000.000 - Rp 6.000.000",
        employment_type: "full-time",
        created_at: new Date("2024-01-13T08:00:00Z"),
        updated_at: new Date("2024-01-13T08:00:00Z")
      }
    ];

    sampleJobs.forEach(job => {
      this.jobPostings.set(job.id, job);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      created_at: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getJobPostings(): Promise<JobPosting[]> {
    return Array.from(this.jobPostings.values());
  }

  async getJobPosting(id: number): Promise<JobPosting | undefined> {
    return this.jobPostings.get(id);
  }

  async createJobPosting(insertJobPosting: InsertJobPosting): Promise<JobPosting> {
    const id = this.currentJobId++;
    const jobPosting: JobPosting = {
      ...insertJobPosting,
      id,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.jobPostings.set(id, jobPosting);
    return jobPosting;
  }

  async updateJobPosting(id: number, updates: Partial<InsertJobPosting>): Promise<JobPosting | undefined> {
    const existing = this.jobPostings.get(id);
    if (!existing) return undefined;

    const updated: JobPosting = {
      ...existing,
      ...updates,
      updated_at: new Date()
    };
    this.jobPostings.set(id, updated);
    return updated;
  }

  async deleteJobPosting(id: number): Promise<boolean> {
    return this.jobPostings.delete(id);
  }
}

export const storage = new MemStorage();
