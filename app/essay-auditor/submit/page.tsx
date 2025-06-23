"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { mockTopics, Topic } from "@/data/mock-topics";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, ChevronLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TopicDetails = ({ topic }: { topic: Topic }) => {
  return (
    <div className="flex flex-col h-full bg-card p-6 lg:p-8 rounded-lg border">
      <div className="flex-grow overflow-y-auto pr-2">
        {topic.imageUrl && (
          <Image
            src={topic.imageUrl}
            alt={topic.title}
            width={400}
            height={225}
            className="w-full h-auto aspect-[16/9] object-cover rounded-md mb-6"
          />
        )}
        <div className="flex items-start space-x-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <h1 className="text-2xl font-bold">{topic.title}</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary">{topic.difficulty}</Badge>
          {topic.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>

        <p className="text-muted-foreground text-base leading-relaxed">
          {topic.description}
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Time Limit: {topic.timeLimit} minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                Word Count: {topic.wordLimit.min}-{topic.wordLimit.max} words
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Tips:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {topic.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 pt-6 mt-auto">
        <Link href="/essay-auditor/exam-hall">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Button>
        </Link>
      </div>
    </div>
  );
};

const WritingArea = ({
  text,
  setText,
  wordCount,
  charCount,
  onSubmit,
  topic,
}: {
  text: string;
  setText: (text: string) => void;
  wordCount: number;
  charCount: number;
  onSubmit: () => void;
  topic: Topic;
}) => {
  const [timeRemaining, setTimeRemaining] = useState(topic.timeLimit * 60); // seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage =
    topic.wordLimit.max > 0
      ? Math.min((wordCount / topic.wordLimit.max) * 100, 100)
      : 0;

  const isWordCountValid =
    wordCount >= topic.wordLimit.min && wordCount <= topic.wordLimit.max;

  return (
    <div className="flex flex-col h-full bg-card p-6 lg:p-8 rounded-lg border max-h-[calc(100vh-160px)]">
      {/* Timer and Controls */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono font-bold">
            {formatTime(timeRemaining)}
          </div>
          <Button
            onClick={() => setIsTimerActive(!isTimerActive)}
            variant={isTimerActive ? "destructive" : "default"}
            size="sm"
          >
            {isTimerActive ? "Pause" : "Start"} Timer
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Target: {topic.wordLimit.min}-{topic.wordLimit.max} words
        </div>
      </div>

      {/* Writing Area */}
      <div className="flex-grow flex flex-col min-h-0">
        <Textarea
          placeholder="Start writing your essay here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow resize-none text-base leading-relaxed min-h-[300px] h-full"
        />
      </div>

      {/* Word Count and Progress */}
      <div className="mt-6 space-y-4 flex-shrink-0">
        <div className="flex justify-between items-center text-sm">
          <span
            className={isWordCountValid ? "text-green-600" : "text-orange-600"}
          >
            Words: {wordCount} / {topic.wordLimit.max}
          </span>
          <span className="text-muted-foreground">Characters: {charCount}</span>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={!isWordCountValid || wordCount === 0}
            size="lg"
            className="mb-2"
          >
            Submit Essay for Review
          </Button>
        </div>
      </div>
    </div>
  );
};

function SubmitContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");

  const [text, setText] = useState("");

  const topic = useMemo(() => {
    return mockTopics.find((t) => t.id === topicId) || mockTopics[0];
  }, [topicId]);

  const wordCount = useMemo(() => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  }, [text]);

  const charCount = useMemo(() => {
    return text.length;
  }, [text]);

  const handleSubmit = () => {
    // Store the essay text for grading
    sessionStorage.setItem("essayText", text);
    sessionStorage.setItem("topicId", topic.id);

    // Navigate to grading page
    window.location.href = "/essay-auditor/grading";
  };

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-160px)]">
          {/* Topic Details Panel */}
          <TopicDetails topic={topic} />

          {/* Writing Panel */}
          <WritingArea
            text={text}
            setText={setText}
            wordCount={wordCount}
            charCount={charCount}
            onSubmit={handleSubmit}
            topic={topic}
          />
        </div>
      </div>
    </div>
  );
}

export default function Submit() {
  return (
    <Suspense
      fallback={
        <div className="h-full bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SubmitContent />
    </Suspense>
  );
}
