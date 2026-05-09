'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Code01,
  Edit01,
  Loading01,
  MagicWand01,
  RefreshCw01,
  Settings01,
  Type01,
  Zap,
} from '@untitledui-pro/icons/line';
// UUI fallback: MagicWand01 → Zap
import type { BrandDocumentCategory } from '@/lib/supabase/types';
import { devProps } from '@/lib/utils/dev-props';
import { getCsrfHeaders } from '@/hooks/useCsrf';

interface GuidedInputFlowProps {
  category: BrandDocumentCategory;
  onComplete: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface InterviewQuestion {
  id: string;
  question: string;
  placeholder: string;
  multiline?: boolean;
}

type FlowStep = 'questions' | 'generating' | 'review';

// Questions for each category (5 questions each for a streamlined experience)
const INTERVIEW_QUESTIONS: Record<BrandDocumentCategory, InterviewQuestion[]> = {
  'brand-identity': [
    {
      id: 'name',
      question: "What is your brand name?",
      placeholder: "e.g., OPEN SESSION",
    },
    {
      id: 'mission',
      question: "What is your brand's mission or purpose?",
      placeholder: "Why does your brand exist? What problem do you solve?",
      multiline: true,
    },
    {
      id: 'values',
      question: "What are your core values? (3-5 principles)",
      placeholder: "List the principles that guide your brand...",
      multiline: true,
    },
    {
      id: 'audience',
      question: "Who is your target audience?",
      placeholder: "Describe your ideal customer or user...",
      multiline: true,
    },
    {
      id: 'personality_emotions',
      question: "What personality and emotions define your brand?",
      placeholder: "e.g., Friendly & innovative, makes people feel inspired and confident...",
      multiline: true,
    },
  ],
  'writing-styles': [
    {
      id: 'platform',
      question: "What platform or context is this writing style for?",
      placeholder: "e.g., blog posts, social media, email newsletters, documentation...",
    },
    {
      id: 'audience',
      question: "Who is your target reader?",
      placeholder: "Describe who will be reading this content...",
      multiline: true,
    },
    {
      id: 'tone',
      question: "What tone and voice should this writing have?",
      placeholder: "e.g., casual but informed, use 'we' for team voice, professional...",
      multiline: true,
    },
    {
      id: 'guidelines',
      question: "Are there words, phrases, or CTAs to include or avoid?",
      placeholder: "List any specific language preferences, restrictions, or calls-to-action...",
      multiline: true,
    },
    {
      id: 'format',
      question: "What format and length should the content follow?",
      placeholder: "e.g., 2-5 minute reads, bullet points preferred, include headers...",
      multiline: true,
    },
  ],
  'skills': [
    {
      id: 'name',
      question: "What is the name of this skill/capability?",
      placeholder: "e.g., Brand Guidelines Generator, Code Reviewer...",
    },
    {
      id: 'description',
      question: "What does this skill enable the AI to do?",
      placeholder: "Describe the capability in detail...",
      multiline: true,
    },
    {
      id: 'context',
      question: "When and how should this skill be used?",
      placeholder: "What triggers this skill? What inputs or information does it need?",
      multiline: true,
    },
    {
      id: 'outputs',
      question: "What outputs or artifacts does this skill produce?",
      placeholder: "Describe the expected results...",
      multiline: true,
    },
    {
      id: 'example',
      question: "Can you provide an example use case?",
      placeholder: "Describe a practical demonstration or scenario...",
      multiline: true,
    },
  ],
  'commands': [
    {
      id: 'name',
      question: "What is the command name?",
      placeholder: "e.g., /news-update, /content-ideas...",
    },
    {
      id: 'description',
      question: "What does this command do?",
      placeholder: "Describe the command's purpose...",
      multiline: true,
    },
    {
      id: 'args',
      question: "What arguments or inputs does it accept?",
      placeholder: "List any required or optional parameters...",
      multiline: true,
    },
    {
      id: 'output',
      question: "What output does it produce?",
      placeholder: "Describe the expected results...",
      multiline: true,
    },
  ],
  'data': [
    {
      id: 'name',
      question: "What is this data called?",
      placeholder: "e.g., News Sources, Partner List...",
    },
    {
      id: 'purpose',
      question: "What is this data used for?",
      placeholder: "Describe how this data is used...",
      multiline: true,
    },
    {
      id: 'format',
      question: "How should this data be formatted?",
      placeholder: "Describe the structure or format...",
      multiline: true,
    },
  ],
  'config': [
    {
      id: 'name',
      question: "What is this configuration for?",
      placeholder: "e.g., MCP Instructions, System Settings...",
    },
    {
      id: 'settings',
      question: "What settings or options does it define?",
      placeholder: "List the configuration options...",
      multiline: true,
    },
    {
      id: 'notes',
      question: "Are there any dependencies or requirements?",
      placeholder: "Any additional notes...",
      multiline: true,
    },
  ],
};

export function GuidedInputFlow({
  category,
  onComplete,
  onCancel,
  isSubmitting = false,
}: GuidedInputFlowProps) {
  const questions = INTERVIEW_QUESTIONS[category];
  const [currentStep, setCurrentStep] = useState(0);
  const [flowStep, setFlowStep] = useState<FlowStep>('questions');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;

  const handleAnswerChange = useCallback((value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Generate content
      generateContent();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastQuestion, answers]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const generateContent = async () => {
    setFlowStep('generating');
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/brain/guided-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
        credentials: 'include',
        body: JSON.stringify({
          category,
          answers: questions.map((q, i) => answers[q.id] || ''),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedTitle(data.suggestedTitle || `New ${category} Document`);
      setGeneratedContent(data.content);
      setFlowStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      setFlowStep('questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = useCallback(() => {
    generateContent();
  }, [answers, category, questions]);

  const handleComplete = useCallback(async () => {
    await onComplete(generatedTitle, generatedContent);
  }, [generatedTitle, generatedContent, onComplete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !currentQuestion.multiline) {
      e.preventDefault();
      handleNext();
    }
  }, [handleNext, currentQuestion]);

  return (
    <div {...devProps('GuidedInputFlow')} className="flex flex-col h-full">
      {flowStep === 'questions' && (
        <>
          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between text-xs text-fg-tertiary mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-bg-brand-solid rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-display font-semibold text-fg-primary">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.multiline ? (
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary placeholder:text-fg-quaternary resize-none custom-scrollbar"
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary placeholder:text-fg-quaternary"
                    autoFocus
                  />
                )}

                <p className="text-xs text-fg-quaternary">
                  {currentQuestion.multiline 
                    ? 'Press Tab or click Next to continue'
                    : 'Press Enter or click Next to continue'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary">
            <button
              onClick={currentStep > 0 ? handlePrev : onCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-fg-secondary hover:bg-bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep > 0 ? 'Previous' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2">
              {/* Question dots */}
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep
                      ? 'bg-fg-brand-primary'
                      : i < currentStep
                      ? 'bg-fg-tertiary'
                      : 'bg-bg-tertiary'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bg-brand-solid text-fg-white hover:bg-bg-brand-solid-hover transition-colors font-medium"
            >
              {isLastQuestion ? (
                <>
                  <Zap className="w-4 h-4" />
                  Generate
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </>
      )}

      {flowStep === 'generating' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-bg-brand-subtle flex items-center justify-center">
              <Loading01 className="w-8 h-8 text-fg-brand-primary animate-spin" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border border-border-brand"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <h3 className="mt-6 text-lg font-display font-semibold text-fg-primary">
            Generating Content
          </h3>
          <p className="mt-2 text-sm text-fg-tertiary text-center max-w-sm">
            AI is synthesizing your answers into a structured document...
          </p>
        </div>
      )}

      {flowStep === 'review' && (
        <>
          {/* Review Header */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 text-sm text-fg-success-primary">
              <Check className="w-4 h-4" />
              Content generated successfully
            </div>
          </div>

          {/* Title */}
          <div className="px-6 py-2">
            <label className="block text-sm font-medium text-fg-secondary mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={generatedTitle}
              onChange={(e) => setGeneratedTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary"
            />
          </div>

          {/* Generated Content */}
          <div className="flex-1 px-6 py-2 min-h-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-fg-secondary">
                Generated Content
              </label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-fg-tertiary hover:text-fg-secondary hover:bg-bg-secondary transition-colors"
              >
                <Edit01 className="w-3.5 h-3.5" />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
            </div>

            <div className="h-64 rounded-xl border border-border-primary overflow-hidden">
              {isEditing ? (
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full h-full p-4 bg-bg-secondary text-fg-primary font-mono text-sm resize-none outline-hidden custom-scrollbar"
                />
              ) : (
                <div className="w-full h-full p-4 bg-bg-secondary overflow-y-auto custom-scrollbar">
                  <pre className="text-sm font-mono text-fg-secondary whitespace-pre-wrap">
                    {generatedContent}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-fg-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw01 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>

            <button
              onClick={handleComplete}
              disabled={isSubmitting || !generatedTitle.trim() || !generatedContent.trim()}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-bg-brand-solid text-fg-white hover:bg-bg-brand-solid-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loading01 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Add Document
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-4 p-3 rounded-lg bg-bg-error-subtle text-fg-error-primary text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default GuidedInputFlow;

