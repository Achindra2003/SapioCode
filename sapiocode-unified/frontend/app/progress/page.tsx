"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { TOPICS } from "@/lib/constants";
import { getQuestionsByTopic } from "@/lib/questions";
import SkillTree from "@/components/progress/SkillTree";
import QuestionList from "@/components/progress/QuestionList";
import ProgressCircle from "@/components/progress/ProgressCircle";

export default function ProgressPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { progress, isLoading, getAllTopicStatuses } = useProgress(user?.id || null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  const topicStatuses = getAllTopicStatuses();
  const selectedTopic = topicStatuses.find((t) => t.id === selectedTopicId);
  const selectedQuestions = selectedTopicId ? getQuestionsByTopic(selectedTopicId) : [];

  const overallProgress =
    topicStatuses.reduce((acc, t) => acc + t.completion_rate, 0) / topicStatuses.length;

  if (!isMounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Learning Progress</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">{user.full_name}</span>
              <span className="text-xs text-gray-500">Overall: {Math.round(overallProgress * 100)}%</span>
            </div>
            <ProgressCircle percentage={overallProgress * 100} size={40} strokeWidth={4} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Learning Stages
            </h2>
            <SkillTree
              topics={topicStatuses}
              selectedTopicId={selectedTopicId}
              onTopicSelect={setSelectedTopicId}
            />
          </div>

          <div className="flex-1">
            {selectedTopic ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedTopic.name}</h3>
                      <p className="text-sm text-gray-500">{selectedTopic.description}</p>
                    </div>
                    <ProgressCircle
                      percentage={selectedTopic.completion_rate * 100}
                      size={60}
                      strokeWidth={5}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <QuestionList
                    questions={selectedQuestions}
                    progress={progress}
                    topicId={selectedTopic.id}
                    topicStatus={selectedTopic.status}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <LayoutDashboard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Topic
                </h3>
                <p className="text-gray-500">
                  Choose a topic from the left to view its questions and start learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
