import React from 'react';
import { Calendar, Search, Sparkles, AlertCircle } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'There is currently nothing to display here.',
  icon: Icon = Calendar,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white/70 border border-[#E8DFC8] shadow-sm my-6">
      <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/30 text-[#143823] flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-[#143823]" />
      </div>
      <h3 className="font-serif text-xl font-bold text-[#143823] tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#6B645C] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#143823] to-[#1E4D32] text-[#F3E5AB] text-sm font-semibold shadow-md shadow-[#143823]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-5 py-2.5 rounded-xl border border-[#D4AF37]/50 text-[#143823] text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}
