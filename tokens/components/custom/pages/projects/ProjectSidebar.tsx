'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, Cube01, Edit01, File01, Folder, Plus, Trash01, Upload01, XClose, ClockRewind as HistoryIcon } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { ProjectFileCard } from './ProjectFileCard';
import { ProjectInstructionsModal } from './ProjectInstructionsModal';
import { ProjectMemoryVersionsModal } from './ProjectMemoryVersionsModal';
import type { ProjectFile, ProjectInstructions, ProjectMemory } from '@/lib/supabase/projects-service';

interface ProjectSidebarProps {
  projectId: string;
  projectName: string;
  instructions: ProjectInstructions | null;
  files: ProjectFile[];
  totalFileSize: number;
  maxFileSize?: number; // Total capacity in bytes
  onSaveInstructions: (content: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  // Memory props
  memory: ProjectMemory[];
  onAddMemory: (key: string, value: string) => Promise<void>;
  onUpdateMemory: (id: string, key: string, value: string) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  onManageVersions?: (memoryId: string) => void;
}

// 500MB default capacity
const DEFAULT_MAX_SIZE = 500 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  rightElement,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div {...devProps('CollapsibleSection')} className="border-b border-border-secondary last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between
          px-4 py-3
          text-left
          hover:bg-bg-tertiary
          transition-colors
        "
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-fg-primary">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-fg-tertiary" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MemoryAddFormProps {
  onAdd: (key: string, value: string) => Promise<void>;
  onCancel: () => void;
}

function MemoryAddForm({ onAdd, onCancel }: MemoryAddFormProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    setIsSubmitting(true);
    try {
      await onAdd(key.trim(), value.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      {...devProps('MemoryAddForm')}
      onSubmit={handleSubmit}
      className="mb-3 p-3 rounded-lg bg-bg-primary border border-border-secondary"
    >
      <input
        type="text"
        placeholder="Key (e.g. tone, audience)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        disabled={isSubmitting}
        className="
          w-full mb-2 px-3 py-1.5 rounded-md
          bg-bg-secondary border border-border-secondary
          text-sm text-fg-primary placeholder:text-fg-quaternary
          focus:outline-hidden focus:ring-1 focus:ring-fg-brand-primary focus:border-fg-brand-primary
          disabled:opacity-50
        "
      />
      <textarea
        placeholder="Value (e.g. friendly and approachable)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        disabled={isSubmitting}
        className="
          w-full mb-2 px-3 py-1.5 rounded-md
          bg-bg-secondary border border-border-secondary
          text-sm text-fg-primary placeholder:text-fg-quaternary
          focus:outline-hidden focus:ring-1 focus:ring-fg-brand-primary focus:border-fg-brand-primary
          resize-none disabled:opacity-50
        "
      />
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50"
        >
          <XClose className="w-3 h-3" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={!key.trim() || !value.trim() || isSubmitting}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-fg-brand-primary text-white hover:bg-fg-brand-secondary transition-colors disabled:opacity-50"
        >
          <Check className="w-3 h-3" />
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}

interface MemoryEditFormProps {
  memoryId: string;
  initialKey: string;
  initialValue: string;
  onSave: (id: string, key: string, value: string) => Promise<void>;
  onCancel: () => void;
}

function MemoryEditForm({ memoryId, initialKey, initialValue, onSave, onCancel }: MemoryEditFormProps) {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave(memoryId, key.trim(), value.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      {...devProps('MemoryEditForm')}
      onSubmit={handleSubmit}
      className="p-3 rounded-lg bg-bg-primary border border-border-secondary"
    >
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        disabled={isSubmitting}
        className="
          w-full mb-2 px-3 py-1.5 rounded-md
          bg-bg-secondary border border-border-secondary
          text-sm text-fg-primary placeholder:text-fg-quaternary
          focus:outline-hidden focus:ring-1 focus:ring-fg-brand-primary focus:border-fg-brand-primary
          disabled:opacity-50
        "
      />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        disabled={isSubmitting}
        className="
          w-full mb-2 px-3 py-1.5 rounded-md
          bg-bg-secondary border border-border-secondary
          text-sm text-fg-primary placeholder:text-fg-quaternary
          focus:outline-hidden focus:ring-1 focus:ring-fg-brand-primary focus:border-fg-brand-primary
          resize-none disabled:opacity-50
        "
      />
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50"
        >
          <XClose className="w-3 h-3" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={!key.trim() || !value.trim() || isSubmitting}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-fg-brand-primary text-white hover:bg-fg-brand-secondary transition-colors disabled:opacity-50"
        >
          <Check className="w-3 h-3" />
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

interface MemoryEntryRowProps {
  entry: ProjectMemory;
  onEdit: (entry: ProjectMemory) => void;
  onDelete: (id: string) => void;
  onManageVersions?: (memoryId: string) => void;
}

function MemoryEntryRow({ entry, onEdit, onDelete, onManageVersions }: MemoryEntryRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div
      {...devProps('MemoryEntryRow')}
      className="group relative p-3 rounded-lg bg-bg-primary border border-border-secondary hover:border-border-primary transition-colors"
    >
      <div className="pr-14">
        <p className="text-xs font-medium text-fg-primary truncate">{entry.key}</p>
        <p className="text-xs text-fg-secondary mt-0.5 line-clamp-3">{entry.value}</p>
        {onManageVersions && (
          <button
            onClick={() => onManageVersions(entry.id)}
            className="mt-1 text-[10px] text-fg-brand-primary hover:underline flex items-center gap-0.5"
          >
            <HistoryIcon className="w-2.5 h-2.5" />
            Manage edits
          </button>
        )}
      </div>

      {/* Action buttons - visible on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(entry)}
          className="p-1 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
          title="Edit entry"
        >
          <Edit01 className="w-3 h-3" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1 rounded-md text-fg-tertiary hover:text-red-500 hover:bg-bg-tertiary transition-colors"
          title="Delete entry"
        >
          <Trash01 className="w-3 h-3" />
        </button>
      </div>

      {/* Inline delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-lg bg-bg-secondary border border-border-secondary flex items-center justify-between px-3 py-2 z-10"
          >
            <span className="text-xs text-fg-primary">Delete this memory?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs text-fg-tertiary hover:text-fg-primary px-2 py-1 rounded-md hover:bg-bg-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete(entry.id);
                }}
                className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectSidebar({
  projectId: _projectId,
  projectName,
  instructions,
  files,
  totalFileSize,
  maxFileSize = DEFAULT_MAX_SIZE,
  onSaveInstructions,
  onUploadFile,
  onDeleteFile,
  memory,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onManageVersions,
}: ProjectSidebarProps) {
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Memory state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProjectMemory | null>(null);

  // Memory version history modal state
  const [versionsModalMemory, setVersionsModalMemory] = useState<{
    id: string;
    key: string;
  } | null>(null);

  const usagePercent = Math.min((totalFileSize / maxFileSize) * 100, 100);

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of droppedFiles) {
        await onUploadFile(file);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onUploadFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        await onUploadFile(file);
      }
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  }, [onUploadFile]);

  const handleAddMemory = async (key: string, value: string) => {
    await onAddMemory(key, value);
    setShowAddForm(false);
  };

  const handleUpdateMemory = async (id: string, key: string, value: string) => {
    await onUpdateMemory(id, key, value);
    setEditingEntry(null);
  };

  const handleDeleteMemory = async (id: string) => {
    await onDeleteMemory(id);
  };

  return (
    <>
      <div {...devProps('ProjectSidebar')} className="
        w-full lg:w-80
        bg-bg-secondary
        border-t lg:border-t-0 lg:border-l border-border-secondary
        lg:h-full
        overflow-y-auto
      ">
        {/* Memory Section — first, above Instructions */}
        <CollapsibleSection
          title="Memory"
          icon={<Cube01 className="w-4 h-4 text-fg-tertiary" />}
          defaultOpen={true}
          rightElement={
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(true);
                setEditingEntry(null);
              }}
              className="p-1 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
              title="Add memory entry"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          }
        >
          {/* Add form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden mb-2"
              >
                <MemoryAddForm
                  onAdd={handleAddMemory}
                  onCancel={() => setShowAddForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory entries list */}
          {memory.length > 0 ? (
            <div className="space-y-2">
              {memory.map((entry) => (
                editingEntry?.id === entry.id ? (
                  <MemoryEditForm
                    key={entry.id}
                    memoryId={entry.id}
                    initialKey={entry.key}
                    initialValue={entry.value}
                    onSave={handleUpdateMemory}
                    onCancel={() => setEditingEntry(null)}
                  />
                ) : (
                  <MemoryEntryRow
                    key={entry.id}
                    entry={entry}
                    onEdit={setEditingEntry}
                    onDelete={handleDeleteMemory}
                    onManageVersions={(memoryId) => {
                      const entry = memory.find((m) => m.id === memoryId);
                      if (entry) setVersionsModalMemory({ id: entry.id, key: entry.key });
                      onManageVersions?.(memoryId);
                    }}
                  />
                )
              ))}
            </div>
          ) : !showAddForm ? (
            <div className="text-center py-3">
              <p className="text-xs text-fg-quaternary mb-2">
                No memory entries yet. Add one to guide your AI conversations.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs text-fg-brand-primary hover:underline flex items-center gap-1 mx-auto"
              >
                <Plus className="w-3 h-3" />
                Add first entry
              </button>
            </div>
          ) : null}
        </CollapsibleSection>

        {/* Instructions Section */}
        <CollapsibleSection
          title="Instructions"
          icon={<File01 className="w-4 h-4 text-fg-tertiary" />}
        >
          {instructions?.content ? (
            <button
              onClick={() => setIsInstructionsModalOpen(true)}
              className="
                w-full text-left
                p-3 rounded-lg
                bg-bg-primary
                border border-border-secondary
                hover:border-border-primary
                transition-colors
              "
            >
              <p className="text-xs text-fg-secondary line-clamp-4">
                {instructions.content}
              </p>
              <p className="text-[10px] text-fg-quaternary mt-2">
                Click to edit
              </p>
            </button>
          ) : (
            <button
              onClick={() => setIsInstructionsModalOpen(true)}
              className="
                w-full text-left
                p-3 rounded-lg
                border border-dashed border-border-secondary
                hover:border-border-primary
                hover:bg-bg-tertiary
                transition-colors
              "
            >
              <p className="text-xs text-fg-tertiary">
                Add instructions to tailor AI responses for this project.
              </p>
            </button>
          )}
        </CollapsibleSection>

        {/* Files Section */}
        <CollapsibleSection
          title="Files"
          icon={<Folder className="w-4 h-4 text-fg-tertiary" />}
        >
          {/* Capacity bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-fg-quaternary">
                {formatBytes(totalFileSize)} used
              </span>
              <span className="text-[10px] text-fg-quaternary">
                {Math.round(usagePercent)}% of project capacity
              </span>
            </div>
            <div className="h-1.5 bg-bg-quaternary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  usagePercent > 90
                    ? 'bg-fg-error-primary'
                    : usagePercent > 70
                    ? 'bg-yellow-500'
                    : 'bg-bg-brand-solid'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Drop zone - always visible */}
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              block mb-4 cursor-pointer
              border border-dashed rounded-lg
              p-4 text-center
              transition-all
              ${isDragOver
                ? 'border-fg-brand-primary bg-bg-brand-primary/10'
                : 'border-border-secondary hover:border-border-primary hover:bg-bg-tertiary'
              }
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <Upload01 className={`w-5 h-5 mx-auto mb-2 ${isDragOver ? 'text-fg-brand-primary' : 'text-fg-quaternary'}`} />
            <p className={`text-xs ${isDragOver ? 'text-fg-brand-primary' : 'text-fg-tertiary'}`}>
              {isUploading ? 'Uploading...' : 'Drag files here or click to upload'}
            </p>
          </label>

          {/* Files grid */}
          {files.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, index) => (
                <ProjectFileCard
                  key={file.id}
                  file={file}
                  onDelete={onDeleteFile}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-fg-quaternary">
                No files uploaded yet
              </p>
            </div>
          )}
        </CollapsibleSection>
      </div>

      {/* Instructions Modal */}
      <ProjectInstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        projectName={projectName}
        initialContent={instructions?.content || ''}
        onSave={onSaveInstructions}
      />

      {/* Memory Version HistoryIcon Modal */}
      {versionsModalMemory && (
        <ProjectMemoryVersionsModal
          isOpen={versionsModalMemory !== null}
          onClose={() => setVersionsModalMemory(null)}
          memoryId={versionsModalMemory.id}
          memoryKey={versionsModalMemory.key}
          onDeleted={() => {
            setVersionsModalMemory(null);
            // Parent will refetch memory via onDeleteMemory pathway
            handleDeleteMemory(versionsModalMemory.id);
          }}
        />
      )}
    </>
  );
}
