"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeacherPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/teacher/classrooms");
  }, [router]);
  return null;
}
