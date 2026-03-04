"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { teacherAPI, type Classroom } from "@/lib/teacherApi";
import CreateClassroomModal from "@/components/teacher/CreateClassroomModal";
import {
  Plus,
  Users,
  FileCode2,
  Copy,
  Check,
  GraduationCap,
} from "lucide-react";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchClassrooms = async () => {
    try {
      const data = await teacherAPI.getClassrooms();
      setClassrooms(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreated = (classroom: Classroom) => {
    setClassrooms((prev) => [...prev, classroom]);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Classrooms</h1>
          <p className="text-[#a0a0a0] text-sm mt-1">
            Manage your classes and coding problems
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-black hover:bg-brand-dim transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Classroom
        </button>
      </div>

      {/* Classrooms Grid */}
      {classrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border mb-4">
            <GraduationCap className="h-8 w-8 text-[#666666]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No classrooms yet</h3>
          <p className="text-[#a0a0a0] text-sm mb-6 max-w-sm">
            Create your first classroom to start adding coding problems for
            your students.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-black hover:bg-brand-dim transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Classroom
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classrooms.map((classroom) => (
            <Link
              key={classroom._id}
              href={`/teacher/classrooms/${classroom._id}`}
              className="group rounded-xl border border-border bg-surface p-6 hover:border-brand/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-semibold group-hover:text-brand transition-colors line-clamp-2">
                  {classroom.name}
                </h3>
              </div>

              {/* Join Code */}
              <div className="mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyCode(classroom.join_code);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs font-mono text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
                >
                  {copiedCode === classroom.join_code ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {classroom.join_code}
                    </>
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-[#a0a0a0]">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {classroom.student_count} student
                    {classroom.student_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>
                    {classroom.problem_count} problem
                    {classroom.problem_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Date */}
              <p className="mt-3 text-xs text-[#666666]">
                Created{" "}
                {new Date(classroom.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <CreateClassroomModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
