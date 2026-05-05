'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DOMPurify from 'isomorphic-dompurify';
import { devProps } from '@/lib/utils/dev-props';
import { Code01 as Code, File01 as FileText, Image01 as ImageIcon, Download01, Copy01, Check, Maximize02 as Maximize2, Minimize02 as Minimize2, Edit03 as Edit3, Eye, Play, XClose } from '@untitledui-pro/icons/line';

// Configure DOMPurify to allow safe SVG and styling attributes
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // Text elements
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'em', 'b', 'i', 'u', 'br', 'hr',
    // List elements
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Table elements
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Links (with restrictions)
    'a',
    // Code elements
    'pre', 'code', 'blockquote',
    // SVG elements (for diagrams)
    'svg', 'g', 'path', 'line', 'rect', 'circle', 'ellipse', 'polygon', 'polyline',
    'text', 'tspan', 'defs', 'use', 'clipPath', 'mask', 'pattern',
    'linearGradient', 'radialGradient', 'stop', 'foreignObject',
    // Other
    'img', 'figure', 'figcaption',
  ],
  ALLOWED_ATTR: [
    // Global attributes
    'class', 'id', 'style', 'title',
    // Link attributes
    'href', 'target', 'rel',
    // Image attributes
    'src', 'alt', 'width', 'height',
    // SVG attributes
    'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
    'viewBox', 'xmlns', 'transform', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
    'cx', 'cy', 'r', 'rx', 'ry', 'points', 'opacity', 'fill-opacity',
    'stroke-opacity', 'font-size', 'font-family', 'text-anchor',
    'dominant-baseline', 'clip-path', 'mask', 'gradientUnits',
    'offset', 'stop-color', 'stop-opacity',
    // Table attributes
    'colspan', 'rowspan', 'scope',
  ],
  // Remove scripts and event handlers
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  // Allow data URIs for images only from safe sources
  ALLOW_DATA_ATTR: false,
};

type ArtifactType = 'code' | 'diagram' | 'document' | 'chart' | 'html' | 'svg' | 'markdown' | 'json' | 'csv';

interface ArtifactRendererProps {
  /** Unique identifier for the artifact */
  id?: string;
  /** Type of artifact */
  type: ArtifactType;
  /** Title for the artifact */
  title?: string;
  /** The content to render */
  content: string;
  /** Programming language (for code artifacts) */
  language?: string;
  /** Whether the artifact can be edited */
  editable?: boolean;
  /** Whether to show in fullscreen mode */
  fullscreen?: boolean;
  /** Callback when artifact is edited */
  onEdit?: (newContent: string) => void;
  /** Callback when artifact is downloaded */
  onDownload?: () => void;
}

// Language to file extension mapping
const languageExtensions: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  html: 'html',
  css: 'css',
  json: 'json',
  markdown: 'md',
  mermaid: 'mmd',
  svg: 'svg',
  csv: 'csv',
};

// Type to icon mapping
const typeIcons: Record<ArtifactType, React.ComponentType<{ className?: string }>> = {
  code: Code,
  diagram: ImageIcon,
  document: FileText,
  chart: ImageIcon,
  html: Code,
  svg: ImageIcon,
  markdown: FileText,
  json: Code,
  csv: FileText,
};

/**
 * ArtifactRenderer Component
 * 
 * Renders different types of artifacts with preview, editing, and download capabilities.
 */
export function ArtifactRenderer({
  id,
  type,
  title,
  content,
  language,
  editable = false,
  fullscreen: initialFullscreen = false,
  onEdit,
  onDownload,
}: ArtifactRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [showPreview, setShowPreview] = useState(type === 'html' || type === 'svg');

  const Icon = typeIcons[type] || Code;
  const displayTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Artifact`;

  // Get file extension for download
  const fileExtension = useMemo(() => {
    if (language && languageExtensions[language]) {
      return languageExtensions[language];
    }
    return languageExtensions[type] || 'txt';
  }, [language, type]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  // Download artifact
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'artifact'}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, title, fileExtension, onDownload]);

  // Save edits
  const handleSaveEdit = useCallback(() => {
    if (onEdit) {
      onEdit(editContent);
    }
    setIsEditing(false);
  }, [editContent, onEdit]);

  // Cancel edits
  const handleCancelEdit = useCallback(() => {
    setEditContent(content);
    setIsEditing(false);
  }, [content]);

  // Render content based on type
  const renderContent = () => {
    if (isEditing) {
      return (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-full min-h-[200px] p-4 font-mono text-sm bg-transparent text-fg-primary resize-none focus:outline-hidden"
          spellCheck={false}
        />
      );
    }

    // Preview for HTML/SVG - sanitize content to prevent XSS
    if (showPreview && (type === 'html' || type === 'svg')) {
      const sanitizedContent = DOMPurify.sanitize(content, DOMPURIFY_CONFIG);
      return (
        <div className="w-full h-full min-h-[200px] bg-white p-4 rounded-lg">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className="w-full h-full"
          />
        </div>
      );
    }

    // Code view
    return (
      <pre className="w-full h-full min-h-[200px] p-4 overflow-auto">
        <code className="font-mono text-sm text-fg-primary whitespace-pre-wrap">
          {content}
        </code>
      </pre>
    );
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-bg-primary'
    : 'rounded-xl border border-border-secondary bg-bg-tertiary overflow-hidden';

  return (
    <motion.div
      {...devProps('ArtifactRenderer')}
      layout
      className={containerClass}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-secondary bg-bg-secondary">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-bg-brand-primary/10">
            <Icon className="w-4 h-4 text-fg-brand-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-fg-primary">{displayTitle}</h3>
            {language && (
              <span className="text-xs text-fg-tertiary">{language}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Preview toggle for HTML/SVG */}
          {(type === 'html' || type === 'svg') && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
              title={showPreview ? 'Show code' : 'Show preview'}
            >
              {showPreview ? (
                <Code className="w-4 h-4 text-fg-tertiary" />
              ) : (
                <Eye className="w-4 h-4 text-fg-tertiary" />
              )}
            </button>
          )}

          {/* Edit button */}
          {editable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4 text-fg-tertiary" />
            </button>
          )}

          {/* Save/Cancel for editing */}
          {isEditing && (
            <>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-bg-brand-solid text-white hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
                title="Cancel"
              >
                <XClose className="w-4 h-4 text-fg-tertiary" />
              </button>
            </>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
            title="Copy"
          >
            {copied ? (
              <Check className="w-4 h-4 text-fg-success-primary" />
            ) : (
              <Copy01 className="w-4 h-4 text-fg-tertiary" />
            )}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
            title="Download"
          >
            <Download01 className="w-4 h-4 text-fg-tertiary" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-bg-primary transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-fg-tertiary" />
            ) : (
              <Maximize2 className="w-4 h-4 text-fg-tertiary" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'max-h-[400px]'} overflow-auto bg-bg-primary`}>
        {renderContent()}
      </div>
    </motion.div>
  );
}

/**
 * ArtifactList Component
 * 
 * Renders a list of artifacts.
 */
interface Artifact {
  id: string;
  type: ArtifactType;
  title?: string;
  content: string;
  language?: string;
}

export function ArtifactList({ artifacts }: { artifacts: Artifact[] }) {
  if (artifacts.length === 0) return null;

  return (
    <div {...devProps('ArtifactList')} className="space-y-4 my-4">
      {artifacts.map((artifact) => (
        <ArtifactRenderer
          key={artifact.id}
          id={artifact.id}
          type={artifact.type}
          title={artifact.title}
          content={artifact.content}
          language={artifact.language}
          editable={true}
        />
      ))}
    </div>
  );
}

/**
 * Compact Artifact Preview
 * Shows a small preview of an artifact that expands on click
 */
export function ArtifactPreview({ 
  artifact, 
  onClick 
}: { 
  artifact: Artifact; 
  onClick?: () => void;
}) {
  const Icon = typeIcons[artifact.type] || Code;
  const displayTitle = artifact.title || `${artifact.type} artifact`;

  return (
    <button
      {...devProps('ArtifactPreview')}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border-secondary hover:border-border-brand-primary hover:bg-bg-brand-primary/5 transition-colors text-left w-full"
    >
      <div className="p-2 rounded-lg bg-bg-brand-primary/10">
        <Icon className="w-4 h-4 text-fg-brand-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-fg-primary truncate">
          {displayTitle}
        </h4>
        <p className="text-xs text-fg-tertiary truncate">
          {artifact.language || artifact.type} • {artifact.content.length} chars
        </p>
      </div>
      <Maximize2 className="w-4 h-4 text-fg-tertiary" />
    </button>
  );
}

export default ArtifactRenderer;



