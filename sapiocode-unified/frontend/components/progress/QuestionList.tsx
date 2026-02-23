"use client";

import { Question, UserProgress } from "@/lib/types";
import { CheckCircle2, Circle, Play, Lock } from "lucide-react";
import Link from "next/link";

interface QuestionListProps {
  questions: Question[];
  progress: UserProgress[];
  topicId: string;
  topicStatus?: "locked" | "unlocked" | "mastered";
}

export default function QuestionList({ questions, progress, topicId, topicStatus = "unlocked" }: QuestionListProps) {
  const isTopicLocked = topicStatus === "locked";

  const getQuestionStatus = (questionId: string): "mastered" | "in_progress" | "todo" => {
    const p = progress.find((prog) => prog.question_id === questionId);
    if (!p) return "todo";
    if (p.status === "mastered") return "mastered";
    if (p.status === "in_progress") return "in_progress";
    return "todo";
  };

  return (
    <div className="space-y-2">
      {questions.map((question, index) => {
        const status = getQuestionStatus(question.id);

        if (isTopicLocked) {
          return (
            <div
              key={question.id}
              className="flex items-center justify-between p-4 rounded-lg border border-transparent opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-400 w-4">{index + 1}.</span>
                <div className="p-1.5 rounded-full bg-gray-100 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">{question.title}</h4>
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={question.id}
            href={`/workbench?questionId=${question.id}`}
            className="group flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-4">{index + 1}.</span>
              <div
                className={`p-1.5 rounded-full ${
                  status === "mastered"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {status === "mastered" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    status === "mastered" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {question.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      question.difficulty === "easy"
                        ? "text-emerald-500"
                        : question.difficulty === "medium"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ~{question.estimatedTime} min
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status === "mastered" ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100 uppercase">
                  Mastered
                </span>
              ) : status === "in_progress" ? (
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100 uppercase">
                  In Progress
                </span>
              ) : (
                <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold border border-gray-100 uppercase">
                  Todo
                </span>
              )}
              <Play className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
