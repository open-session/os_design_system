'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  File01,
  Loading01,
  Upload01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ProjectFileUploadProps {
  projectId: string;
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in bytes
  accept?: string[];
}

const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_ACCEPT = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.md', '.csv', '.json',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.js', '.ts', '.tsx', '.jsx', '.html', '.css',
];

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

export function ProjectFileUpload({
  projectId,
  onUpload,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
}: ProjectFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check size
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!accept.some(a => a.toLowerCase() === ext || a === '*')) {
      return 'File type not supported';
    }

    return null;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const error = validateFile(file);
      const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (error) {
        setUploadingFiles(prev => [...prev, {
          id: uploadId,
          file,
          progress: 0,
          error,
        }]);
        // Auto-remove error after 5 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 5000);
        continue;
      }

      // Add to uploading state
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        file,
        progress: 0,
      }]);

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => prev.map(f => 
            f.id === uploadId && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 100);

        await onUpload(file);

        clearInterval(progressInterval);

        // Mark as complete
        setUploadingFiles(prev => prev.map(f =>
          f.id === uploadId ? { ...f, progress: 100 } : f
        ));

        // Remove after short delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 500);
      } catch (err) {
        setUploadingFiles(prev => prev.map(f =>
          f.id === uploadId
            ? { ...f, error: err instanceof Error ? err.message : 'Upload failed' }
            : f
        ));
        // Auto-remove error after 5 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 5000);
      }
    }
  }, [maxSize, accept, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = ''; // Reset to allow same file selection
    }
  };

  return (
    <div {...devProps('ProjectFileUpload')} className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative
          border-2 border-dashed rounded-lg
          p-6
          text-center
          cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-fg-brand-primary bg-bg-brand-primary/10'
            : 'border-border-secondary hover:border-border-primary hover:bg-bg-tertiary'
          }
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-colors
            ${isDragging ? 'bg-bg-brand-primary/10' : 'bg-bg-tertiary'}
          `}>
            <Upload01 className={`
              w-5 h-5
              ${isDragging ? 'text-fg-brand-primary' : 'text-fg-tertiary'}
            `} />
          </div>
          <div>
            <p className="text-sm font-medium text-fg-primary">
              {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            <p className="text-xs text-fg-quaternary mt-1">
              Max {Math.round(maxSize / (1024 * 1024))}MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Upload progress */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadingFiles.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${upload.error
                    ? 'bg-bg-error-primary border border-border-error'
                    : 'bg-bg-tertiary'
                  }
                `}
              >
                {upload.error ? (
                  <AlertCircle className="w-4 h-4 text-fg-error-primary flex-shrink-0" />
                ) : upload.progress < 100 ? (
                  <Loading01 className="w-4 h-4 text-fg-brand-primary flex-shrink-0 animate-spin" />
                ) : (
                  <File01 className="w-4 h-4 text-fg-tertiary flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-xs font-medium truncate
                    ${upload.error ? 'text-fg-error-primary' : 'text-fg-primary'}
                  `}>
                    {upload.file.name}
                  </p>
                  {upload.error ? (
                    <p className="text-[10px] text-fg-error-primary">
                      {upload.error}
                    </p>
                  ) : (
                    <div className="mt-1 h-1 bg-bg-quaternary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-bg-brand-solid"
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )}
                </div>

                {upload.error && (
                  <button
                    onClick={() => setUploadingFiles(prev => prev.filter(f => f.id !== upload.id))}
                    className="p-1 text-fg-error-primary hover:bg-bg-error-primary rounded"
                  >
                    <XClose className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

