import { storage } from "./storage";

async function seedInterviewData() {
  console.log("🌱 Seeding interview and screening data...");

  try {
    // Create sample candidates
    const candidates = await Promise.all([
      storage.createCandidate({
        full_name: "Sarah Wijaya",
        email: "sarah.wijaya@email.com",
        phone: "+62812-3456-7890",
        skills: ["Sales", "Customer Service", "Communication"],
        experience_years: 3,
        education: "S1 Ekonomi - Universitas Indonesia",
        current_position: "Sales Executive",
        current_company: "PT. Mandiri Utama",
        expected_salary: "Rp 8,000,000",
        availability: "2 weeks notice",
        status: "new"
      }),
      storage.createCandidate({
        full_name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62813-4567-8901",
        skills: ["Marketing", "Digital Marketing", "Analytics"],
        experience_years: 5,
        education: "S1 Marketing - Universitas Gadjah Mada",
        current_position: "Marketing Manager",
        current_company: "PT. Kreatif Digital",
        expected_salary: "Rp 12,000,000",
        availability: "1 month notice",
        status: "screened"
      }),
      storage.createCandidate({
        full_name: "Maya Sari",
        email: "maya.sari@email.com",
        phone: "+62814-5678-9012",
        skills: ["Telemarketing", "Cold Calling", "Lead Generation"],
        experience_years: 2,
        education: "D3 Komunikasi - Politeknik Jakarta",
        current_position: "Telemarketing Specialist",
        current_company: "PT. Media Prima",
        expected_salary: "Rp 6,000,000",
        availability: "Immediately",
        status: "interview"
      }),
      storage.createCandidate({
        full_name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62815-6789-0123",
        skills: ["Recovery", "Negotiation", "Legal Knowledge"],
        experience_years: 4,
        education: "S1 Hukum - Universitas Brawijaya",
        current_position: "Collection Officer",
        current_company: "Bank ABC",
        expected_salary: "Rp 10,000,000",
        availability: "3 weeks notice",
        status: "offer"
      })
    ]);

    console.log(`✅ Created ${candidates.length} candidates`);

    // Get job postings to create applications
    const jobPostings = await storage.getJobPostings();
    
    // Create applications
    const applications = await Promise.all([
      storage.createApplication({
        candidate_id: candidates[0].id,
        job_posting_id: jobPostings[0].id,
        status: "applied",
        notes: "Strong sales background, good communication skills"
      }),
      storage.createApplication({
        candidate_id: candidates[1].id,
        job_posting_id: jobPostings[1].id,
        status: "screening",
        notes: "Excellent marketing experience, passed initial screening"
      }),
      storage.createApplication({
        candidate_id: candidates[2].id,
        job_posting_id: jobPostings[2].id,
        status: "interview",
        notes: "Good telemarketing skills, ready for interview"
      }),
      storage.createApplication({
        candidate_id: candidates[3].id,
        job_posting_id: jobPostings[3].id,
        status: "offer",
        notes: "Excellent recovery experience, recommended for hire"
      })
    ]);

    console.log(`✅ Created ${applications.length} applications`);

    // Create interviews
    const interviews = await Promise.all([
      storage.createInterview({
        application_id: applications[2].id,
        interviewer_name: "Pak Sutrisno",
        interviewer_email: "sutrisno@swapro.com",
        scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration_minutes: 60,
        interview_type: "video",
        meeting_link: "https://meet.google.com/abc-defg-hij",
        status: "scheduled"
      }),
      storage.createInterview({
        application_id: applications[1].id,
        interviewer_name: "Bu Sari",
        interviewer_email: "sari@swapro.com",
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        duration_minutes: 45,
        interview_type: "phone",
        status: "scheduled"
      }),
      storage.createInterview({
        application_id: applications[3].id,
        interviewer_name: "Pak Joko",
        interviewer_email: "joko@swapro.com",
        scheduled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration_minutes: 90,
        interview_type: "in_person",
        location: "SWAPRO Head Office - Meeting Room 2",
        status: "completed",
        score: 85,
        feedback: "Excellent candidate with strong recovery experience. Good communication and negotiation skills.",
        cultural_fit_score: 90,
        recommendation: "strong_hire"
      })
    ]);

    console.log(`✅ Created ${interviews.length} interviews`);

    // Create screening assessments
    const assessments = await Promise.all([
      storage.createScreeningAssessment({
        candidate_id: candidates[1].id,
        job_posting_id: jobPostings[1].id,
        assessment_type: "skills",
        questions: [
          "Apa strategi pemasaran digital yang paling efektif untuk produk keuangan?",
          "Bagaimana cara mengukur ROI dari campaign marketing?",
          "Jelaskan perbedaan antara lead generation dan lead nurturing"
        ],
        answers: [
          "Kombinasi content marketing, social media advertising, dan email marketing dengan fokus pada edukasi produk keuangan",
          "Menggunakan tracking tools seperti Google Analytics, mengukur conversion rate, cost per acquisition, dan lifetime value",
          "Lead generation fokus pada mendapatkan prospek baru, sedangkan lead nurturing adalah proses membangun hubungan dengan prospek hingga siap membeli"
        ],
        score: 85,
        max_score: 100,
        passed: true,
        time_taken_minutes: 45,
        ai_analysis: "Kandidat menunjukkan pemahaman yang baik tentang digital marketing dan strategi pemasaran. Jawaban terstruktur dan relevan dengan industri keuangan.",
        completed_at: new Date()
      }),
      storage.createScreeningAssessment({
        candidate_id: candidates[0].id,
        job_posting_id: jobPostings[0].id,
        assessment_type: "personality",
        questions: [
          "Bagaimana Anda menangani penolakan dari customer?",
          "Apa yang memotivasi Anda dalam pekerjaan sales?",
          "Bagaimana cara Anda membangun rapport dengan client?"
        ],
        answers: [
          "Saya melihat penolakan sebagai kesempatan untuk belajar dan memperbaiki pendekatan. Saya akan menanyakan feedback dan mencoba pendekatan yang berbeda",
          "Saya termotivasi ketika bisa membantu customer menemukan solusi yang tepat untuk kebutuhan mereka dan melihat dampak positifnya",
          "Saya mendengarkan secara aktif, menunjukkan empati, dan mencari kesamaan untuk membangun koneksi personal"
        ],
        score: 78,
        max_score: 100,
        passed: true,
        time_taken_minutes: 30,
        ai_analysis: "Kandidat menunjukkan mindset yang positif dan customer-centric. Pendekatan yang matang dalam menangani tantangan sales.",
        completed_at: new Date()
      })
    ]);

    console.log(`✅ Created ${assessments.length} screening assessments`);
    console.log("🎉 Interview and screening data seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding interview data:", error);
  }
}

seedInterviewData();