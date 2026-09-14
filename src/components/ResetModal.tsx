import React from 'react';
import { X, AlertTriangle, RotateCcw, Download } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  onExportBackup: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  onExportBackup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0C0E]/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#15171B] border border-[#34383F] w-full max-w-sm rounded-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8B84] hover:text-[#E9E6DF] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#E06C75] mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-[17px] font-normal text-[#E9E6DF] m-0">
            Reset 30-Day Program?
          </h3>
        </div>

        <p className="text-[13px] text-[#8F8B84] font-serif leading-relaxed m-0 mb-4">
          This will wipe all logged hours, completed days, and nightly reviews. To prevent accidental data loss, we recommend downloading a backup first.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#1C1F24] hover:bg-[#22262E] text-[#E9E6DF] border border-[#34383F] rounded-sm font-serif text-[13px] cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#C68A46]" />
            <span>Download Backup JSON First</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#E06C75]/15 hover:bg-[#E06C75]/25 text-[#E06C75] border border-[#E06C75]/40 rounded-sm font-serif text-[13px] cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yes, Reset Everything to Day 1</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-center text-[#8F8B84] hover:text-[#E9E6DF] text-[12.5px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
