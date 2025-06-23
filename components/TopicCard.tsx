import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, BookOpen, Eye } from "lucide-react";
import { Topic } from "@/data/mock-topics";

interface TopicCardProps {
  topic: Topic;
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

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card className="bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link href={`/essay-auditor/topic/${topic.id}`}>
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer text-foreground">
              {topic.title}
            </CardTitle>
          </Link>
          <Badge className={getDifficultyColor(topic.difficulty)}>
            {topic.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{topic.timeLimit} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>
              {topic.wordLimit.min}-{topic.wordLimit.max} words
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {topic.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {topic.examType.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/essay-auditor/submit?topic=${topic.id}`}
            className="flex-1"
          >
            <Button className="w-full" size="sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Start Writing
            </Button>
          </Link>
          <Link href={`/essay-auditor/topic/${topic.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
