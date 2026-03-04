"use client";

import { useState } from "react";
import { teacherAPI, type GeneratedProblem } from "@/lib/teacherApi";
import { Sparkles, Loader2, ArrowRight, X } from "lucide-react";

interface AIGeneratorPanelProps {
  onGenerated: (problem: GeneratedProblem) => void;
}

export default function AIGeneratorPanel({ onGenerated }: AIGeneratorPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<GeneratedProblem | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError("");
    setGenerating(true);
    setPreview(null);

    try {
      const result = await teacherAPI.generateProblem(prompt.trim());
      setPreview(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleUse = () => {
    if (preview) {
      onGenerated(preview);
      setPreview(null);
      setPrompt("");
    }
  };

  return (
    <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold text-brand">AI Problem Generator</h3>
      </div>

      <p className="text-xs text-[#a0a0a0] mb-3">
        Describe what kind of problem you want, and AI will generate the full
        problem with test cases and viva questions.
      </p>

      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Create a beginner-level problem about recursion that asks students to compute factorial"'
          rows={3}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-white placeholder:text-[#666666] focus:border-brand focus:outline-none transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black hover:bg-brand-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">
              Generated Preview
            </h4>
            <button
              onClick={() => setPreview(null)}
              className="rounded p-1 text-[#666666] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-[#a0a0a0]">
            <p>
              <span className="text-[#666666]">Title:</span>{" "}
              <span className="text-white">{preview.title}</span>
            </p>
            <p>
              <span className="text-[#666666]">Difficulty:</span>{" "}
              <span className="capitalize">{preview.difficulty}</span>
            </p>
            <p>
              <span className="text-[#666666]">Topic:</span> {preview.topic}
            </p>
            <p>
              <span className="text-[#666666]">Test Cases:</span>{" "}
              {preview.test_cases.length}
            </p>
            <p>
              <span className="text-[#666666]">Viva Questions:</span>{" "}
              {preview.viva_questions.length}
            </p>
            <div className="mt-2 p-2 rounded bg-[#0d0d0d] font-mono text-[10px] max-h-32 overflow-y-auto whitespace-pre-wrap">
              {preview.description.slice(0, 300)}
              {preview.description.length > 300 && "..."}
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleUse}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black hover:bg-brand-dim transition-colors"
            >
              Use This Problem
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
