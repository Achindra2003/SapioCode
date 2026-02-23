"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User, BookOpen, BarChart3, Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import ProgressCircle from "@/components/progress/ProgressCircle";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { progress, isLoading, getAllTopicStatuses } = useProgress(user?.id || null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isMounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const topicStatuses = getAllTopicStatuses();
  const unlockedCount = topicStatuses.filter((t) => t.status !== "locked").length;
  const masteredQuestions = progress.filter((p) => p.status === "mastered").length;
  const totalQuestions = topicStatuses.reduce((acc, t) => acc + t.total_count, 0);
  const overallPct = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;

  const stats = [
    { label: "Topics Unlocked", value: `${unlockedCount}/${topicStatuses.length}`, icon: BookOpen },
    { label: "Problems Solved", value: `${masteredQuestions}/${totalQuestions}`, icon: BarChart3 },
    { label: "Overall Mastery", value: `${overallPct}%`, icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">
              sapio<span className="text-blue-600">code</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user.full_name}!
              </h1>
              <p className="text-gray-600">Ready to continue your learning journey?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push("/progress")}
            className="p-8 bg-blue-600 hover:bg-blue-700 rounded-2xl text-left transition-colors group"
          >
            <h2 className="text-xl font-bold text-white mb-2">Start Learning</h2>
            <p className="text-blue-100 mb-4">
              Pick a topic and start solving problems
            </p>
            <span className="text-white/80 group-hover:text-white font-medium">
              Open Skill Tree →
            </span>
          </button>

          <button
            onClick={() => router.push("/progress")}
            className="p-8 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-left transition-colors group"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">View Progress</h2>
            <p className="text-gray-600 mb-4">
              See your skill tree and track your mastery
            </p>
            <span className="text-blue-600 font-medium">
              View Progress →
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
