import React, { useState } from 'react';
import { Brain, Clock, CheckCircle, X, Play, FileText, Zap } from 'lucide-react';

interface ScreeningAssessmentProps {
  candidateName: string;
  jobTitle: string;
  onComplete: (assessmentData: any) => void;
  onCancel: () => void;
}

const ScreeningAssessment: React.FC<ScreeningAssessmentProps> = ({
  candidateName,
  jobTitle,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentType, setAssessmentType] = useState<'skills' | 'personality' | 'cognitive' | 'technical'>('skills');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const assessmentTypes = [
    {
      type: 'skills' as const,
      title: 'Skills Assessment',
      description: 'Evaluasi kemampuan teknis dan soft skills',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      duration: 30
    },
    {
      type: 'personality' as const,
      title: 'Personality Test',
      description: 'Penilaian kepribadian dan cultural fit',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      duration: 20
    },
    {
      type: 'cognitive' as const,
      title: 'Cognitive Test',
      description: 'Tes kemampuan kognitif dan logika',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      duration: 25
    },
    {
      type: 'technical' as const,
      title: 'Technical Assessment',
      description: 'Evaluasi kemampuan teknis spesifik',
      icon: FileText,
      color: 'from-orange-500 to-amber-500',
      duration: 45
    }
  ];

  const skillsQuestions = [
    "Jelaskan pengalaman Anda dalam bidang yang sesuai dengan posisi ini",
    "Bagaimana cara Anda menangani tekanan dalam pekerjaan?",
    "Apa strategi Anda untuk mencapai target yang ditetapkan?",
    "Bagaimana Anda membangun hubungan yang baik dengan klien/customer?"
  ];

  const personalityQuestions = [
    "Bagaimana Anda menangani konflik di tempat kerja?",
    "Apa yang memotivasi Anda dalam bekerja?",
    "Bagaimana cara Anda beradaptasi dengan perubahan?",
    "Jelaskan gaya kepemimpinan yang Anda sukai"
  ];

  const cognitiveQuestions = [
    "Jika A=1, B=2, C=3, maka kata 'CAB' sama dengan angka berapa?",
    "Lengkapi pola: 2, 4, 8, 16, ?",
    "Dalam satu tim 5 orang, jika setiap orang berjabat tangan dengan yang lain sekali, berapa total jabat tangan?",
    "Urutkan prioritas: Menyelesaikan tugas mendesak, Meeting dengan klien, Training karyawan baru"
  ];

  const technicalQuestions = [
    "Jelaskan proses kerja yang Anda gunakan dalam menyelesaikan tugas kompleks",
    "Bagaimana Anda memastikan kualitas hasil kerja?",
    "Apa tools atau software yang paling Anda kuasai?",
    "Bagaimana cara Anda mengatasi masalah teknis yang belum pernah Anda hadapi?"
  ];

  const getQuestions = () => {
    switch (assessmentType) {
      case 'skills': return skillsQuestions;
      case 'personality': return personalityQuestions;
      case 'cognitive': return cognitiveQuestions;
      case 'technical': return technicalQuestions;
      default: return skillsQuestions;
    }
  };

  const handleStartAssessment = () => {
    setStartTime(new Date());
    setCurrentStep(1);
  };

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      setAnswers([...answers, currentAnswer]);
      setCurrentAnswer('');
      
      if (answers.length + 1 < getQuestions().length) {
        // Move to next question
      } else {
        // Complete assessment
        handleCompleteAssessment();
      }
    }
  };

  const handleCompleteAssessment = () => {
    const endTime = new Date();
    const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 0;
    
    // Simulate scoring based on answers
    const score = Math.floor(Math.random() * 30) + 70; // 70-100 range
    const maxScore = 100;
    const passed = score >= 75;

    const assessmentData = {
      assessment_type: assessmentType,
      questions: getQuestions(),
      answers: [...answers, currentAnswer],
      score,
      max_score: maxScore,
      passed,
      time_taken_minutes: timeTaken,
      auto_generated: true,
      ai_analysis: generateAIAnalysis(score, assessmentType),
      completed_at: new Date()
    };

    onComplete(assessmentData);
  };

  const generateAIAnalysis = (score: number, type: string) => {
    const analyses = {
      skills: score >= 85 ? "Kandidat menunjukkan kemampuan yang sangat baik dengan jawaban yang terstruktur dan relevan." :
              score >= 75 ? "Kandidat memiliki kemampuan yang memadai dengan beberapa area untuk pengembangan." :
              "Kandidat perlu pengembangan lebih lanjut dalam beberapa area kunci.",
      personality: score >= 85 ? "Kepribadian kandidat sangat sesuai dengan budaya perusahaan dan menunjukkan potensi tinggi." :
                   score >= 75 ? "Kandidat menunjukkan kepribadian yang sesuai dengan beberapa penyesuaian." :
                   "Perlu evaluasi lebih lanjut terkait kesesuaian dengan budaya perusahaan.",
      cognitive: score >= 85 ? "Kemampuan kognitif sangat baik dengan pemikiran analitis yang kuat." :
                 score >= 75 ? "Kemampuan kognitif memadai untuk posisi yang dilamar." :
                 "Kemampuan kognitif perlu pengembangan untuk optimalisasi performa.",
      technical: score >= 85 ? "Kemampuan teknis sangat memenuhi syarat dengan pemahaman yang mendalam." :
                 score >= 75 ? "Kemampuan teknis memadai dengan beberapa area untuk pengembangan." :
                 "Perlu training tambahan untuk meningkatkan kemampuan teknis."
    };
    
    return analyses[type] || analyses.skills;
  };

  const selectedType = assessmentTypes.find(t => t.type === assessmentType);
  const questions = getQuestions();
  const currentQuestionIndex = answers.length;
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  if (currentStep === 0) {
    // Assessment type selection
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Automated Screening</h3>
                <p className="text-gray-600 mt-1">{candidateName} - {jobTitle}</p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Pilih Jenis Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {assessmentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => setAssessmentType(type.type)}
                    className={`p-6 border-2 rounded-2xl transition-all duration-200 text-left ${
                      assessmentType === type.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">{type.title}</h5>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      {type.duration} menit
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleStartAssessment}
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedType?.color} text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
              >
                <Play size={20} />
                Mulai {selectedType?.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assessment in progress
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedType?.title}</h3>
              <p className="text-gray-600">{candidateName} - {jobTitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</p>
              <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={`h-2 bg-gradient-to-r ${selectedType?.color} rounded-full transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {questions[currentQuestionIndex]}
            </h4>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tulis jawaban Anda di sini..."
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Batalkan
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={!currentAnswer.trim()}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedType?.color} text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentQuestionIndex + 1 === questions.length ? 'Selesai' : 'Pertanyaan Selanjutnya'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningAssessment;