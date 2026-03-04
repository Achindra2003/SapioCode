"use client";

import { useState } from "react";
import { teacherAPI, type Classroom } from "@/lib/teacherApi";
import { X } from "lucide-react";

interface CreateClassroomModalProps {
  onClose: () => void;
  onCreated: (classroom: Classroom) => void;
}

export default function CreateClassroomModal({
  onClose,
  onCreated,
}: CreateClassroomModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setLoading(true);

    try {
      const classroom = await teacherAPI.createClassroom(name.trim());
      onCreated(classroom);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Create Classroom</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#666666] hover:bg-surface-2 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="className" className="text-sm text-[#a0a0a0]">
              Classroom Name
            </label>
            <input
              id="className"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CS101 — Intro to Programming"
              autoFocus
              required
              className="h-11 rounded-lg border border-border bg-surface-2 px-4 text-sm text-white placeholder:text-[#666666] focus:border-brand focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-border bg-surface-2 text-sm font-medium text-white hover:bg-[#222222] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 h-10 rounded-lg bg-brand text-sm font-semibold text-black hover:bg-brand-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
