"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  teacherAPI,
  type Classroom,
  type Student,
  type Problem,
} from "@/lib/teacherApi";
import {
  ArrowLeft,
  Plus,
  Users,
  FileCode2,
  Copy,
  Check,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"problems" | "students">(
    "problems"
  );
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await teacherAPI.getClassroom(classroomId);
      setClassroom(data.classroom);
      setStudents(data.students);
      setProblems(data.problems);
    } catch {
      router.replace("/teacher/classrooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId]);

  const copyCode = async () => {
    if (!classroom) return;
    await navigator.clipboard.writeText(classroom.join_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDelete = async (problemId: string) => {
    if (!confirm("Delete this problem? This cannot be undone.")) return;
    setDeletingId(problemId);
    try {
      await teacherAPI.deleteProblem(problemId);
      setProblems((prev) => prev.filter((p) => p._id !== problemId));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (problem: Problem) => {
    const newStatus = problem.status === "published" ? "draft" : "published";
    await teacherAPI.updateProblem(problem._id, { status: newStatus });
    setProblems((prev) =>
      prev.map((p) =>
        p._id === problem._id ? { ...p, status: newStatus } : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!classroom) return null;

  const difficultyColor = {
    beginner: "text-green-500 bg-green-500/10 border-green-500/20",
    intermediate: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div>
      {/* Back button & Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/teacher/classrooms")}
          className="flex items-center gap-1.5 text-sm text-[#a0a0a0] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classrooms
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{classroom.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs font-mono text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Join Code: {classroom.join_code}
                  </>
                )}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-[#a0a0a0]">
                <Users className="h-3.5 w-3.5" />
                {students.length} students
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#a0a0a0]">
                <FileCode2 className="h-3.5 w-3.5" />
                {problems.length} problems
              </span>
            </div>
          </div>

          <Link
            href={`/teacher/classrooms/${classroomId}/problems/new`}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-black hover:bg-brand-dim transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Problem
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("problems")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "problems"
              ? "border-brand text-brand"
              : "border-transparent text-[#a0a0a0] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4" />
            Problems ({problems.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "students"
              ? "border-brand text-brand"
              : "border-transparent text-[#a0a0a0] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students ({students.length})
          </span>
        </button>
      </div>

      {/* Problems Tab */}
      {activeTab === "problems" && (
        <div className="space-y-3">
          {problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-xl bg-surface">
              <FileCode2 className="h-10 w-10 text-[#666666] mb-3" />
              <h3 className="text-base font-semibold mb-1">No problems yet</h3>
              <p className="text-sm text-[#a0a0a0] mb-4 max-w-xs">
                Add coding problems for students to solve. Use AI to generate them instantly.
              </p>
              <Link
                href={`/teacher/classrooms/${classroomId}/problems/new`}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black hover:bg-brand-dim transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Problem
              </Link>
            </div>
          ) : (
            problems.map((problem) => (
              <div
                key={problem._id}
                className="rounded-xl border border-border bg-surface overflow-hidden"
              >
                {/* Problem header */}
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() =>
                      setExpandedProblem(
                        expandedProblem === problem._id ? null : problem._id
                      )
                    }
                    className="text-[#666666] hover:text-white transition-colors"
                  >
                    {expandedProblem === problem._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold truncate">
                        {problem.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                          difficultyColor[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          problem.status === "published"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-[#a0a0a0]/10 text-[#a0a0a0] border border-[#a0a0a0]/20"
                        }`}
                      >
                        {problem.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">
                      {problem.topic} · {problem.test_cases.length} test cases ·{" "}
                      {problem.viva_questions.length} viva questions
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(problem)}
                      className="rounded-lg p-2 text-[#666666] hover:bg-surface-2 hover:text-white transition-colors"
                      title={
                        problem.status === "published"
                          ? "Move to Draft"
                          : "Publish"
                      }
                    >
                      {problem.status === "published" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/teacher/classrooms/${classroomId}/problems/${problem._id}/edit`}
                      className="rounded-lg p-2 text-[#666666] hover:bg-surface-2 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      disabled={deletingId === problem._id}
                      className="rounded-lg p-2 text-[#666666] hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedProblem === problem._id && (
                  <div className="border-t border-border bg-[#0d0d0d] p-5">
                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2">
                        Description
                      </h4>
                      <div className="text-sm text-[#a0a0a0] whitespace-pre-wrap font-mono leading-relaxed">
                        {problem.description}
                      </div>
                    </div>

                    {/* Target Concepts */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2">
                        Target Concepts
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.target_concepts.map((concept, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs text-brand"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Test Cases */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2">
                        Test Cases
                      </h4>
                      <div className="space-y-2">
                        {problem.test_cases.map((tc, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-border bg-surface p-3 font-mono text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[#666666]">
                                Test Case {i + 1}
                              </span>
                              {tc.is_hidden && (
                                <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[#666666] text-[10px] uppercase">
                                  Input
                                </span>
                                <pre className="text-white mt-0.5">
                                  {tc.input}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[#666666] text-[10px] uppercase">
                                  Expected Output
                                </span>
                                <pre className="text-white mt-0.5">
                                  {tc.expected_output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Viva Questions */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2">
                        Viva Questions
                      </h4>
                      <div className="space-y-2">
                        {problem.viva_questions.map((vq, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-border bg-surface p-3"
                          >
                            <p className="text-sm text-white mb-1.5">
                              {vq.question}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {vq.expected_answer_keywords.map((kw, j) => (
                                <span
                                  key={j}
                                  className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-[#a0a0a0] border border-border"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-xl bg-surface">
              <Users className="h-10 w-10 text-[#666666] mb-3" />
              <h3 className="text-base font-semibold mb-1">
                No students enrolled
              </h3>
              <p className="text-sm text-[#a0a0a0] max-w-xs">
                Share the join code{" "}
                <span className="font-mono text-brand">
                  {classroom.join_code}
                </span>{" "}
                with your students.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider px-4 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider px-4 py-3">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-border last:border-b-0 hover:bg-surface-2/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#a0a0a0]">
                        {student.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
