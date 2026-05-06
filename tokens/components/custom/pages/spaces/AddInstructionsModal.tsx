'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/custom/shared/overlays/Modal';
import { Button } from '@/components/ds/buttons/button';
import { Lightbulb02, Zap } from '@untitledui-pro/icons/line';
// UUI fallback: Lightbulb02 → Zap (no Lightbulb02 equivalent in UUI; Zap used for tips/hints context)
import { devProps } from '@/lib/utils/dev-props';

interface AddInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructions: string) => void;
  existingInstructions?: string;
}

export function AddInstructionsModal({
  isOpen,
  onClose,
  onSave,
  existingInstructions = '',
}: AddInstructionsModalProps) {
  const [instructions, setInstructions] = useState(existingInstructions);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync with existing instructions when modal opens
  useEffect(() => {
    if (isOpen) {
      setInstructions(existingInstructions);
      // Focus textarea after sync
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
        // Move cursor to end of text
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.value.length;
          textareaRef.current.selectionEnd = textareaRef.current.value.length;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, existingInstructions]);

  const handleSave = () => {
    onSave(instructions.trim());
    onClose();
  };

  const handleClose = () => {
    setInstructions(existingInstructions);
    onClose();
  };

  const hasChanges = instructions.trim() !== existingInstructions.trim();

  return (
    <Modal {...devProps('AddInstructionsModal')} isOpen={isOpen} onClose={handleClose} title="Add Instructions" size="lg">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (hasChanges) handleSave();
        }}
        className="space-y-4"
      >
        <p className="text-sm text-fg-secondary">
          Add custom instructions for the AI when working in this space. These instructions will be applied to all conversations.
        </p>

        <div>
          <label 
            htmlFor="space-instructions"
            className="block text-sm font-medium text-fg-primary mb-1.5"
          >
            Instructions
          </label>
          <textarea
            ref={textareaRef}
            id="space-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Example: Always respond in a formal tone. Focus on technical accuracy. Include code examples when explaining concepts..."
            rows={8}
            className="
              w-full px-3 py-2.5 rounded-xl resize-none
              bg-primary-alt border border-border-primary
              text-fg-primary placeholder:text-fg-placeholder
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent
              transition-colors
            "
          />
          <p className="mt-1.5 text-xs text-fg-tertiary">
            {instructions.length} characters
          </p>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border-secondary">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-fg-brand-primary" />
            <h4 className="text-sm font-medium text-fg-primary">
              Tips for effective instructions
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-fg-tertiary ml-6">
            <li>• Be specific about the tone and style you want</li>
            <li>• Mention any domain-specific knowledge to focus on</li>
            <li>• Include formatting preferences (bullet points, headers, etc.)</li>
            <li>• Specify any topics or areas to avoid</li>
          </ul>
        </div>
      </form>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-secondary">
        <Button
          type="button"
          color="secondary"
          size="md"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          size="md"
          onClick={handleSave}
          isDisabled={!hasChanges}
        >
          Save Instructions
        </Button>
      </div>
    </Modal>
  );
}
