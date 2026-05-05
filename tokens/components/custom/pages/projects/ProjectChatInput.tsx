'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Attachment01,
  Image01,
  Microphone01,
  Send01,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { useChatContext } from '@/lib/chat-context';
import { ModelSelector } from '@/components/custom/shared/selectors/model-selector';
import { DataSourcesDropdown } from '@/components/custom/shared/menus/data-sources-dropdown';
import { ActiveSettingsIndicators } from '@/components/custom/shared/chat/active-settings-indicators';
import type { ModelId } from '@/lib/ai/providers';
import type { Project } from '@/lib/supabase/projects-service';

interface ProjectChatInputProps {
  project: Project;
}

export function ProjectChatInput({ project }: ProjectChatInputProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>('auto');
  
  const {
    setCurrentProject,
    triggerChatReset,
    currentWritingStyle,
    setCurrentWritingStyle,
    webSearchEnabled,
    setWebSearchEnabled,
    brandSearchEnabled,
    setBrandSearchEnabled,
  } = useChatContext();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    // Set the current project in context
    setCurrentProject(project);
    
    // Reset any existing chat
    triggerChatReset();
    
    // Navigate to home with the query
    router.push(`/?q=${encodeURIComponent(input.trim())}`);
  }, [input, project, setCurrentProject, triggerChatReset, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <form {...devProps('ProjectChatInput')} onSubmit={handleSubmit} className="w-full">
      <div
        className={`
          relative rounded-xl
          border transition-all duration-200
          bg-bg-secondary shadow-sm
          ${isFocused
            ? 'border-border-brand-solid shadow-lg shadow-bg-brand-solid/20 ring-2 ring-border-brand-solid/30'
            : 'border-border-primary hover:border-fg-tertiary'
          }
        `}
      >
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Start a conversation..."
            className="
              w-full px-4 py-4
              bg-transparent
              text-fg-primary
              placeholder:text-fg-tertiary
              resize-none
              focus:outline-hidden
              min-h-[60px] max-h-[200px]
            "
            rows={1}
            aria-label="Chat input"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-border-primary gap-2 sm:gap-4">
          {/* Left side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Active settings indicators */}
            <ActiveSettingsIndicators
              currentProject={project}
              currentWritingStyle={currentWritingStyle}
              onRemoveProject={() => {}} // Can't remove project when in project view
              onRemoveWritingStyle={() => setCurrentWritingStyle(null)}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            <div className="hidden sm:block w-px h-5 bg-border-primary" />

            <DataSourcesDropdown
              webEnabled={webSearchEnabled}
              brandEnabled={brandSearchEnabled}
              onWebToggle={setWebSearchEnabled}
              onBrandToggle={setBrandSearchEnabled}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="
                p-2 rounded-lg
                transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-bg-brand-solid
                hover:bg-bg-brand-solid/90
                text-white
              "
            >
              <Send01 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-fg-quaternary mt-2 text-center">
        Press Enter to send • Shift+Enter for new line
      </p>
    </form>
  );
}

