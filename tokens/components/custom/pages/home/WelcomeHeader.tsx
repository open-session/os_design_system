'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { useAuth } from '@/lib/auth';
import { getFirstName } from '@/lib/utils/get-first-name';

// Rotating questions for the second line
const rotatingQuestions = [
  "How can I help you today?",
  "What are we building?",
  "What are we making?",
  "What's the plan?",
  "What are we working on?",
  "Where should we start?",
];

export function WelcomeHeader() {
  const { profile, user, isLoading } = useAuth();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Wait until after hydration to render user-specific text
  useEffect(() => {
    setMounted(true);
  }, []);

  // Defer name resolution until client-side mount to avoid hydration mismatch
  const firstName = !mounted || isLoading
    ? null
    : (getFirstName(profile?.displayName) || user?.email?.split('@')[0] || 'user');

  // Rotate questions every 5 seconds — pausable on hover/focus (WCAG 2.2.2)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % rotatingQuestions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  const currentQuestion = rotatingQuestions[questionIndex];

  return (
    <div {...devProps('WelcomeHeader')} className="w-full">
      <div className="space-y-2">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          style={{ color: 'var(--color-brand-500)' }}
        >
          Hello{firstName ? `, ${firstName}` : ''}
        </h1>
        <div
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          onFocus={handlePause}
          onBlur={handleResume}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuestion}
              className="text-base sm:text-lg lg:text-xl text-fg-tertiary font-medium"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentQuestion}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
