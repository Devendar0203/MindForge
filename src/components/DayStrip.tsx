import React from 'react';
import { RebuildState } from '../types';
import { isDayComplete } from '../utils/storage';

interface DayStripProps {
  state: RebuildState;
  onSelectDay: (day: number) => void;
}

export const DayStrip: React.FC<DayStripProps> = ({ state, onSelectDay }) => {
  const TOTAL_DAYS = 30;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((n) => {
          const isCurrent = n === state.currentDay;
          const dayData = state.days[n];
          const completed = isDayComplete(dayData);
          const hasPartialHours = dayData && parseFloat(dayData.hours || '0') > 0 && !completed;

          return (
            <button
              key={n}
              onClick={() => onSelectDay(n)}
              title={`Day ${n}${completed ? ' (Completed)' : ''}${dayData?.hours ? ` • ${dayData.hours}h` : ''}`}
              className={`
                aspect-square border flex flex-col items-center justify-center font-mono-code text-[11px] sm:text-[12px]
                cursor-pointer transition-all relative select-none rounded-[2px]
                ${completed
                  ? 'bg-[#6B8F71] border-[#6B8F71] text-[#101410] font-medium'
                  : 'bg-[#1C1F24] border-[#34383F] text-[#8F8B84] hover:border-[#8A6435]'
                }
                ${isCurrent && !completed
                  ? 'border-[#C68A46] text-[#C68A46] ring-1 ring-[#C68A46]/40'
                  : ''
                }
                ${isCurrent && completed
                  ? 'ring-2 ring-[#C68A46] ring-offset-1 ring-offset-[#15171B]'
                  : ''
                }
              `}
            >
              <span>{n}</span>
              {hasPartialHours && !completed && (
                <span className="w-1 h-1 rounded-full bg-[#C68A46] absolute bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono-code text-[#8F8B84] mt-2 px-0.5">
        <span>W1: DSA</span>
        <span>W2: Math &amp; Trees</span>
        <span>W3: ML Basics</span>
        <span>W4: DL &amp; Review</span>
      </div>
    </div>
  );
};
