"use client";

import { useState } from "react";
import type { TestCase, VivaQuestion } from "@/lib/teacherApi";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

export interface ProblemFormData {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  target_concepts: string[];
  test_cases: TestCase[];
  viva_questions: VivaQuestion[];
  status: "draft" | "published";
}

interface ProblemFormProps {
  initialData?: ProblemFormData;
  onSubmit: (data: ProblemFormData) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
}

const EMPTY_FORM: ProblemFormData = {
  title: "",
  description: "",
  difficulty: "beginner",
  topic: "",
  target_concepts: [],
  test_cases: [{ input: "", expected_output: "", is_hidden: false }],
  viva_questions: [{ question: "", expected_answer_keywords: [] }],
  status: "draft",
};

export default function ProblemForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
}: ProblemFormProps) {
  const [form, setForm] = useState<ProblemFormData>(initialData || EMPTY_FORM);
  const [conceptInput, setConceptInput] = useState("");
  const [keywordInputs, setKeywordInputs] = useState<string[]>(
    initialData?.viva_questions.map(() => "") || [""]
  );

  const updateField = <K extends keyof ProblemFormData>(
    key: K,
    value: ProblemFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ---- Concepts ----
  const addConcept = () => {
    const trimmed = conceptInput.trim();
    if (trimmed && !form.target_concepts.includes(trimmed)) {
      updateField("target_concepts", [...form.target_concepts, trimmed]);
      setConceptInput("");
    }
  };

  const removeConcept = (concept: string) => {
    updateField(
      "target_concepts",
      form.target_concepts.filter((c) => c !== concept)
    );
  };

  // ---- Test Cases ----
  const addTestCase = () => {
    updateField("test_cases", [
      ...form.test_cases,
      { input: "", expected_output: "", is_hidden: false },
    ]);
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updated = form.test_cases.map((tc, i) =>
      i === index ? { ...tc, [field]: value } : tc
    );
    updateField("test_cases", updated);
  };

  const removeTestCase = (index: number) => {
    updateField(
      "test_cases",
      form.test_cases.filter((_, i) => i !== index)
    );
  };

  // ---- Viva Questions ----
  const addVivaQuestion = () => {
    updateField("viva_questions", [
      ...form.viva_questions,
      { question: "", expected_answer_keywords: [] },
    ]);
    setKeywordInputs((prev) => [...prev, ""]);
  };

  const updateVivaQuestion = (index: number, question: string) => {
    const updated = form.viva_questions.map((vq, i) =>
      i === index ? { ...vq, question } : vq
    );
    updateField("viva_questions", updated);
  };

  const addKeyword = (vivaIndex: number) => {
    const kw = keywordInputs[vivaIndex]?.trim();
    if (!kw) return;
    const updated = form.viva_questions.map((vq, i) => {
      if (i !== vivaIndex) return vq;
      if (vq.expected_answer_keywords.includes(kw)) return vq;
      return {
        ...vq,
        expected_answer_keywords: [...vq.expected_answer_keywords, kw],
      };
    });
    updateField("viva_questions", updated);
    setKeywordInputs((prev) => prev.map((v, i) => (i === vivaIndex ? "" : v)));
  };

  const removeKeyword = (vivaIndex: number, keyword: string) => {
    const updated = form.viva_questions.map((vq, i) => {
      if (i !== vivaIndex) return vq;
      return {
        ...vq,
        expected_answer_keywords: vq.expected_answer_keywords.filter(
          (k) => k !== keyword
        ),
      };
    });
    updateField("viva_questions", updated);
  };

  const removeVivaQuestion = (index: number) => {
    updateField(
      "viva_questions",
      form.viva_questions.filter((_, i) => i !== index)
    );
    setKeywordInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  // Allow parent to inject AI-generated data
  // Exposed via key prop re-render with new initialData

  const inputClass =
    "w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-white placeholder:text-[#666666] focus:border-brand focus:outline-none transition-colors";
  const labelClass = "text-sm font-medium text-[#a0a0a0] mb-1.5";
  const sectionClass =
    "rounded-xl border border-border bg-surface p-5 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          Basic Information
        </h3>

        <div className="flex flex-col">
          <label className={labelClass}>Title</label>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Two Sum"
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Problem statement with examples..."
            required
            rows={8}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col">
            <label className={labelClass}>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                updateField(
                  "difficulty",
                  e.target.value as ProblemFormData["difficulty"]
                )
              }
              className={`${inputClass} cursor-pointer`}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Topic</label>
            <input
              value={form.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              placeholder="e.g. Arrays"
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as "draft" | "published")
              }
              className={`${inputClass} cursor-pointer`}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Target Concepts */}
        <div className="flex flex-col">
          <label className={labelClass}>Target Concepts</label>
          <div className="flex gap-2">
            <input
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addConcept();
                }
              }}
              placeholder="Type a concept and press Enter"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addConcept}
              className="rounded-lg bg-surface-2 border border-border px-3 text-sm text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
            >
              Add
            </button>
          </div>
          {form.target_concepts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.target_concepts.map((concept) => (
                <span
                  key={concept}
                  className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs text-brand"
                >
                  {concept}
                  <button
                    type="button"
                    onClick={() => removeConcept(concept)}
                    className="hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Test Cases */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Test Cases</h3>
          <button
            type="button"
            onClick={addTestCase}
            className="flex items-center gap-1.5 rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs font-medium text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Test Case
          </button>
        </div>

        {form.test_cases.map((tc, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-[#0d0d0d] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#a0a0a0]">
                Test Case {i + 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateTestCase(i, "is_hidden", !tc.is_hidden)
                  }
                  className={`flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                    tc.is_hidden
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-surface-2 text-[#a0a0a0] border border-border"
                  }`}
                >
                  {tc.is_hidden ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  {tc.is_hidden ? "Hidden" : "Visible"}
                </button>
                {form.test_cases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTestCase(i)}
                    className="rounded p-1 text-[#666666] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase text-[#666666] mb-1">
                  Input
                </label>
                <textarea
                  value={tc.input}
                  onChange={(e) =>
                    updateTestCase(i, "input", e.target.value)
                  }
                  rows={2}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder="Input value"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase text-[#666666] mb-1">
                  Expected Output
                </label>
                <textarea
                  value={tc.expected_output}
                  onChange={(e) =>
                    updateTestCase(i, "expected_output", e.target.value)
                  }
                  rows={2}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder="Expected output"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Viva Questions */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Viva Questions</h3>
          <button
            type="button"
            onClick={addVivaQuestion}
            className="flex items-center gap-1.5 rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs font-medium text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Question
          </button>
        </div>

        {form.viva_questions.map((vq, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-[#0d0d0d] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#a0a0a0]">
                Question {i + 1}
              </span>
              {form.viva_questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVivaQuestion(i)}
                  className="rounded p-1 text-[#666666] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <input
              value={vq.question}
              onChange={(e) => updateVivaQuestion(i, e.target.value)}
              placeholder="What question will the AI ask during viva?"
              className={inputClass}
            />

            {/* Keywords */}
            <div>
              <label className="text-[10px] uppercase text-[#666666] mb-1 block">
                Expected Answer Keywords
              </label>
              <div className="flex gap-2">
                <input
                  value={keywordInputs[i] || ""}
                  onChange={(e) =>
                    setKeywordInputs((prev) =>
                      prev.map((v, idx) => (idx === i ? e.target.value : v))
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword(i);
                    }
                  }}
                  placeholder="Type keyword and press Enter"
                  className={`${inputClass} flex-1 text-xs`}
                />
                <button
                  type="button"
                  onClick={() => addKeyword(i)}
                  className="rounded-lg bg-surface-2 border border-border px-3 text-xs text-[#a0a0a0] hover:border-brand/30 hover:text-brand transition-colors"
                >
                  Add
                </button>
              </div>
              {vq.expected_answer_keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {vq.expected_answer_keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 rounded bg-surface-2 border border-border px-1.5 py-0.5 text-[10px] text-[#a0a0a0]"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(i, kw)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-black hover:bg-brand-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
