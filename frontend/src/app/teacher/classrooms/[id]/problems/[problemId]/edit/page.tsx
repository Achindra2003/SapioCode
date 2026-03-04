"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { teacherAPI, type Problem } from "@/lib/teacherApi";
import ProblemForm, {
  type ProblemFormData,
} from "@/components/teacher/ProblemForm";
import { ArrowLeft } from "lucide-react";

export default function EditProblemPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;
  const problemId = params.problemId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // Fetch classroom to get the problem data
        const data = await teacherAPI.getClassroom(classroomId);
        const found = data.problems.find((p) => p._id === problemId);
        if (found) {
          setProblem(found);
        } else {
          router.replace(`/teacher/classrooms/${classroomId}`);
        }
      } catch {
        router.replace(`/teacher/classrooms/${classroomId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, problemId]);

  const handleSubmit = async (data: ProblemFormData) => {
    setSubmitting(true);
    try {
      await teacherAPI.updateProblem(problemId, data);
      router.push(`/teacher/classrooms/${classroomId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!problem) return null;

  const initialData: ProblemFormData = {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    topic: problem.topic,
    target_concepts: problem.target_concepts,
    test_cases: problem.test_cases,
    viva_questions: problem.viva_questions,
    status: problem.status,
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
        <h1 className="text-2xl font-bold">Edit Problem</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">{problem.title}</p>
      </div>

      {/* Problem Form */}
      <ProblemForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitting={submitting}
      />
    </div>
  );
}
