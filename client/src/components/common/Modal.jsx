import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`relative w-full ${maxWidth} bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden z-10 transition-all`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8DFC8] bg-gradient-to-r from-[#143823] to-[#1C4B30] text-[#FAF7F2] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold tracking-wide text-[#F3E5AB]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-emerald-100/80 mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto font-sans text-[#2D2A26]">
          {children}
        </div>
      </div>
    </div>
  );
}
