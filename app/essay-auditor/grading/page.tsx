"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Grading() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Analyzing grammar and syntax...",
    "Evaluating vocabulary usage...",
    "Checking coherence and flow...",
    "Assessing structure and organization...",
    "Generating personalized feedback...",
    "Finalizing your results...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }

        // Update current step based on progress
        const newStep = Math.floor((prev / 100) * steps.length);
        if (newStep !== currentStep && newStep < steps.length) {
          setCurrentStep(newStep);
        }

        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, steps.length]);

  useEffect(() => {
    if (isComplete) {
      // Redirect to results after a short delay
      const timeout = setTimeout(() => {
        window.location.href = "/essay-auditor/results";
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isComplete]);

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="mb-8">
              {isComplete ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <div className="relative mb-4">
                  <Clock className="h-16 w-16 text-primary mx-auto animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary/60 animate-bounce" />
                  </div>
                </div>
              )}

              <h1 className="text-3xl font-bold mb-2">
                {isComplete ? "Analysis Complete!" : "Analyzing Your Essay"}
              </h1>

              <p className="text-muted-foreground mb-8">
                {isComplete
                  ? "Your personalized feedback is ready!"
                  : "Our AI is carefully reviewing your essay to provide detailed feedback."}
              </p>
            </div>

            <div className="space-y-6">
              <Progress value={progress} className="h-3" />

              <div className="text-lg font-medium">
                {progress.toFixed(0)}% Complete
              </div>

              {!isComplete && (
                <div className="text-sm text-muted-foreground animate-pulse">
                  {steps[currentStep]}
                </div>
              )}

              <div className="space-y-2 text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      index < currentStep
                        ? "text-green-600"
                        : index === currentStep
                        ? "text-primary font-medium"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : index === currentStep ? (
                      <Clock className="h-4 w-4 animate-pulse" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {isComplete && (
                <div className="pt-4">
                  <Link href="/essay-auditor/results">
                    <Button size="lg" className="px-8">
                      View Your Results
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
              <p>
                Our AI analyzes your essay across multiple dimensions including
                grammar, vocabulary, coherence, and structure.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
