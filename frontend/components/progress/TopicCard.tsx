"use client";

import { TopicStatus } from "@/lib/types";
import { Lock, CheckCircle, ChevronRight } from "lucide-react";
import ProgressCircle from "./ProgressCircle";

interface TopicCardProps {
  topic: TopicStatus;
  isSelected: boolean;
  onClick: () => void;
}

export default function TopicCard({ topic, isSelected, onClick }: TopicCardProps) {
  const isLocked = topic.status === "locked";
  const isMastered = topic.status === "mastered";

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
        ${
          isLocked
            ? "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
            : isSelected
            ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100"
            : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isLocked
              ? "bg-gray-100 text-gray-400"
              : isMastered
              ? "bg-emerald-100 text-emerald-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : isMastered ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <span className="text-lg font-bold">{topic.order}</span>
          )}
        </div>
        <div>
          <p
            className={`font-semibold ${
              isLocked ? "text-gray-400" : isSelected ? "text-blue-900" : "text-gray-700"
            }`}
          >
            {topic.name}
          </p>
          <p className="text-xs text-gray-500">
            {topic.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {topic.mastered_count}/{topic.total_count} questions completed
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!isLocked && (
          <>
            <ProgressCircle percentage={topic.completion_rate * 100} size={44} strokeWidth={4} />
            <ChevronRight
              className={`w-5 h-5 transition-transform ${
                isSelected ? "rotate-90 text-blue-600" : "text-gray-300"
              }`}
            />
          </>
        )}
      </div>
    </button>
  );
}
