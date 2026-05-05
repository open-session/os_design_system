'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Microphone01 as Mic, Send01 as Send } from '@untitledui-pro/icons/line';
import { ModelId } from '@/lib/ai/providers';
import { useAttachments } from '@/hooks/useAttachments';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { AttachmentPreview, DragOverlay } from './AttachmentPreview';
import { PlusMenu } from '@/components/custom/shared/menus/plus-menu';
import { DataSourcesDropdown } from '@/components/custom/shared/menus/data-sources-dropdown';
import { ModelSelector } from '@/components/custom/shared/selectors/model-selector';
import { ActiveSettingsIndicators } from '@/components/custom/shared/chat/active-settings-indicators';
import { useChatContext } from '@/lib/chat-context';
import { devProps } from '@/lib/utils/dev-props';

export interface FollowUpAttachment {
  type: 'image';
  data: string;
  mimeType: string;
}

interface FollowUpInputProps {
  onSubmit: (query: string, attachments?: FollowUpAttachment[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModel?: ModelId;
  onModelChange?: (model: ModelId) => void;
}

export function FollowUpInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask a follow-up',
  selectedModel = 'auto',
  onModelChange,
}: FollowUpInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get context values for projects, writing style, and data connectors
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    currentWritingStyle,
    setCurrentWritingStyle,
    // Data connectors (from context for persistence across conversation)
    webSearchEnabled,
    setWebSearchEnabled,
    brandSearchEnabled,
    setBrandSearchEnabled,
  } = useChatContext();

  // Handle project creation
  const handleCreateProject = useCallback(async (name: string) => {
    await createProject(name);
  }, [createProject]);

  // Voice recognition
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
  } = useVoiceRecognition();

  // Attachment handling
  const {
    attachments,
    isDragging,
    error: attachmentError,
    addFiles,
    removeAttachment,
    clearAttachments,
    clearError: clearAttachmentError,
    handlePaste,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    fileInputRef,
    openFilePicker,
  } = useAttachments();

  // Track previous transcript to correctly replace old value with new
  const prevTranscriptRef = useRef('');
  
  // Update input with live transcript
  useEffect(() => {
    if (isListening && transcript) {
      // IMPORTANT: Capture the previous transcript BEFORE setInput (refs are sync, setState is async)
      const prevTranscript = prevTranscriptRef.current;
      // Update ref immediately for the next effect run
      prevTranscriptRef.current = transcript;
      
      setInput((prev) => {
        // Remove the PREVIOUS transcript from input
        let base = prev;
        if (prevTranscript && prev.endsWith(prevTranscript)) {
          base = prev.slice(0, -prevTranscript.length).trim();
        }
        // Append the NEW transcript
        const result = base + (base ? ' ' : '') + transcript;
        return result;
      });
    } else if (!isListening) {
      // Reset when done listening
      prevTranscriptRef.current = '';
    }
  }, [transcript, isListening]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow submission with just attachments (no text required)
    if (!input.trim() && attachments.length === 0) return;
    if (isLoading) return;

    const query = input.trim();
    const currentAttachments = attachments.length > 0
      ? attachments.map(att => ({
          type: 'image' as const,
          data: att.preview,
          mimeType: att.file.type,
        }))
      : undefined;

    setInput('');
    clearAttachments();
    onSubmit(query, currentAttachments);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  return (
    <div {...devProps('FollowUpInput')} className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              addFiles(e.target.files);
              e.target.value = ''; // Reset to allow same file selection
            }
          }}
          className="hidden"
        />

        <div
          className={`
            relative rounded-xl
            border transition-all duration-200
            bg-bg-secondary shadow-sm
            ${
              isDragging || isFocused || isListening
                ? 'border-border-brand-solid shadow-lg shadow-bg-brand-solid/20 ring-2 ring-border-brand-solid/30'
                : 'border-border-primary hover:border-fg-tertiary'
            }
          `}
          onDragOver={handleDragOver}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          <DragOverlay isDragging={isDragging} />

          {/* Attachment preview */}
          <AttachmentPreview
            attachments={attachments}
            onRemove={removeAttachment}
            error={attachmentError}
            onClearError={clearAttachmentError}
            compact
          />

          {/* Input area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onPaste={handlePaste}
              placeholder={attachments.length > 0 ? "Add a message or send with images..." : placeholder}
              className="w-full px-4 py-4 bg-transparent text-fg-primary placeholder:text-fg-tertiary resize-none focus:outline-hidden min-h-[60px] max-h-[300px]"
              rows={1}
              aria-label="Follow-up input"
              disabled={isLoading}
            />
          </div>

          {/* Toolbar - matching homepage layout */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-border-primary gap-2 sm:gap-4">
            {/* Left side - Plus menu, Active settings indicators */}
            <div className="flex items-center gap-1 sm:gap-2">
              <PlusMenu
                onAddFiles={openFilePicker}
                onProjectSelect={setCurrentProject}
                onStyleSelect={setCurrentWritingStyle}
                currentProject={currentProject}
                currentStyle={currentWritingStyle}
                projects={projects}
                onCreateProject={handleCreateProject}
                disabled={isLoading}
              />

              {/* Active settings indicators - shown as removable chips */}
              <ActiveSettingsIndicators
                currentProject={currentProject}
                currentWritingStyle={currentWritingStyle}
                onRemoveProject={() => setCurrentProject(null)}
                onRemoveWritingStyle={() => setCurrentWritingStyle(null)}
                disabled={isLoading}
              />
            </div>

            {/* Right side - action buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Model Selector */}
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={onModelChange || (() => {})}
                disabled={isLoading}
              />

              <div className="hidden sm:block w-px h-5 bg-border-primary" />

              {/* Data sources dropdown */}
              <DataSourcesDropdown
                webEnabled={webSearchEnabled}
                brandEnabled={brandSearchEnabled}
                onWebToggle={setWebSearchEnabled}
                onBrandToggle={setBrandSearchEnabled}
                disabled={isLoading}
              />

              {/* Mic button with animation */}
              <div className="relative">
                {/* Pulsing rings when recording */}
                {isListening && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-bg-brand-solid/30"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.8, 2.2],
                        opacity: [0.6, 0.3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-bg-brand-solid/20"
                      initial={{ scale: 1, opacity: 0.4 }}
                      animate={{
                        scale: [1, 1.5, 1.8],
                        opacity: [0.4, 0.2, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.3,
                      }}
                    />
                  </>
                )}
                <motion.button
                  type="button"
                  onClick={handleMicClick}
                  className={`relative p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-bg-brand-solid text-white'
                      : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-primary'
                  }`}
                  aria-label="Voice input"
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                  whileTap={{ scale: 0.92 }}
                  animate={isListening ? {
                    scale: [1, 1.05, 1],
                  } : { scale: 1 }}
                  transition={isListening ? {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  } : { duration: 0.15 }}
                >
                  <motion.div
                    animate={isListening ? { rotate: [0, -8, 8, -8, 0] } : { rotate: 0 }}
                    transition={isListening ? {
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                    } : { duration: 0.15 }}
                  >
                    <Mic className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                {voiceError && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-fg-error-primary whitespace-nowrap bg-bg-secondary px-2 py-1 rounded"
                  >
                    {voiceError}
                  </motion.span>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                className={`p-2 rounded-lg transition-all ${
                  (input.trim() || attachments.length > 0) && !isLoading
                    ? 'bg-bg-brand-solid text-white hover:bg-bg-brand-solid/90'
                    : 'text-fg-tertiary/50 cursor-not-allowed'
                }`}
                aria-label="Send message"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
