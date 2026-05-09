'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronRight,
  FolderPlus,
  Image01,
  LayersTwo01,
  PenTool01,
  Plus,
  PuzzlePiece01,
} from '@untitledui-pro/icons/line';
// UUI fallback: Blocks → PuzzlePiece01 (closest semantic match for connectors/plugins)
import { WritingStyleSelector, type WritingStyle } from '@/components/custom/shared/chat/writing-style-selector';
import { ProjectSelector, type Project } from '@/components/custom/shared/chat/project-selector';
import { SpaceSelector, type SpaceOption } from '@/components/custom/shared/chat/space-selector';
import { devProps } from '@/lib/utils/dev-props';

interface PlusMenuProps {
  onAddFiles: () => void;
  onProjectSelect: (project: Project | null) => void;
  onStyleSelect: (style: WritingStyle | null) => void;
  onSpaceSelect?: (space: SpaceOption | null) => void;
  currentProject: Project | null;
  currentStyle: WritingStyle | null;
  currentSpace?: SpaceOption | null;
  projects: Project[];
  spaces?: SpaceOption[];
  onCreateProject: (name: string) => Promise<void>;
  onCreateSpace?: (title: string) => Promise<void>;
  disabled?: boolean;
  showSpaceOption?: boolean;
}

type Submenu = 'none' | 'project' | 'style' | 'space' | 'connectors';

export function PlusMenu({
  onAddFiles,
  onProjectSelect,
  onStyleSelect,
  onSpaceSelect,
  currentProject,
  currentStyle,
  currentSpace,
  projects,
  spaces = [],
  onCreateProject,
  onCreateSpace,
  disabled,
  showSpaceOption = true,
}: PlusMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<Submenu>('none');
  const [position, setPosition] = useState<{ right?: number; left?: number; maxWidth?: number }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate position for responsive display
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const isMobileOrTablet = viewportWidth < 1024;

      if (isMobileOrTablet) {
        const formContainer = button.closest('form');
        if (formContainer) {
          const containerRect = formContainer.getBoundingClientRect();
          const leftOffset = buttonRect.left - containerRect.left;
          const dropdownMaxWidth = Math.min(containerRect.width, 320);

          setPosition({
            left: leftOffset,
            right: undefined,
            maxWidth: dropdownMaxWidth,
          });
        } else {
          setPosition({
            left: 0,
            right: undefined,
            maxWidth: Math.min(viewportWidth - 32, 320),
          });
        }
      } else {
        setPosition({ left: 0, right: undefined, maxWidth: 320 });
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu('none');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMenuItemClick = (submenu: Submenu) => {
    if (activeSubmenu === submenu) {
      setActiveSubmenu('none');
    } else {
      setActiveSubmenu(submenu);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubmenu('none');
  };

  const menuItems = [
    {
      id: 'files',
      icon: Image01,
      label: 'Add files or photos',
      hasSubmenu: false,
      onClick: () => {
        onAddFiles();
        handleClose();
      },
    },
    {
      id: 'project',
      icon: FolderPlus,
      label: 'Add to project',
      hasSubmenu: true,
      submenu: 'project' as Submenu,
      hasValue: !!currentProject,
    },
    ...(showSpaceOption && onSpaceSelect ? [{
      id: 'space',
      icon: LayersTwo01,
      label: 'Add to space',
      hasSubmenu: true,
      submenu: 'space' as Submenu,
      hasValue: !!currentSpace,
    }] : []),
    {
      id: 'style',
      icon: PenTool01,
      label: 'Use style',
      hasSubmenu: true,
      submenu: 'style' as Submenu,
      hasValue: !!currentStyle,
    },
    {
      id: 'connectors',
      icon: PuzzlePiece01,
      label: 'Connectors',
      hasSubmenu: true,
      submenu: 'connectors' as Submenu,
    },
  ];

  return (
    <div {...devProps('PlusMenu')} ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          p-2 rounded-lg transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen
            ? 'bg-bg-brand-primary text-fg-brand-primary'
            : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
          }
        `}
        aria-label="Open menu"
        title="Add files, projects, styles..."
      >
        <Plus className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 bg-bg-secondary rounded-xl border border-border-primary shadow-xl overflow-hidden z-50"
            style={{
              left: position.left !== undefined ? position.left : undefined,
              right: position.right !== undefined ? position.right : undefined,
              width: position.maxWidth !== undefined ? position.maxWidth : undefined,
              minWidth: 240,
            }}
          >
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActiveSubmenu = activeSubmenu === item.submenu;

                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.hasSubmenu && item.submenu) {
                          handleMenuItemClick(item.submenu);
                        } else if (item.onClick) {
                          item.onClick();
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2
                        text-left transition-colors duration-quick
                        ${isActiveSubmenu
                          ? 'bg-bg-tertiary text-fg-primary'
                          : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.hasValue && (
                          <Check className="w-4 h-4 text-fg-brand-primary" />
                        )}
                        {item.hasSubmenu && (
                          <ChevronRight className={`w-4 h-4 transition-transform ${isActiveSubmenu ? 'rotate-90' : ''}`} />
                        )}
                      </div>
                    </button>

                    {/* Project Submenu */}
                    <AnimatePresence>
                      {item.submenu === 'project' && isActiveSubmenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden border-t border-border-secondary"
                        >
                          <ProjectSelector
                            projects={projects}
                            currentProject={currentProject}
                            onSelect={(project) => {
                              onProjectSelect(project);
                              handleClose();
                            }}
                            onCreateProject={onCreateProject}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Space Submenu */}
                    <AnimatePresence>
                      {item.submenu === 'space' && isActiveSubmenu && onSpaceSelect && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden border-t border-border-secondary"
                        >
                          <SpaceSelector
                            spaces={spaces}
                            currentSpace={currentSpace || null}
                            onSelect={(space) => {
                              onSpaceSelect(space);
                              handleClose();
                            }}
                            onCreateSpace={onCreateSpace}
                            showCreateOption={!!onCreateSpace}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Style Submenu */}
                    <AnimatePresence>
                      {item.submenu === 'style' && isActiveSubmenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden border-t border-border-secondary"
                        >
                          <WritingStyleSelector
                            currentStyle={currentStyle}
                            onSelect={(style) => {
                              onStyleSelect(style);
                              handleClose();
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Connectors Submenu (Placeholder) */}
                    <AnimatePresence>
                      {item.submenu === 'connectors' && isActiveSubmenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden border-t border-border-secondary"
                        >
                          <div className="px-4 py-6 text-center">
                            <PuzzlePiece01 className="w-8 h-8 mx-auto mb-2 text-fg-quaternary" />
                            <p className="text-sm text-fg-tertiary">
                              MCP Connectors
                            </p>
                            <p className="text-xs text-fg-quaternary mt-1">
                              Coming soon
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Project indicator button (shown when a project is assigned)
export function ProjectIndicator({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <button
      {...devProps('ProjectIndicator')}
      type="button"
      onClick={onClick}
      className="p-2 rounded-lg transition-all bg-bg-brand-primary text-fg-brand-primary hover:bg-bg-brand-secondary"
      aria-label={`Project: ${project.name}`}
      title={`Project: ${project.name}`}
    >
      <FolderPlus className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
