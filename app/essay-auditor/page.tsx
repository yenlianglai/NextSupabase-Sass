"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Target, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EssayAuditorHome() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Comprehensive Analysis",
      description:
        "Get detailed feedback on grammar, vocabulary, coherence, and structure with AI-powered analysis.",
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: "AI-Powered Feedback",
      description:
        "Advanced AI technology provides personalized suggestions to improve your writing skills.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Exam-Specific Guidance",
      description:
        "Tailored feedback for TOEFL, IELTS, and other standardized tests.",
    },
  ];

  const stats = [
    { number: "1M+", label: "Essays Analyzed" },
    { number: "100K+", label: "Active Users" },
    { number: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="h-full bg-background text-foreground">
      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="text-center py-20 md:py-32">
          <Badge variant="outline" className="mb-4">
            AI-Powered Essay Analysis
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Perfect Your Writing
            <br />
            <span className="text-primary">with AI Feedback</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Get instant, detailed feedback on your essays with our advanced AI
            technology. Improve your writing for TOEFL, IELTS, and other
            standardized tests.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/essay-auditor/exam-hall">
              <Button size="lg" className="px-8 py-4 h-14 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/essay-auditor/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 h-14 text-lg"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="border-t-2 border-primary pt-4">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Choose <span className="text-primary">Essay Auditor</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our advanced AI technology provides comprehensive feedback to help
              you improve your writing skills.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center bg-card p-6">
                  <div className="mb-4 inline-block p-4 bg-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="bg-card border border-border rounded-lg p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Improve Your Writing?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start analyzing your essays today and get detailed feedback to
              enhance your writing skills.
            </p>
            <Link href="/essay-auditor/submit">
              <Button size="lg" className="px-8 py-4 h-14 text-lg">
                Start Writing
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
