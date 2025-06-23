"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  FileText,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { mockTopics } from "@/data/mock-topics";

export default function TopicDetail() {
  const params = useParams();
  const topicId = params.id as string;

  const topic = useMemo(() => {
    return mockTopics.find((t) => t.id === topicId);
  }, [topicId]);

  if (!topic) {
    return (
      <div className="h-full bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Topic Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The topic you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/essay-auditor/exam-hall">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/essay-auditor/exam-hall">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              {topic.imageUrl && (
                <Image
                  src={topic.imageUrl}
                  alt={topic.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">{topic.title}</h1>
                <Badge className={getDifficultyColor(topic.difficulty)}>
                  {topic.difficulty}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {topic.examType.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
                {topic.category.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Essay Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Essay Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{topic.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Time Limit</div>
                      <div className="text-sm text-muted-foreground">
                        {topic.timeLimit} minutes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Word Count</div>
                      <div className="text-sm text-muted-foreground">
                        {topic.wordLimit.min} - {topic.wordLimit.max} words
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Assessment Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(topic.criteria).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold capitalize mb-1">{key}</h4>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sample Outline */}
            {topic.sampleOutline && (
              <Card>
                <CardHeader>
                  <CardTitle>Sample Essay Outline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {topic.sampleOutline.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/essay-auditor/submit?topic=${topic.id}`}
                  className="block"
                >
                  <Button className="w-full" size="lg">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Writing
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Write your essay and get instant AI feedback
                </p>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topic.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card>
              <CardHeader>
                <CardTitle>Source Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Exam:</span>{" "}
                    {topic.source.exam}
                  </div>
                  {topic.source.year && (
                    <div>
                      <span className="font-semibold">Year:</span>{" "}
                      {topic.source.year}
                    </div>
                  )}
                  {topic.source.section && (
                    <div>
                      <span className="font-semibold">Section:</span>{" "}
                      {topic.source.section}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
