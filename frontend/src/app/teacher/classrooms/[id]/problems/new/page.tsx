"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { teacherAPI, type GeneratedProblem } from "@/lib/teacherApi";
import ProblemForm, {
  type ProblemFormData,
} from "@/components/teacher/ProblemForm";
import AIGeneratorPanel from "@/components/teacher/AIGeneratorPanel";
import { ArrowLeft } from "lucide-react";

export default function NewProblemPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [prefill, setPrefill] = useState<ProblemFormData | undefined>(undefined);

  const handleAIGenerated = useCallback((generated: GeneratedProblem) => {
    const data: ProblemFormData = {
      title: generated.title,
      description: generated.description,
      difficulty: generated.difficulty,
      topic: generated.topic,
      target_concepts: generated.target_concepts,
      test_cases: generated.test_cases,
      viva_questions: generated.viva_questions,
      status: "draft",
    };
    setPrefill(data);
    setFormKey((k) => k + 1);
  }, []);

  const handleSubmit = async (data: ProblemFormData) => {
    setSubmitting(true);
    try {
      await teacherAPI.createProblem(classroomId, data);
      router.push(`/teacher/classrooms/${classroomId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/teacher/classrooms/${classroomId}`)}
          className="flex items-center gap-1.5 text-sm text-[#a0a0a0] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classroom
        </button>
        <h1 className="text-2xl font-bold">Create Problem</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          Add a new coding problem or generate one with AI
        </p>
      </div>

      {/* AI Generator */}
      <div className="mb-8">
        <AIGeneratorPanel onGenerated={handleAIGenerated} />
      </div>

      {/* Problem Form */}
      <ProblemForm
        key={formKey}
        initialData={prefill}
        onSubmit={handleSubmit}
        submitLabel="Create Problem"
        isSubmitting={submitting}
      />
    </div>
  );
}
