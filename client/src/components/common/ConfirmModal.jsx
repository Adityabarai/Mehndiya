import React, { useState } from 'react';
import Modal from './Modal';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  requiresInput = false,
  inputLabel = 'Reason',
  inputPlaceholder = 'Please enter reason...',
  inputValue: initialInputValue = ''
}) {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requiresInput && !inputValue.trim()) {
      setError('This field is required');
      return;
    }
    setError('');
    onConfirm(requiresInput ? inputValue : undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-full shrink-0 ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
            {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <p className="text-sm text-[#4A453F] leading-relaxed pt-1">
            {message}
          </p>
        </div>

        {requiresInput && (
          <div className="mt-3">
            <label className="block text-xs font-semibold text-[#143823] uppercase tracking-wider mb-1">
              {inputLabel} <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              rows={3}
              placeholder={inputPlaceholder}
              className={`w-full text-sm p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                error ? 'border-rose-400 focus:ring-rose-200' : 'border-[#D4AF37]/40 focus:ring-[#D4AF37]/30'
              }`}
            />
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#4A453F] hover:text-[#143823] hover:bg-[#EFE9DC] rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-all ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
                : 'bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] shadow-[#143823]/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
