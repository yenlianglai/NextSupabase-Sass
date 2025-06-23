export interface FeedbackItem {
  startIndex: number;
  endIndex: number;
  highlightedText: string;
  suggestion: string;
  explanation: string;
  detailedExplanation: string;
  categoryName: ScoreCategory["name"];
}

export interface ScoreCategory {
  name: "Grammar" | "Clarity" | "Cohesion" | "Vocabulary" | "Structure";
  score: number;
  description: string;
}

export interface GradingResult {
  overallScore: number;
  overallFeedback: string;
  scores: ScoreCategory[];
  feedbackItems: FeedbackItem[];
  essayText: string;
}

export const mockGradingResult: GradingResult = {
  overallScore: 85,
  overallFeedback:
    "This is a strong essay with good arguments, but it could be improved by paying closer attention to grammatical details and refining word choice for better clarity and impact.",
  essayText: `The advent of artificial intelligence represent a paradigm shift in technology. Many peoples are optimistic about its potential, but other are concerned. The subject is what the essay will explore. The main argument is not clear to me. AI has the potential to solve many world problems. Also, this technology could lead to job displacement. I think that it is a complex issue with no easy answers. These new technologies is developing at an unprecedented pace.`,
  scores: [
    {
      name: "Grammar",
      score: 80,
      description: "Some minor grammatical errors were found.",
    },
    {
      name: "Clarity",
      score: 85,
      description:
        "The main ideas are clear, but some sentences could be more direct.",
    },
    {
      name: "Cohesion",
      score: 90,
      description:
        "The essay flows well and the paragraphs are logically connected.",
    },
    {
      name: "Vocabulary",
      score: 82,
      description:
        "Good word choice, but some words could be more precise or impactful.",
    },
    {
      name: "Structure",
      score: 88,
      description:
        "Excellent structure with a clear introduction, body, and conclusion.",
    },
  ],
  feedbackItems: [
    {
      startIndex: 37,
      endIndex: 46,
      highlightedText: "represent",
      suggestion: "represents",
      explanation: "Subject-verb agreement error.",
      detailedExplanation:
        "The subject 'advent' is singular, so the verb must also be singular. 'Represents' is the correct form for a third-person singular subject in the present tense.",
      categoryName: "Grammar",
    },
    {
      startIndex: 73,
      endIndex: 82,
      highlightedText: "peoples",
      suggestion: "people",
      explanation: "Incorrect plural form.",
      detailedExplanation:
        "'People' is already the plural form of 'person'. 'Peoples' is only used when referring to distinct ethnic groups or nations, which is not the context here.",
      categoryName: "Grammar",
    },
    {
      startIndex: 135,
      endIndex: 149,
      highlightedText: "other are",
      suggestion: "others are",
      explanation: "Incorrect pronoun usage.",
      detailedExplanation:
        "'Other' is an adjective, while 'others' is a pronoun. In this context, a pronoun is needed to refer to 'other people'.",
      categoryName: "Grammar",
    },
    {
      startIndex: 247,
      endIndex: 259,
      highlightedText: "technologies is",
      suggestion: "technologies are",
      explanation: "Subject-verb agreement error.",
      detailedExplanation:
        "The subject 'technologies' is plural, therefore the verb must be the plural form 'are'.",
      categoryName: "Grammar",
    },
    {
      startIndex: 60,
      endIndex: 68,
      highlightedText: "good",
      suggestion: "excellent",
      explanation: "Consider using a stronger adjective.",
      detailedExplanation:
        "While 'good' is grammatically correct, using a more descriptive and powerful adjective like 'excellent' or 'outstanding' can make your writing more impactful and engaging for the reader.",
      categoryName: "Vocabulary",
    },
    {
      startIndex: 164,
      endIndex: 191,
      highlightedText: "The subject is what",
      suggestion: "The subject of the sentence is",
      explanation: "Sentence structure is unclear.",
      detailedExplanation:
        "The phrasing 'The subject is what' is informal and can be confusing. Rephrasing to 'The subject of the sentence is' creates a more formal and clear grammatical structure.",
      categoryName: "Structure",
    },
    {
      startIndex: 220,
      endIndex: 235,
      highlightedText: "is not clear to",
      suggestion: "lacks clarity for",
      explanation: "Word choice could be more concise.",
      detailedExplanation:
        "Using 'lacks clarity for' is a more professional and concise way to express that something is unclear to someone, improving the overall tone of the sentence.",
      categoryName: "Clarity",
    },
    {
      startIndex: 265,
      endIndex: 275,
      highlightedText: "Also, this",
      suggestion: "Furthermore, this",
      explanation: "Transition word could be improved.",
      detailedExplanation:
        "'Also' is a common transition word, but 'Furthermore' adds a greater sense of formality and continuation of an argument, strengthening the link between sentences.",
      categoryName: "Cohesion",
    },
    {
      startIndex: 298,
      endIndex: 309,
      highlightedText: "I think that",
      suggestion: "It is evident that",
      explanation: "Avoid using first-person perspective.",
      detailedExplanation:
        "In academic or formal writing, it's often better to avoid the first person ('I think'). Phrasing like 'It is evident that' presents the idea as an objective fact rather than a personal opinion.",
      categoryName: "Clarity",
    },
  ],
};
