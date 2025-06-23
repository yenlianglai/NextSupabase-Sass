export interface Topic {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  examType: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string[];
  timeLimit: number; // minutes
  wordLimit: {
    min: number;
    max: number;
  };
  tags: string[];
  source: {
    exam: string;
    year?: string;
    section?: string;
  };
  criteria: {
    grammar: string;
    vocabulary: string;
    coherence: string;
    taskResponse: string;
  };
  tips: string[];
  sampleOutline?: string[];
}

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Technology and Education",
    description:
      "Do you agree or disagree with the following statement? Technology has made the world a better place to live. Use specific reasons and examples to support your answer.",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    examType: ["TOEFL", "IELTS"],
    difficulty: "Intermediate",
    category: ["Technology", "Education"],
    timeLimit: 30,
    wordLimit: { min: 300, max: 400 },
    tags: ["argumentative", "technology", "education", "modern life"],
    source: {
      exam: "TOEFL iBT",
      year: "2023",
      section: "Independent Writing",
    },
    criteria: {
      grammar: "Clear and accurate grammar structures (25%)",
      vocabulary: "Appropriate and varied vocabulary usage (25%)",
      coherence: "Logical organization and smooth transitions (25%)",
      taskResponse:
        "Complete response to the prompt with relevant examples (25%)",
    },
    tips: [
      "Take a clear stance (agree or disagree)",
      "Provide 2-3 specific examples",
      "Use transition words to connect ideas",
      "Conclude by restating your position",
    ],
    sampleOutline: [
      "Introduction: State your position",
      "Body 1: First reason with example",
      "Body 2: Second reason with example",
      "Body 3: Address counterargument (optional)",
      "Conclusion: Restate position and summarize",
    ],
  },
  {
    id: "2",
    title: "Environmental Protection",
    description:
      "Some people believe that environmental problems are too big for individuals to solve, while others think individuals can make a significant difference. Discuss both views and give your opinion.",
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    examType: ["IELTS", "學測"],
    difficulty: "Advanced",
    category: ["Environment", "Society"],
    timeLimit: 40,
    wordLimit: { min: 250, max: 350 },
    tags: [
      "discussion",
      "environment",
      "individual responsibility",
      "global issues",
    ],
    source: {
      exam: "IELTS Academic",
      year: "2024",
      section: "Writing Task 2",
    },
    criteria: {
      grammar: "Wide range of grammatical structures used accurately (25%)",
      vocabulary: "Wide range of vocabulary with natural usage (25%)",
      coherence: "Clear progression with appropriate linking devices (25%)",
      taskResponse:
        "Addresses all parts of the task with developed ideas (25%)",
    },
    tips: [
      "Discuss BOTH views equally before giving your opinion",
      "Use formal academic language",
      "Include specific examples for each viewpoint",
      "Make your own opinion clear in the conclusion",
    ],
    sampleOutline: [
      "Introduction: Paraphrase question + thesis",
      "Body 1: View 1 - Problems too big for individuals",
      "Body 2: View 2 - Individuals can make difference",
      "Body 3: Your opinion with reasoning",
      "Conclusion: Summarize views + restate opinion",
    ],
  },
  {
    id: "3",
    title: "Social Media Impact",
    description:
      "In your opinion, what are the positive and negative effects of social media on young people? Provide specific examples to support your points.",
    imageUrl:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070&auto=format&fit=crop",
    examType: ["TOEFL", "GRE"],
    difficulty: "Intermediate",
    category: ["Technology", "Society", "Youth"],
    timeLimit: 25,
    wordLimit: { min: 250, max: 300 },
    tags: ["social media", "youth", "technology impact", "argumentative"],
    source: {
      exam: "TOEFL iBT",
      year: "2023",
      section: "Independent Writing",
    },
    criteria: {
      grammar: "Consistent grammatical accuracy (25%)",
      vocabulary: "Appropriate topic-related vocabulary (25%)",
      coherence: "Clear organization with good flow (25%)",
      taskResponse: "Balanced discussion with relevant examples (25%)",
    },
    tips: [
      "Balance positive and negative effects equally",
      "Use current, relatable examples",
      "Consider various aspects: social, educational, mental health",
      "Maintain objective tone while giving opinion",
    ],
    sampleOutline: [
      "Introduction: Hook + background + thesis",
      "Body 1: Positive effects (2-3 points)",
      "Body 2: Negative effects (2-3 points)",
      "Body 3: Personal opinion/conclusion",
      "Conclusion: Summarize main points",
    ],
  },
  {
    id: "4",
    title: "Work-Life Balance",
    description:
      "Many people struggle to maintain a healthy work-life balance. What do you think are the main causes of this problem and what solutions would you suggest?",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    examType: ["IELTS", "GRE"],
    difficulty: "Intermediate",
    category: ["Work", "Society", "Health"],
    timeLimit: 35,
    wordLimit: { min: 280, max: 350 },
    tags: ["work-life balance", "problem-solution", "modern life", "health"],
    source: {
      exam: "IELTS Academic",
      year: "2023",
      section: "Writing Task 2",
    },
    criteria: {
      grammar: "Good range of structures (25%)",
      vocabulary: "Relevant vocabulary used effectively (25%)",
      coherence: "Clear development of ideas (25%)",
      taskResponse: "Addresses causes AND solutions clearly (25%)",
    },
    tips: [
      "Clearly identify 2-3 causes",
      "Propose a specific solution for each cause",
      "Explain how your solutions would work",
      "Organize your essay into problem and solution sections",
    ],
    sampleOutline: [
      "Introduction: Introduce the problem",
      "Body 1: Cause 1 and its solution",
      "Body 2: Cause 2 and its solution",
      "Conclusion: Summarize and give final thought",
    ],
  },
  {
    id: "5",
    title: "Online Learning Benefits",
    description:
      "What are the advantages and disadvantages of online learning compared to traditional classroom education?",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    examType: ["TOEFL", "學測"],
    difficulty: "Beginner",
    category: ["Education", "Technology"],
    timeLimit: 20,
    wordLimit: { min: 200, max: 300 },
    tags: ["online learning", "education", "comparison", "technology"],
    source: {
      exam: "學測",
      year: "2024",
      section: "英文作文",
    },
    criteria: {
      grammar: "Basic grammar with few errors (25%)",
      vocabulary: "Appropriate vocabulary for level (25%)",
      coherence: "Clear structure with basic transitions (25%)",
      taskResponse: "Addresses both advantages and disadvantages (25%)",
    },
    tips: [
      "Compare both advantages AND disadvantages",
      "Use simple, clear examples",
      "Organize with clear paragraphs",
      "Use comparison language (while, whereas, however)",
    ],
    sampleOutline: [
      "Introduction: Topic introduction",
      "Body 1: Advantages of online learning",
      "Body 2: Disadvantages of online learning",
      "Conclusion: Balanced summary",
    ],
  },
];

export const examTypes = ["TOEFL", "IELTS", "學測", "GRE"];
export const difficulties = ["Beginner", "Intermediate", "Advanced"];
export const categories = [
  "Technology",
  "Education",
  "Environment",
  "Society",
  "Culture",
  "Work",
  "Health",
  "Travel",
];
