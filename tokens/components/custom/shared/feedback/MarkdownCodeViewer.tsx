'use client';

import React, { useState, useCallback } from 'react';
import {
  Bold01,
  Check,
  Code01,
  Copy01,
  Download01,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface MarkdownCodeViewerProps {
  filename: string;
  content: string;
  className?: string;
  maxLines?: number;
}

export function MarkdownCodeViewer({ filename, content, className = '', maxLines = 22 }: MarkdownCodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const lines = content.split('\n');
  // Calculate max height based on line height (approx 24px per line)
  const maxHeight = maxLines * 24;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, filename]);

  return (
    <div {...devProps('MarkdownCodeViewer')} className={`rounded-xl overflow-hidden bg-bg-secondary border border-border-primary ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-border-primary">
        <span className="text-sm font-sans text-fg-tertiary">
          {filename}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors group"
            title="Download"
          >
            <Download01 className="w-4 h-4 text-fg-tertiary group-hover:text-fg-primary transition-colors" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors group"
            title={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-fg-success-primary" />
            ) : (
              <Copy01 className="w-4 h-4 text-fg-tertiary group-hover:text-fg-primary transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div 
        className="overflow-auto custom-scrollbar"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <div className="p-4 font-sans text-sm">
          {lines.map((line, index) => (
            <div key={index} className="flex leading-6">
              <span className="w-10 flex-shrink-0 text-right pr-4 text-fg-quaternary-subtle select-none">
                {index + 1}
              </span>
              <span className="text-fg-primary whitespace-pre-wrap break-words">
                {renderMarkdownLine(line)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple syntax highlighting for markdown
function renderMarkdownLine(line: string): React.ReactNode {
  // Headers
  if (line.startsWith('# ')) {
    return <span className="text-fg-brand-primary font-bold">{line}</span>;
  }
  if (line.startsWith('## ')) {
    return <span className="text-fg-brand-primary font-semibold">{line}</span>;
  }
  if (line.startsWith('### ') || line.startsWith('#### ')) {
    return <span className="text-fg-brand-primary">{line}</span>;
  }
  
  // Code blocks
  if (line.startsWith('```')) {
    return <span className="text-fg-success-primary">{line}</span>;
  }
  
  // List items
  if (line.match(/^[-*]\s/)) {
    return <span className="text-fg-primary">{line}</span>;
  }
  
  // Numbered lists
  if (line.match(/^\d+\.\s/)) {
    return <span className="text-fg-primary">{line}</span>;
  }
  
  // Table rows
  if (line.includes('|')) {
    return <span className="text-blue-400 dark:text-blue-300">{line}</span>;
  }
  
  // Bold text - highlight **text**
  if (line.includes('**')) {
    return <span className="text-fg-primary">{line}</span>;
  }
  
  // Links
  if (line.includes('[') && line.includes('](')) {
    return <span className="text-cyan-500 dark:text-cyan-400">{line}</span>;
  }
  
  // Comments/blockquotes
  if (line.startsWith('>')) {
    return <span className="text-fg-tertiary italic">{line}</span>;
  }
  
  // Directory structure
  if (line.includes('├──') || line.includes('└──') || line.includes('│')) {
    return <span className="text-yellow-600 dark:text-yellow-300">{line}</span>;
  }
  
  return line || ' ';
}
