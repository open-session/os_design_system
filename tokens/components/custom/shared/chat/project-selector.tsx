'use client';

import { useState } from 'react';
import {
  Check,
  FolderPlus,
  Loading01,
  Plus,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import type { Project } from '@/lib/supabase/projects-service';

// Re-export Project type for consumers of this module
export type { Project };

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | null;
  onSelect: (project: Project | null) => void;
  onCreateProject: (name: string) => Promise<void>;
}

export function ProjectSelector({
  projects,
  currentProject,
  onSelect,
  onCreateProject,
}: ProjectSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;

    setIsLoading(true);
    try {
      await onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewProjectName('');
    }
  };

  return (
    <div {...devProps('ProjectSelector')} className="py-2 max-h-64 overflow-y-auto">
      {/* None option */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`
          w-full flex items-center justify-between px-3 py-2
          text-left transition-colors duration-150
          ${!currentProject
            ? 'bg-bg-tertiary text-fg-primary'
            : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
          }
        `}
      >
        <span className="text-sm">None</span>
        {!currentProject && (
          <Check className="w-4 h-4 text-fg-brand-primary" />
        )}
      </button>

      {/* Existing projects */}
      {projects.map((project) => {
        const isSelected = currentProject?.id === project.id;
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project)}
            className={`
              w-full flex items-center justify-between px-3 py-2
              text-left transition-colors duration-150
              ${isSelected
                ? 'bg-bg-tertiary text-fg-primary'
                : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: project.color ?? undefined }}
              />
              <span className="text-sm truncate">{project.name}</span>
            </div>
            {isSelected && (
              <Check className="w-4 h-4 text-fg-brand-primary flex-shrink-0" />
            )}
          </button>
        );
      })}

      {/* Divider */}
      <div className="mx-3 my-2 border-t border-border-secondary" />

      {/* Create new project */}
      {isCreating ? (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Project name..."
              className="flex-1 px-2 py-1 text-sm bg-bg-tertiary border border-border-primary rounded-md text-fg-primary placeholder:text-fg-quaternary focus:outline-hidden focus:border-border-primary"
              autoFocus
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newProjectName.trim() || isLoading}
              className="p-1 rounded-md text-fg-brand-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loading01 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewProjectName('');
              }}
              disabled={isLoading}
              className="p-1 rounded-md text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary"
            >
              <XClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Create new project</span>
        </button>
      )}
    </div>
  );
}

