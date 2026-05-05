'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XClose, ClipboardCheck, Zap, Package, AlertCircle, ArrowRight, ArrowLeft, ClipboardCheck as ClipboardPaste, Zap as Wand2, Package as Store } from '@untitledui-pro/icons/line';
// UUI fallback: Wand2 → Zap (no Wand2 equiv), ClipboardPaste → ClipboardCheck, Store → Package
import type { BrandDocumentCategory } from '@/lib/supabase/types';
import { devProps } from '@/lib/utils/dev-props';
import { GuidedInputFlow } from './GuidedInputFlow';
import { MarketplaceCatalog } from './MarketplaceCatalog';

interface CreateBrainContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (category: BrandDocumentCategory, title: string, content: string) => Promise<void>;
}

type ContentMode = 'select' | 'manual' | 'interview' | 'marketplace';

const CATEGORY_OPTIONS: { value: BrandDocumentCategory; label: string }[] = [
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'writing-styles', label: 'Writing Styles' },
  { value: 'skills', label: 'Skills' },
  { value: 'commands', label: 'Commands' },
  { value: 'data', label: 'Data' },
  { value: 'config', label: 'Config' },
];

const PASTE_PLACEHOLDER = `# Document Title

## Overview
Describe the purpose of this document...

## Content
Add your content here using Markdown formatting...`;

const MODE_TITLES: Record<ContentMode, string> = {
  select: 'Add to Brain',
  manual: 'Create Document',
  interview: 'Guided Interview',
  marketplace: 'Marketplace',
};

const MODE_DESCRIPTIONS: Record<ContentMode, string> = {
  select: 'Choose how you want to add content to your knowledge base',
  manual: 'Write or paste markdown content',
  interview: 'Answer questions to generate structured content',
  marketplace: 'Browse and install community skills',
};

export function CreateBrainContentModal({
  isOpen,
  onClose,
  onAddDocument,
}: CreateBrainContentModalProps) {
  const [mode, setMode] = useState<ContentMode>('select');
  const [category, setCategory] = useState<BrandDocumentCategory>('skills');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('select');
      setCategory('skills');
      setTitle('');
      setContent('');
      setError(null);
    }
  }, [isOpen]);

  const handleManualSubmit = useCallback(async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAddDocument(category, title.trim(), content.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, category, onAddDocument, onClose]);

  const handleGuidedComplete = useCallback(async (generatedTitle: string, generatedContent: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onAddDocument(category, generatedTitle, generatedContent);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
    } finally {
      setIsSubmitting(false);
    }
  }, [category, onAddDocument, onClose]);

  const handleBack = useCallback(() => {
    if (mode === 'interview' || mode === 'manual') {
      // Go back to mode select, keep category
      setMode('select');
    } else {
      setMode('select');
    }
    setError(null);
  }, [mode]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          {...devProps('CreateBrainContentModal')}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full ${mode === 'marketplace' ? 'max-w-4xl' : mode === 'interview' ? 'max-w-3xl' : 'max-w-2xl'} max-h-[85vh] flex flex-col rounded-2xl bg-bg-primary border border-border-primary shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
            <div className="flex items-center gap-3">
              {mode !== 'select' && (
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded-lg hover:bg-bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-fg-tertiary" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-display font-semibold text-fg-primary">
                  {MODE_TITLES[mode]}
                </h2>
                <p className="text-sm text-fg-tertiary">
                  {MODE_DESCRIPTIONS[mode]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <XClose className="w-5 h-5 text-fg-tertiary" />
            </button>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 py-3 bg-bg-error-subtle border-b border-border-error flex items-center gap-2 text-sm text-fg-error-primary"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {mode === 'select' && (
              <ModeSelector
                onSelectManual={() => setMode('manual')}
                onSelectInterview={() => setMode('interview')}
                onSelectMarketplace={() => setMode('marketplace')}
              />
            )}

            {mode === 'manual' && (
              <ManualMode
                title={title}
                content={content}
                category={category}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onCategoryChange={setCategory}
                onSubmit={handleManualSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
              />
            )}

            {mode === 'interview' && (
              <InterviewMode
                category={category}
                onCategoryChange={setCategory}
                onComplete={handleGuidedComplete}
                onCancel={handleBack}
                isSubmitting={isSubmitting}
              />
            )}

            {mode === 'marketplace' && (
              <MarketplaceCatalog onClose={onClose} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Mode Selector ──────────────────────────────────────────────────────────

interface ModeSelectorProps {
  onSelectManual: () => void;
  onSelectInterview: () => void;
  onSelectMarketplace: () => void;
}

function ModeSelector({ onSelectManual, onSelectInterview, onSelectMarketplace }: ModeSelectorProps) {
  const modes = [
    {
      id: 'manual',
      title: 'Manual',
      description: 'Create a markdown document from scratch or paste existing content.',
      hint: 'Fastest option',
      icon: ClipboardPaste,
      onClick: onSelectManual,
    },
    {
      id: 'interview',
      title: 'Interview',
      description: 'Answer a few questions and we\'ll generate structured, well-formatted content.',
      hint: 'AI-assisted',
      icon: Wand2,
      onClick: onSelectInterview,
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Browse and install skills from the community catalog.',
      hint: 'Coming soon',
      icon: Store,
      onClick: onSelectMarketplace,
    },
  ];

  return (
    <div {...devProps('ModeSelector')} className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={m.onClick}
            className="group relative p-5 rounded-xl bg-bg-secondary border border-border-primary hover:border-border-brand hover:bg-secondary-hover transition-all text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-bg-tertiary border border-border-primary">
                <m.icon className="w-5 h-5 text-fg-tertiary" />
              </div>
              <ArrowRight className="w-4 h-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-base font-display font-semibold text-fg-primary group-hover:text-fg-brand-primary transition-colors mb-1.5">
              {m.title}
            </h3>
            <p className="text-xs text-fg-tertiary mb-2">
              {m.description}
            </p>
            <span className="text-[10px] text-fg-quaternary">
              {m.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Manual Mode ────────────────────────────────────────────────────────────

interface ManualModeProps {
  title: string;
  content: string;
  category: BrandDocumentCategory;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: BrandDocumentCategory) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function ManualMode({
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: ManualModeProps) {
  return (
    <div {...devProps('ManualMode')} className="p-6 space-y-4">
      {/* Category Selector */}
      <div>
        <label htmlFor="create-category" className="block text-sm font-medium text-fg-secondary mb-2">
          Folder
        </label>
        <select
          id="create-category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as BrandDocumentCategory)}
          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary text-sm"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="create-title" className="block text-sm font-medium text-fg-secondary mb-2">
          Title
        </label>
        <input
          id="create-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Social Media Voice Guide"
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary placeholder:text-fg-quaternary"
        />
      </div>

      {/* Content Textarea */}
      <div>
        <label htmlFor="create-content" className="block text-sm font-medium text-fg-secondary mb-2">
          Content (Markdown)
        </label>
        <textarea
          id="create-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={PASTE_PLACEHOLDER}
          rows={12}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary placeholder:text-fg-quaternary font-mono text-sm resize-none custom-scrollbar"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg text-fg-secondary hover:bg-primary_hover transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-bg-brand-solid text-fg-white hover:bg-bg-brand-solid-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⟳</span>
              Creating...
            </>
          ) : (
            'Create'
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Interview Mode ─────────────────────────────────────────────────────────

interface InterviewModeProps {
  category: BrandDocumentCategory;
  onCategoryChange: (category: BrandDocumentCategory) => void;
  onComplete: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function InterviewMode({
  category,
  onCategoryChange,
  onComplete,
  onCancel,
  isSubmitting,
}: InterviewModeProps) {
  const [categorySelected, setCategorySelected] = useState(false);

  if (!categorySelected) {
    return (
      <div {...devProps('InterviewMode')} className="p-6 space-y-4">
        <p className="text-sm text-fg-tertiary">
          First, choose what type of content you want to create. The interview questions will be tailored to your selection.
        </p>

        <div>
          <label htmlFor="interview-category" className="block text-sm font-medium text-fg-secondary mb-2">
            Content Type
          </label>
          <select
            id="interview-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as BrandDocumentCategory)}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-primary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-fg-primary text-sm"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-fg-secondary hover:bg-primary_hover transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={() => setCategorySelected(true)}
            className="px-5 py-2.5 rounded-lg bg-bg-brand-solid text-fg-white hover:bg-bg-brand-solid-hover transition-colors font-medium"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...devProps('InterviewFlow')}>
      <GuidedInputFlow
        category={category}
        onComplete={onComplete}
        onCancel={() => setCategorySelected(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default CreateBrainContentModal;
