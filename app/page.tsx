"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Globe,
  Check,
  AlertCircle,
  Sparkles,
  Brain,
  Languages,
} from "lucide-react";

interface SummaryResult {
  id: number;
  blog_url: string;
  title: string;
  summary_english: string;
  summary_urdu: string;
  created_at: string;
  word_count: number;
  author?: string;
}

interface ProcessingStatus {
  step: string;
  status: "pending" | "processing" | "completed" | "error";
  message?: string;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStatus[]>(
    []
  );
  const [showUrduTranslation, setShowUrduTranslation] = useState(false);

  const initializeSteps = (): ProcessingStatus[] => [
    { step: "Scraping blog content", status: "pending" },
    { step: "Generating summary", status: "pending" },
    { step: "Translating to Urdu", status: "pending" },
  ];

  const updateStep = (
    stepIndex: number,
    status: ProcessingStatus["status"],
    message?: string
  ) => {
    setProcessingSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex ? { ...step, status, message } : step
      )
    );
  };

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a blog URL");
      return;
    }
    if (!validateUrl(url)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      return;
    }

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProcessingSteps(initializeSteps());

    try {
      updateStep(0, "processing", "Extracting content from blog...");

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      updateStep(0, "completed", "Content extracted successfully");
      updateStep(1, "processing", "Generating summary...");
      updateStep(2, "processing", "Translating to Urdu...");

      const data = await response.json();
      updateStep(1, "completed", "Summary generated");
      updateStep(2, "completed", "Translation completed");

      setResult(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      const currentStepIndex = processingSteps.findIndex(
        (step) => step.status === "processing"
      );
      if (currentStepIndex !== -1) {
        updateStep(currentStepIndex, "error", errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (status: ProcessingStatus["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin text-fuchsia-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-800 via-fuchsia-900 to-purple-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent pb-6"
        >
          AI Blog Summarizer + Translator 📝
        </motion.h1>

        {/* Input Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 border border-rose-500 shadow-lg backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-300">
                <Globe className="w-5 h-5" />
                Enter Blog URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-white/80 text-gray-900 placeholder:text-pink-200-400 border border-fuchsia-400"
                    disabled={isProcessing}
                  />
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="text-red-400 text-sm flex items-center gap-2 bg-red-900/30 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Processing Steps */}
        {isProcessing && (
          <Card className="bg-white/10 border border-fuchsia-500 shadow-md backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-fuchsia-300">
                Processing Status
              </CardTitle>
              {/* Removed the "Watch the AI..." line here */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/10 p-4 rounded-lg border border-fuchsia-700"
                  >
                    <div className="relative">{getStepIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{step.step}</div>
                      {step.message && (
                        <div className="text-sm text-fuchsia-200">
                          {step.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Output */}
        {result && (
          <Card className="bg-white/10 border border-rose-500 shadow-md backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-rose-300 flex gap-2 items-center">
                <Brain className="w-5 h-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-4">
              <p className="whitespace-pre-wrap">{result.summary_english}</p>
              <div className="border-t border-fuchsia-500 pt-4">
                <button
                  className="flex gap-2 items-center text-fuchsia-300 hover:text-fuchsia-200 text-sm"
                  onClick={() => setShowUrduTranslation(!showUrduTranslation)}
                >
                  <Languages className="w-4 h-4" />
                  {showUrduTranslation
                    ? "Hide Urdu Translation"
                    : "View Urdu Translation"}
                </button>
                {showUrduTranslation && (
                  <p
                    className="text-right text-white whitespace-pre-wrap pt-2"
                    dir="rtl"
                    lang="ur"
                  >
                    {result.summary_urdu}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
