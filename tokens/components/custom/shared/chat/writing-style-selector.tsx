'use client';

import { Check, PenTool01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

export interface WritingStyle {
  id: string;
  name: string;
  description?: string;
  filename?: string; // The markdown filename in brand brain
}

// Writing styles available from brand brain
// These correspond to files in .claude/writing-styles/ (served via /api/claude/)
export const WRITING_STYLES: WritingStyle[] = [
  { id: 'normal', name: 'Normal', description: 'Default writing style' },
  { id: 'learning', name: 'Learning', description: 'Educational and explanatory' },
  { id: 'concise', name: 'Concise', description: 'Brief and to the point' },
  { id: 'explanatory', name: 'Explanatory', description: 'Detailed explanations' },
  { id: 'formal', name: 'Formal', description: 'Professional and formal tone' },
  { id: 'creative', name: 'Creative', description: 'Creative and artistic', filename: 'creative.md' },
  { id: 'long-form', name: 'Long-form', description: 'Long-form content', filename: 'long-form.md' },
  { id: 'short-form', name: 'Short-form', description: 'Short-form content', filename: 'short-form.md' },
  { id: 'strategic', name: 'Strategic', description: 'Strategic communication', filename: 'strategic.md' },
  { id: 'blog', name: 'Blog', description: 'Blog writing style', filename: 'blog.md' },
];

interface WritingStyleSelectorProps {
  currentStyle: WritingStyle | null;
  onSelect: (style: WritingStyle | null) => void;
}

export function WritingStyleSelector({
  currentStyle,
  onSelect,
}: WritingStyleSelectorProps) {
  return (
    <div {...devProps('WritingStyleSelector')} className="py-2 max-h-[96px] overflow-y-auto">
      {WRITING_STYLES.map((style) => {
        const isSelected = currentStyle?.id === style.id;
        const isFileStyle = !!style.filename;
        
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onSelect(style.id === 'normal' ? null : style)}
            className={`
              w-full flex items-center justify-between px-3 py-2
              text-left transition-colors duration-quick
              ${isSelected
                ? 'bg-bg-tertiary text-fg-primary'
                : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
              }
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <PenTool01 className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <div className={`text-sm ${isSelected ? 'text-fg-brand-primary' : ''}`}>
                  {style.name}
                </div>
                {/* Show description only for file-based styles on hover would be nice, but keeping simple */}
              </div>
            </div>
            {isSelected && (
              <Check className="w-4 h-4 text-fg-brand-primary flex-shrink-0 ml-2" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Helper to load a writing style's content from the markdown file
// Uses API route to serve .claude/ files
export async function loadWritingStyleContent(style: WritingStyle): Promise<string | null> {
  if (!style.filename) {
    return null;
  }

  try {
    const response = await fetch(`/api/claude/writing-styles/${style.filename}`);
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch (error) {
    console.error('Error loading writing style:', error);
    return null;
  }
}

