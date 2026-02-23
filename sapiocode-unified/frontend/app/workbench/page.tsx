"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Play, Send, Bot, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useProgress } from "@/hooks/useProgress";
import { getQuestionById, QUESTIONS } from "@/lib/questions";
import { TOPICS, LANGUAGES } from "@/lib/constants";
import { TestResult } from "@/lib/types";
import { executeCode } from "@/lib/api/compile";
import { progressApi } from "@/lib/api/auth";
import LanguageSelector from "@/components/editor/LanguageSelector";
import OutputConsole from "@/components/editor/OutputConsole";
import AIChatPanel from "@/components/chat/AIChatPanel";
import VivaModal from "@/components/editor/VivaModal";

const MonacoEditor = dynamic(() => import("@/components/editor/MonacoEditor"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0d1117] animate-pulse" />,
});

function WorkbenchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { threadId, fetchProgress } = useProgress(user?.id || null);
  const { onKeystroke, onPaste, onRun, getEditorContext, getTimeSpent, reset: resetTelemetry } = useTelemetry();

  const questionId = searchParams.get("questionId");
  const question = questionId ? getQuestionById(questionId) : null;

  const [code, setCode] = useState(LANGUAGES.python3.starter);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [vivaCountdown, setVivaCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (question) {
      setCode(question.starterCode);
      setOutput("");
      setError(null);
      setExecutionTime(null);
      setTestResults([]);
      setStatus("idle");
      setIsConsoleOpen(false);
      resetTelemetry();
    }
  }, [question]);

  const handleRunCode = async () => {
    if (status === "running") return;
    setStatus("running");
    setOutput("");
    setError(null);
    setExecutionTime(null);
    setTestResults([]);
    setIsConsoleOpen(true);
    onRun();

    try {
      const result = await executeCode(code, "python3");
      setOutput(result.output);
      setError(result.error);
      setExecutionTime(result.executionTime);
      setStatus(result.success ? "success" : "error");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  const validateTestCases = async (): Promise<boolean> => {
    if (!question) return false;

    setStatus("running");
    setTestResults([]);

    // Build a single script that runs ALL test cases and outputs results separated by a delimiter
    // We set __name__ to suppress the student's `if __name__ == "__main__": print(...)` block
    const delimiter = "===SAPIOCODE_TEST_DELIMITER===";
    const testExpressions = question.testCases.map((tc) => tc.input);
    const testRunnerCode = `__name__ = "__test_runner__"
${code}

# --- SapioCode Test Runner ---
import sys
_test_expressions = ${JSON.stringify(testExpressions)}
_delimiter = "${delimiter}"
for _expr in _test_expressions:
    try:
        _result = eval(_expr)
        print(_result)
    except Exception as _e:
        print(f"ERROR: {_e}", file=sys.stderr)
        print("")
    if _expr != _test_expressions[-1]:
        print(_delimiter)
`;

    try {
      const result = await executeCode(testRunnerCode, "python3");
      const outputs = result.output.split(delimiter).map((s) => s.trim());
      const results: TestResult[] = [];

      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i];
        const actualOutput = (outputs[i] || "").trim();
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          input: testCase.input,
          actualOutput,
          passed,
          description: testCase.description,
          error: !passed && result.error ? result.error : undefined,
        });
      }

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      setStatus(allPassed ? "success" : "error");
      return allPassed;
    } catch (err: any) {
      const results: TestResult[] = question.testCases.map((tc) => ({
        input: tc.input,
        actualOutput: "",
        passed: false,
        description: tc.description,
        error: err.message,
      }));
      setTestResults(results);
      setStatus("error");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (status === "running") return;
    setIsConsoleOpen(true);

    const allPassed = await validateTestCases();

    if (allPassed) {
      // Show test results for 3 seconds before starting viva
      setVivaCountdown(3);
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setVivaCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          setVivaCountdown(null);
          setIsVivaOpen(true);
        }
      }, 1000);
    }
  };

  const handleVivaComplete = async (verdict: "pass" | "weak" | "fail", score: number) => {
    setIsVivaOpen(false);

    if (user && question) {
      try {
        // Always record the attempt (pass, weak, or fail)
        await progressApi.complete({
          user_id: user.id,
          question_id: question.id,
          topic_id: question.topicId,
          viva_score: score,
          viva_verdict: verdict,
          time_spent_seconds: getTimeSpent(),
          test_cases_passed: question.testCases.length,
          test_cases_total: question.testCases.length,
          code_snapshot: code,
        });

        // Refresh progress data from DB to update unlock state
        await fetchProgress();

        if (verdict === "pass") {
          // Reset state and go to progress page to see updated graph
          resetTelemetry();
          setCode(LANGUAGES.python3.starter);
          setOutput("");
          setError(null);
          setTestResults([]);
          setStatus("idle");
          router.push("/progress");
        }
        // On weak/fail, student stays on editor to retry
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const topic = question ? TOPICS.find((t) => t.id === question.topicId) : null;
  const editorContext = getEditorContext();

  return (
    <main className="h-screen w-screen bg-[#0d1117] text-[#e6edf3] flex flex-col overflow-hidden">
      <nav className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/progress")}
            className="p-2 hover:bg-white/5 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 opacity-40" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              sapio<span className="text-emerald-500">code</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-white/40">{user.full_name}</span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-5 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden z-10">
        <aside className="w-1/2 flex flex-col border-r border-white/5 bg-[#0d1117]">
          <div className="h-10 flex items-center px-4 border-b border-white/5 shrink-0 bg-[#161b22]">
            <button className="h-full flex items-center gap-2 border-b-2 border-white px-2 text-xs font-bold tracking-tight">
              Question
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {question ? (
              <div className="animate-fade-in max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-4">{question.title}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      question.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : question.difficulty === "medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                  {topic && (
                    <span className="text-xs font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                      {topic.name}
                    </span>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-[#e6edf3]/70 text-base leading-relaxed mb-6 whitespace-pre-wrap">
                    {question.description}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white/30">
                      Test Cases
                    </h4>
                    {question.testCases.map((tc, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-lg p-4 font-mono text-sm">
                        <div className="flex gap-2">
                          <span className="text-emerald-400">Input:</span>
                          <span className="text-white/60">{tc.input}</span>
                        </div>
                        <div className="text-xs text-white/30 mt-2">{tc.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[.3em] text-white/20 mb-6 block">
                  Problem Library
                </span>
                {QUESTIONS.map((q, i) => (
                  <a
                    key={q.id}
                    href={`?questionId=${q.id}`}
                    className="group flex items-center justify-between p-4 rounded-lg bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {q.title}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          q.difficulty === "easy"
                            ? "text-emerald-500/40"
                            : q.difficulty === "medium"
                            ? "text-amber-500/40"
                            : "text-red-500/40"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="w-1/2 flex flex-col bg-[#0d1117] relative">
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0 bg-[#161b22]">
            <div className="flex items-center gap-4">
              <LanguageSelector value="python3" onChange={() => {}} disabled={status === "running"} />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAIOpen(true)}
                className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 rounded-lg transition-all group"
              >
                <Bot className="w-4 h-4 text-emerald-500/60 group-hover:text-emerald-500" />
                <span className="text-xs font-bold text-white/40 group-hover:text-emerald-400 uppercase tracking-widest">
                  SapioBot
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 bg-[#0d1117]">
            <MonacoEditor
              language="python"
              value={code}
              onChange={setCode}
              onKeystroke={onKeystroke}
              onPaste={onPaste}
            />
          </div>

          <div className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isConsoleOpen ? "h-64" : "h-12"}`}>
            <div className="h-12 border-t border-white/5 bg-[#161b22] px-6 flex items-center justify-between shrink-0">
              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest"
              >
                Console
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${isConsoleOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleRunCode}
                  disabled={status === "running"}
                  className="min-w-[120px] h-10 bg-[#262626] border border-white/10 hover:border-white/20 hover:bg-[#333333] rounded-xl text-sm font-black text-white transition-all uppercase tracking-widest disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-emerald-500" />
                  {status === "running" ? "Running" : "Run"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={status === "running" || vivaCountdown !== null}
                  className="min-w-[120px] h-10 bg-[#2cbb5d] hover:bg-[#32d86c] rounded-xl text-sm font-black text-white transition-all uppercase tracking-widest disabled:opacity-40 active:scale-95 shadow-[0_4px_25px_rgba(44,187,93,0.3)] hover:shadow-[0_8px_30px_rgba(44,187,93,0.4)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {vivaCountdown !== null ? `Viva in ${vivaCountdown}...` : "Submit"}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#0d1117] overflow-y-auto">
              <OutputConsole
                output={output}
                error={error}
                executionTime={executionTime}
                status={status}
                testResults={testResults}
              />
              {vivaCountdown !== null && (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border-t border-emerald-500/20 animate-pulse">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-sm text-emerald-400 font-semibold">
                    All test cases passed! Starting viva verification in {vivaCountdown}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIChatPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        code={code}
        problemDescription={question?.description || ""}
        threadId={threadId || `user_${user.id}`}
        userId={user.id}
        editorContext={editorContext}
        compilerOutput={output || error || ""}
        failedTestCases={testResults
          .filter((r) => !r.passed)
          .map((r) => ({
            input: r.input,
            expected_output: question?.testCases.find((tc) => tc.input === r.input)?.expectedOutput || "",
            actual_output: r.actualOutput,
            error: r.error || "",
          }))}
      />

      <VivaModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
        code={code}
        problemDescription={question?.description || ""}
        threadId={threadId || `user_${user.id}`}
        userId={user.id}
        onComplete={handleVivaComplete}
      />
    </main>
  );
}

export default function WorkbenchPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#0d1117]" />}>
      <WorkbenchContent />
    </Suspense>
  );
}
