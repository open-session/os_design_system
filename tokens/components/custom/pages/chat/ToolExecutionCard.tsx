'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { SearchLg, Calculator, Clock, CheckCircle, XCircle, Loading01, ChevronDown, ChevronUp, Globe01, Tool01 as Wrench, Code01 as Code, File01 as FileText, Palette } from '@untitledui-pro/icons/line';

// Tool name to icon mapping
const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'web_search': Globe01,
  'calculator': Calculator,
  'execute_code': Code,
  'read_file': FileText,
  'get_current_time': Clock,
  'create_artifact': Code,
  'search_brand_knowledge': Palette,
};

interface ToolExecutionCardProps {
  /** Name of the tool being executed */
  toolName: string;
  /** Input parameters passed to the tool */
  input?: Record<string, unknown>;
  /** Output/result from the tool */
  output?: Record<string, unknown>;
  /** Execution status */
  status: 'pending' | 'running' | 'success' | 'error';
  /** Error message if status is 'error' */
  errorMessage?: string;
  /** Execution duration in milliseconds */
  durationMs?: number;
  /** Whether to show input/output details by default */
  defaultExpanded?: boolean;
}

/**
 * ToolExecutionCard Component
 * 
 * Displays the status and results of a tool execution.
 * Shows tool name, input parameters, output, and timing information.
 */
export function ToolExecutionCard({
  toolName,
  input,
  output,
  status,
  errorMessage,
  durationMs,
  defaultExpanded = false,
}: ToolExecutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const Icon = toolIcons[toolName] || Wrench;

  // Format tool name for display
  const displayName = toolName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Status colors and icons
  const statusConfig = {
    pending: {
      color: 'text-fg-tertiary',
      bgColor: 'bg-bg-tertiary',
      borderColor: 'border-border-secondary',
      icon: Loading01,
      iconClass: 'animate-spin',
      label: 'Pending',
    },
    running: {
      color: 'text-fg-brand-primary',
      bgColor: 'bg-bg-brand-primary',
      borderColor: 'border-border-brand-primary',
      icon: Loading01,
      iconClass: 'animate-spin',
      label: 'Running',
    },
    success: {
      color: 'text-fg-success-primary',
      bgColor: 'bg-bg-success-primary',
      borderColor: 'border-border-success',
      icon: CheckCircle,
      iconClass: '',
      label: 'Success',
    },
    error: {
      color: 'text-fg-error-primary',
      bgColor: 'bg-bg-error-primary',
      borderColor: 'border-border-error',
      icon: XCircle,
      iconClass: '',
      label: 'Error',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      {...devProps('ToolExecutionCard')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border ${config.borderColor} ${config.bgColor}
        overflow-hidden mb-3
      `}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-tertiary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-fg-primary">
                {displayName}
              </span>
              <StatusIcon className={`w-4 h-4 ${config.color} ${config.iconClass}`} />
            </div>
            {durationMs && status !== 'pending' && status !== 'running' && (
              <span className="text-xs text-fg-tertiary">
                {durationMs}ms
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-fg-tertiary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-fg-tertiary" />
          )}
        </div>
      </button>

      {/* Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-border-secondary px-4 py-3 space-y-3">
              {/* Input */}
              {input && Object.keys(input).length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-2">
                    Input
                  </h4>
                  <pre className="text-xs text-fg-secondary bg-bg-primary rounded-lg p-3 overflow-x-auto font-mono">
                    {JSON.stringify(input, null, 2)}
                  </pre>
                </div>
              )}

              {/* Output */}
              {output && Object.keys(output).length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-2">
                    Output
                  </h4>
                  <pre className="text-xs text-fg-secondary bg-bg-primary rounded-lg p-3 overflow-x-auto font-mono max-h-48 overflow-y-auto">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div>
                  <h4 className="text-xs font-medium text-fg-error-primary uppercase tracking-wider mb-2">
                    Error
                  </h4>
                  <p className="text-sm text-fg-error-primary bg-bg-error-primary rounded-lg p-3">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * ToolExecutionList Component
 * 
 * Displays a list of tool executions.
 */
interface ToolExecution {
  id: string;
  toolName: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'pending' | 'running' | 'success' | 'error';
  errorMessage?: string;
  durationMs?: number;
}

export function ToolExecutionList({ executions }: { executions: ToolExecution[] }) {
  if (executions.length === 0) return null;

  return (
    <div {...devProps('ToolExecutionList')} className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-xs text-fg-tertiary font-medium uppercase tracking-wider">
        <Wrench className="w-3 h-3" />
        Tool Calls ({executions.length})
      </div>
      {executions.map((exec) => (
        <ToolExecutionCard
          key={exec.id}
          toolName={exec.toolName}
          input={exec.input}
          output={exec.output}
          status={exec.status}
          errorMessage={exec.errorMessage}
          durationMs={exec.durationMs}
        />
      ))}
    </div>
  );
}

/**
 * Compact Tool Use Indicator
 * Shows that a tool is being used without full details
 */
export function ToolUseIndicator({ 
  toolName, 
  isRunning = false 
}: { 
  toolName: string; 
  isRunning?: boolean 
}) {
  const Icon = toolIcons[toolName] || Wrench;
  const displayName = toolName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <motion.div
      {...devProps('ToolUseIndicator')}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary border border-border-secondary text-sm"
    >
      <Icon className="w-3.5 h-3.5 text-fg-brand-primary" />
      <span className="text-fg-secondary">{displayName}</span>
      {isRunning && (
        <Loading01 className="w-3 h-3 text-fg-brand-primary animate-spin" />
      )}
    </motion.div>
  );
}

export default ToolExecutionCard;



