// ============================================================
// Teacher API Service Layer
// All backend calls are defined here with mock implementations.
// When the backend is ready, swap mock functions with real
// fetch calls — this is the ONLY file that needs to change.
// ============================================================

// ----- Type Definitions -----

export interface Classroom {
  _id: string;
  name: string;
  join_code: string;
  student_count: number;
  problem_count: number;
  created_at: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface VivaQuestion {
  question: string;
  expected_answer_keywords: string[];
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  target_concepts: string[];
  test_cases: TestCase[];
  viva_questions: VivaQuestion[];
  status: "draft" | "published";
  created_at: string;
}

export interface GeneratedProblem {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  target_concepts: string[];
  test_cases: TestCase[];
  viva_questions: VivaQuestion[];
}

// ----- Helpers -----

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const randomId = () => Math.random().toString(36).substring(2, 10);
const randomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

// ----- Mock Data Store (in-memory, resets on reload) -----

const mockStudents: Student[] = [
  { _id: "s1", name: "Alice Chen", email: "alice@student.edu" },
  { _id: "s2", name: "Bob Martinez", email: "bob@student.edu" },
  { _id: "s3", name: "Carol Williams", email: "carol@student.edu" },
  { _id: "s4", name: "David Kim", email: "david@student.edu" },
  { _id: "s5", name: "Eve Johnson", email: "eve@student.edu" },
  { _id: "s6", name: "Frank Liu", email: "frank@student.edu" },
  { _id: "s7", name: "Grace Park", email: "grace@student.edu" },
  { _id: "s8", name: "Hank Davis", email: "hank@student.edu" },
];

const mockProblems: Problem[] = [
  {
    _id: "p1",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example:**\n```\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\n```",
    difficulty: "beginner",
    topic: "Arrays",
    target_concepts: ["arrays", "hash maps", "iteration"],
    test_cases: [
      { input: "[2,7,11,15]\n9", expected_output: "[0,1]", is_hidden: false },
      { input: "[3,2,4]\n6", expected_output: "[1,2]", is_hidden: false },
      { input: "[3,3]\n6", expected_output: "[0,1]", is_hidden: true },
    ],
    viva_questions: [
      {
        question: "What is the time complexity of your solution?",
        expected_answer_keywords: ["O(n)", "linear", "hash map"],
      },
      {
        question: "Why did you choose a hash map over nested loops?",
        expected_answer_keywords: ["efficiency", "O(n^2)", "lookup", "constant time"],
      },
    ],
    status: "published",
    created_at: "2026-02-15T10:30:00Z",
  },
  {
    _id: "p2",
    title: "Reverse a Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\n**Example:**\n```\nInput: head = [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]\n```",
    difficulty: "intermediate",
    topic: "Linked Lists",
    target_concepts: ["linked lists", "pointers", "iteration"],
    test_cases: [
      { input: "[1,2,3,4,5]", expected_output: "[5,4,3,2,1]", is_hidden: false },
      { input: "[1,2]", expected_output: "[2,1]", is_hidden: false },
      { input: "[]", expected_output: "[]", is_hidden: true },
    ],
    viva_questions: [
      {
        question: "Can you explain the iterative approach step by step?",
        expected_answer_keywords: ["prev", "current", "next", "pointer"],
      },
    ],
    status: "published",
    created_at: "2026-02-18T14:00:00Z",
  },
  {
    _id: "p3",
    title: "Binary Search",
    description:
      "Given a sorted array of integers `nums` and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1.\n\n**Example:**\n```\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\n```",
    difficulty: "beginner",
    topic: "Searching",
    target_concepts: ["binary search", "divide and conquer", "logarithmic time"],
    test_cases: [
      { input: "[-1,0,3,5,9,12]\n9", expected_output: "4", is_hidden: false },
      { input: "[-1,0,3,5,9,12]\n2", expected_output: "-1", is_hidden: false },
    ],
    viva_questions: [
      {
        question: "What is the time complexity of binary search and why?",
        expected_answer_keywords: ["O(log n)", "halving", "divide"],
      },
    ],
    status: "draft",
    created_at: "2026-02-20T09:15:00Z",
  },
  {
    _id: "p4",
    title: "Valid Parentheses",
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\n**Example:**\n```\nInput: s = "()[]{}"\nOutput: true\n```',
    difficulty: "beginner",
    topic: "Stacks",
    target_concepts: ["stacks", "string processing", "matching"],
    test_cases: [
      { input: '"()[]{}"', expected_output: "true", is_hidden: false },
      { input: '"(]"', expected_output: "false", is_hidden: false },
      { input: '"([)]"', expected_output: "false", is_hidden: true },
    ],
    viva_questions: [
      {
        question: "Why is a stack the ideal data structure for this problem?",
        expected_answer_keywords: ["LIFO", "matching", "nesting", "order"],
      },
    ],
    status: "published",
    created_at: "2026-02-22T11:45:00Z",
  },
];

let classrooms: Classroom[] = [
  {
    _id: "c1",
    name: "CS101 — Intro to Programming",
    join_code: "ABC123",
    student_count: 5,
    problem_count: 3,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    _id: "c2",
    name: "CS201 — Data Structures",
    join_code: "XYZ789",
    student_count: 3,
    problem_count: 1,
    created_at: "2026-01-15T10:00:00Z",
  },
];

const classroomStudentMap: Record<string, string[]> = {
  c1: ["s1", "s2", "s3", "s4", "s5"],
  c2: ["s3", "s6", "s7"],
};

const classroomProblemMap: Record<string, string[]> = {
  c1: ["p1", "p2", "p3"],
  c2: ["p4"],
};

let allProblems = [...mockProblems];

// ----- API Functions -----

export const teacherAPI = {
  // Fetch all classrooms for the current teacher
  getClassrooms: async (): Promise<Classroom[]> => {
    await delay(400);
    return [...classrooms];
  },

  // Create a new classroom
  createClassroom: async (name: string): Promise<Classroom> => {
    await delay(600);
    const newClassroom: Classroom = {
      _id: randomId(),
      name,
      join_code: randomCode(),
      student_count: 0,
      problem_count: 0,
      created_at: new Date().toISOString(),
    };
    classrooms.push(newClassroom);
    classroomStudentMap[newClassroom._id] = [];
    classroomProblemMap[newClassroom._id] = [];
    return newClassroom;
  },

  // Get classroom details with students and problems
  getClassroom: async (
    id: string
  ): Promise<{ classroom: Classroom; students: Student[]; problems: Problem[] }> => {
    await delay(500);
    const classroom = classrooms.find((c) => c._id === id);
    if (!classroom) throw new Error("Classroom not found");

    const studentIds = classroomStudentMap[id] || [];
    const students = mockStudents.filter((s) => studentIds.includes(s._id));

    const problemIds = classroomProblemMap[id] || [];
    const problems = allProblems.filter((p) => problemIds.includes(p._id));

    return { classroom, students, problems };
  },

  // AI-generate a problem from a prompt
  generateProblem: async (prompt: string): Promise<GeneratedProblem> => {
    await delay(2000); // Simulate AI generation latency
    return {
      title: `AI Problem: ${prompt.slice(0, 40)}`,
      description: `Write a function that solves the following:\n\n${prompt}\n\nYour solution should handle edge cases and be optimally efficient.\n\n**Example:**\n\`\`\`\nInput: [example input based on prompt]\nOutput: [expected output]\n\`\`\`\n\n**Constraints:**\n- Input size can be up to 10^5\n- Elements are integers in range [-10^4, 10^4]`,
      difficulty: "intermediate",
      topic: "Algorithms",
      target_concepts: ["problem solving", "algorithms", "optimization"],
      test_cases: [
        {
          input: "sample_input_1",
          expected_output: "expected_output_1",
          is_hidden: false,
        },
        {
          input: "sample_input_2",
          expected_output: "expected_output_2",
          is_hidden: false,
        },
        {
          input: "edge_case_input",
          expected_output: "edge_case_output",
          is_hidden: true,
        },
      ],
      viva_questions: [
        {
          question: "What is the time complexity of your solution?",
          expected_answer_keywords: ["complexity", "big-O", "efficient"],
        },
        {
          question: "How does your solution handle edge cases?",
          expected_answer_keywords: ["edge case", "empty", "boundary", "validation"],
        },
      ],
    };
  },

  // Create a new problem in a classroom
  createProblem: async (
    classroomId: string,
    data: Omit<Problem, "_id" | "created_at">
  ): Promise<{ problem_id: string }> => {
    await delay(600);
    const newProblem: Problem = {
      ...data,
      _id: randomId(),
      created_at: new Date().toISOString(),
    };
    allProblems.push(newProblem);
    if (!classroomProblemMap[classroomId]) {
      classroomProblemMap[classroomId] = [];
    }
    classroomProblemMap[classroomId].push(newProblem._id);

    // Update classroom problem count
    const classroom = classrooms.find((c) => c._id === classroomId);
    if (classroom) classroom.problem_count += 1;

    return { problem_id: newProblem._id };
  },

  // Update an existing problem
  updateProblem: async (problemId: string, data: Partial<Problem>): Promise<void> => {
    await delay(500);
    const idx = allProblems.findIndex((p) => p._id === problemId);
    if (idx === -1) throw new Error("Problem not found");
    allProblems[idx] = { ...allProblems[idx], ...data };
  },

  // Delete a problem
  deleteProblem: async (problemId: string): Promise<void> => {
    await delay(400);
    allProblems = allProblems.filter((p) => p._id !== problemId);
    // Remove from all classroom mappings
    for (const key of Object.keys(classroomProblemMap)) {
      classroomProblemMap[key] = classroomProblemMap[key].filter(
        (id) => id !== problemId
      );
      const classroom = classrooms.find((c) => c._id === key);
      if (classroom) {
        classroom.problem_count = classroomProblemMap[key].length;
      }
    }
  },
};
