import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldAlert, CheckSquare, Square } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  noticeText?: string;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  noticeText,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Important Safety Notice" maxWidth="max-w-md">
      <div className="space-y-5 text-zen-800 dark:text-zen-200">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5 text-amber-900 dark:text-amber-200 leading-relaxed">
            <p className="font-semibold">Practice Safely</p>
            <p>
              {noticeText ||
                'Practice in a comfortable, seated or lying position. Stop immediately if you feel lightheaded, uncomfortable, or dizzy. Do NOT practice hyperventilation or extended breath-holding while driving, swimming, in the bath, or anywhere loss of consciousness could cause injury.'}
            </p>
          </div>
        </div>

        <div className="text-xs text-zen-600 dark:text-zen-400 space-y-1">
          <p>• ZenPulse exercises are designed for general relaxation and mindfulness.</p>
          <p>• They are not medical advice, diagnosis, or treatment.</p>
        </div>

        <label
          onClick={() => setIsChecked(!isChecked)}
          className="flex items-center gap-3 p-3 rounded-2xl bg-zen-100/60 dark:bg-zen-900/50 border border-zen-200 dark:border-zen-800 cursor-pointer select-none"
        >
          {isChecked ? (
            <CheckSquare className="w-5 h-5 text-zen-500 dark:text-zen-400 shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-zen-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-zen-900 dark:text-zen-100">
            I understand and accept the safety guidance.
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!isChecked}
            onClick={onConfirm}
            className="flex-1"
          >
            Begin Session
          </Button>
        </div>
      </div>
    </Modal>
  );
};
