"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  ArrowLeft,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  mockGradingResult,
  FeedbackItem,
  ScoreCategory,
} from "@/data/mock-grading";
import Link from "next/link";

const ScoreCard = ({ category }: { category: ScoreCategory }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90)
      return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800";
    if (score >= 80)
      return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800";
    if (score >= 70)
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
  };

  const getIcon = (score: number) => {
    if (score >= 90)
      return (
        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      );
    if (score >= 80)
      return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    if (score >= 70)
      return (
        <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      );
    return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${getScoreBgColor(
        category.score
      )}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getIcon(category.score)}
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-3xl font-bold ${getScoreColor(category.score)}`}
          >
            {category.score}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            /100
          </span>
        </div>
        <Progress value={category.score} className="mb-3 h-2" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
};

const FeedbackHighlight = ({
  item,
  originalText,
  onHighlight,
}: {
  item: FeedbackItem;
  originalText: string;
  onHighlight: (item: FeedbackItem) => void;
}) => {
  const beforeText = originalText.slice(0, item.startIndex);
  const highlightedText = originalText.slice(item.startIndex, item.endIndex);
  const afterText = originalText.slice(item.endIndex);

  return (
    <div className="text-base leading-relaxed">
      <span>{beforeText}</span>
      <span
        className="bg-yellow-200/80 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 px-1 py-0.5 rounded-md cursor-pointer hover:bg-yellow-300/80 dark:hover:bg-yellow-800/60 transition-all duration-200 border border-yellow-300/50 dark:border-yellow-800/50"
        onClick={() => onHighlight(item)}
        title="Click for details"
      >
        {highlightedText}
      </span>
      <span>{afterText}</span>
    </div>
  );
};

export default function Results() {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [showOriginal, setShowOriginal] = useState(true);
  const [essayText, setEssayText] = useState("");

  useEffect(() => {
    // Get essay text from session storage
    const storedText = sessionStorage.getItem("essayText");
    if (storedText) {
      setEssayText(storedText);
    } else {
      // Fallback to mock data
      setEssayText(mockGradingResult.essayText);
    }
  }, []);

  const handleFeedbackClick = (item: FeedbackItem) => {
    setSelectedFeedback(item);
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getOverallBadge = (score: number) => {
    if (score >= 90)
      return {
        text: "Excellent",
        variant: "default" as const,
        bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      };
    if (score >= 80)
      return {
        text: "Good",
        variant: "secondary" as const,
        bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      };
    if (score >= 70)
      return {
        text: "Fair",
        variant: "outline" as const,
        bg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      };
    return {
      text: "Needs Improvement",
      variant: "destructive" as const,
      bg: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
  };

  const textToDisplay = showOriginal ? essayText : mockGradingResult.essayText;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-8 w-8 text-primary" />
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Essay Analysis Results
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Comprehensive feedback and scoring for your submission
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/essay-auditor/submit">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Another Essay
                </Button>
              </Link>
              <Link href="/essay-auditor/exam-hall">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Topics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Overall Score - Enhanced */}
            <Card className="gradient-card modern-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-6xl font-bold ${getOverallScoreColor(
                        mockGradingResult.overallScore
                      )}`}
                    >
                      {mockGradingResult.overallScore}
                    </div>
                    <div className="text-2xl text-muted-foreground font-medium">
                      /100
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        getOverallBadge(mockGradingResult.overallScore).bg
                      }`}
                    >
                      {getOverallBadge(mockGradingResult.overallScore).text}
                    </div>
                    <Progress
                      value={mockGradingResult.overallScore}
                      className="h-4"
                    />
                    <p className="text-muted-foreground leading-relaxed">
                      {mockGradingResult.overallFeedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Detailed Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockGradingResult.scores.map((category) => (
                  <ScoreCard key={category.name} category={category} />
                ))}
              </div>
            </div>

            {/* Essay with Highlights */}
            <Card className="gradient-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Your Essay with Feedback
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="gap-2"
                  >
                    {showOriginal ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showOriginal ? "Hide" : "Show"} Highlights
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 dark:bg-muted/20 p-6 rounded-lg border max-h-96 overflow-y-auto backdrop-blur-sm">
                  {showOriginal &&
                  mockGradingResult.feedbackItems.length > 0 ? (
                    <div>
                      {mockGradingResult.feedbackItems.map((item, index) => (
                        <FeedbackHighlight
                          key={index}
                          item={item}
                          originalText={textToDisplay}
                          onHighlight={handleFeedbackClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-base leading-relaxed">
                      {textToDisplay}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Click on highlighted text to see detailed feedback
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <Link href="/essay-auditor/submit" className="block">
                  <Button className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Write Another Essay
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Feedback Details */}
            {selectedFeedback && (
              <Card className="gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Badge variant="outline" className="text-xs">
                      {selectedFeedback.categoryName}
                    </Badge>
                    Feedback Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Original Text
                    </h4>
                    <p className="text-sm bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      &ldquo;{selectedFeedback.highlightedText}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Suggestion
                    </h4>
                    <p className="text-sm bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      &ldquo;{selectedFeedback.suggestion}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Explanation
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedFeedback.explanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Detailed Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedFeedback.detailedExplanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Improvement Tips */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Improvement Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 dark:bg-muted/20">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Focus on subject-verb agreement to improve grammar score
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 dark:bg-muted/20">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Use more varied vocabulary to enhance your writing
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 dark:bg-muted/20">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Add transition words to improve coherence
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 dark:bg-muted/20">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Practice formal academic writing style
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
