// src/components/MarkdownModal.tsx
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
}

const MarkdownModal: React.FC<MarkdownModalProps> = ({
  isOpen,
  onClose,
  markdown,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4">
      <div
        className="
          relative
          bg-secondary dark:bg-primary
          shadow-lg overflow-auto
          w-full h-full sm:w-auto sm:h-auto sm:max-w-3xl sm:max-h-[90vh]
          lg:w-[70vw] lg:h-[80vh]
        "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl  dark:text-secondary text-primary"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-8">
          <MarkdownRenderer markdown={markdown} />
        </div>
      </div>
    </div>
  );
};

export default MarkdownModal;
