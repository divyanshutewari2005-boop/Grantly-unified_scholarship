
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/50 backdrop-blur-sm"
      role="presentation"
    >
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 w-full h-full cursor-default bg-transparent"
      />

      {/* Viewport centering */}
      <div className="relative z-10 flex min-h-full w-full items-center justify-center p-3 sm:p-5 pointer-events-none">

        {/* Modal container */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="grantly-modal-title"
          className={`
            pointer-events-auto
            relative
            w-full
            ${maxWidthClasses[maxWidth]}
            max-h-[90vh]
            max-h-[90dvh]
            flex
            flex-col
            bg-white
            rounded-2xl
            shadow-2xl
            border
            border-slate-100
            overflow-hidden
            animate-in
            fade-in
            zoom-in-95
            duration-200
          `}
        >

          {/* Modal Header */}
          <div className="shrink-0 flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-100">

            <div className="flex-1 min-w-0">
              {title && (
                <h3
                  id="grantly-modal-title"
                  className="text-lg sm:text-xl font-bold text-slate-900"
                >
                  {title}
                </h3>
              )}

              {description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* Scrollable Modal Content */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 pt-4">

            {children}

          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
