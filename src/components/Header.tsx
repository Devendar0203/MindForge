import React from 'react';
import { Volume2, VolumeX, Timer, BarChart3, RotateCcw } from 'lucide-react';

interface HeaderProps {
  streak: number;
  hours: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTimer: () => void;
  onOpenAnalytics: () => void;
  onResetPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  hours,
  soundEnabled,
  onToggleSound,
  onOpenTimer,
  onOpenAnalytics,
  onResetPrompt,
}) => {
  return (
    <header className="border-b border-[#34383F] pb-4 mb-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-[26px] font-normal tracking-wide text-[#E9E6DF] m-0">
            30-day rebuild
          </h1>
          <p className="text-[12.5px] text-[#8F8B84] m-0 mt-0.5">
            DSA + AI/ML technical mastery &amp; psychological discipline
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-[13px] text-[#8F8B84] leading-tight">
            <div>
              <span className="font-mono-code text-[#C68A46] text-[14px] font-medium mr-1">
                {streak}
              </span>
              day streak
            </div>
            <div className="mt-0.5">
              <span className="font-mono-code text-[#C68A46] text-[14px] font-medium mr-1">
                {hours}
              </span>
              skill hours logged
            </div>
          </div>
        </div>
      </div>

      {/* Quick utility controls */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#282C33] text-[12px] text-[#8F8B84]">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1F24] hover:bg-[#22262E] text-[#E9E6DF] border border-[#34383F] hover:border-[#8A6435] transition-colors rounded-sm cursor-pointer"
            title="Open Deep Work Focus Timer"
          >
            <Timer className="w-3.5 h-3.5 text-[#C68A46]" />
            <span>Focus Timer</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1F24] hover:bg-[#22262E] text-[#E9E6DF] border border-[#34383F] hover:border-[#8A6435] transition-colors rounded-sm cursor-pointer"
            title="View 30-day Analytics &amp; Journal"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#6B8F71]" />
            <span>Progress &amp; Journal</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="p-1 hover:text-[#E9E6DF] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#8F8B84] hover:text-[#C68A46]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#595E68]" />
            )}
          </button>

          <button
            onClick={onResetPrompt}
            className="p-1 hover:text-[#E9E6DF] transition-colors cursor-pointer text-[#8F8B84]"
            title="Backup, export, or reset program"
            aria-label="Reset or backup options"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
