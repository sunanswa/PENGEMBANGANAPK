import { db } from "./db";
import { users, jobPostings } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Add sample users
  const sampleUsers = [
    {
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin" as const
    },
    {
      email: "applicant@example.com", 
      full_name: "John Doe",
      role: "applicant" as const
    }
  ];

  for (const user of sampleUsers) {
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, user.email));
    if (existing.length === 0) {
      await db.insert(users).values(user);
      console.log(`✓ Created user: ${user.email}`);
    }
  }

  // Add sample job postings
  const sampleJobs = [
    {
      title: "Sales Officer Chaneling (SOC)",
      description: "Bertanggung jawab untuk melakukan penjualan produk pembiayaan melalui channel dealer motor. Membangun dan memelihara hubungan baik dengan dealer partner.",
      locations: ["ADIRA TEBET MOTOR", "ADIRA KELAPA GADING MOTOR", "ADIRA PONDOK GEDE"],
      status: "active" as const,
      requirements: "Minimal S1, pengalaman sales 2 tahun, memiliki SIM C",
      salary_range: "Rp 5.000.000 - Rp 8.000.000",
      employment_type: "full-time"
    },
    {
      title: "Credit Marketing Officer",
      description: "Melakukan pemasaran produk kredit kepada calon nasabah, melakukan analisis kredit, dan memastikan target penjualan tercapai.",
      locations: ["SMSF JAKARTA TIMUR", "SMSF JAKARTA UTARA"],
      status: "active" as const,
      requirements: "S1 Ekonomi/Manajemen, pengalaman banking 1 tahun",
      salary_range: "Rp 6.000.000 - Rp 9.000.000",
      employment_type: "full-time"
    },
    {
      title: "Telemarketing Specialist",
      description: "Melakukan panggilan telepon untuk menawarkan produk dan layanan perusahaan kepada calon pelanggan.",
      locations: ["Juanda Jakarta Pusat", "Tangerang City"],
      status: "draft" as const,
      requirements: "Minimal SMA, pengalaman telemarketing 1 tahun",
      salary_range: "Rp 4.000.000 - Rp 6.000.000",
      employment_type: "full-time"
    }
  ];

  for (const job of sampleJobs) {
    // Check if job already exists
    const existing = await db.select().from(jobPostings).where(eq(jobPostings.title, job.title));
    if (existing.length === 0) {
      await db.insert(jobPostings).values(job);
      console.log(`✓ Created job: ${job.title}`);
    }
  }

  console.log("🌱 Database seeded successfully!");
}

seed().catch(console.error);