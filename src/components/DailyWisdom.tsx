import React, { useState, useEffect } from 'react';
import { Quote, Copy, Check, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { DailyWisdomItem } from '../types';
import { getWisdomForDay, TIMELESS_MAXIMS } from '../data/wisdom';

interface DailyWisdomProps {
  currentDay: number;
  dayTitle: string;
}

export const DailyWisdom: React.FC<DailyWisdomProps> = ({ currentDay, dayTitle }) => {
  const [activeItem, setActiveItem] = useState<DailyWisdomItem>(() => getWisdomForDay(currentDay));
  const [copied, setCopied] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [isCustomIndex, setIsCustomIndex] = useState<number | null>(null);

  // When currentDay changes, reset to the curriculum day's quote
  useEffect(() => {
    setActiveItem(getWisdomForDay(currentDay));
    setIsCustomIndex(null);
  }, [currentDay]);

  const handleCopy = async () => {
    try {
      const textToCopy = `"${activeItem.quote}" — ${activeItem.author} (${activeItem.role})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleCycleQuote = () => {
    if (isCustomIndex === null) {
      // Switch to first timeless maxim
      setIsCustomIndex(0);
      setActiveItem({
        day: currentDay,
        ...TIMELESS_MAXIMS[0],
      });
    } else {
      const nextIdx = (isCustomIndex + 1) % (TIMELESS_MAXIMS.length + 1);
      if (nextIdx === TIMELESS_MAXIMS.length) {
        // Return to the default curriculum quote for this day
        setIsCustomIndex(null);
        setActiveItem(getWisdomForDay(currentDay));
      } else {
        setIsCustomIndex(nextIdx);
        setActiveItem({
          day: currentDay,
          ...TIMELESS_MAXIMS[nextIdx],
        });
      }
    }
  };

  return (
    <section
      aria-label="Daily Wisdom"
      className="mb-5 bg-[#1A1D22] border border-[#2F333B] rounded-sm p-4 relative transition-colors duration-200"
    >
      {/* Top micro-bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#262930] text-[11px] font-mono-code">
        <div className="flex items-center gap-2 text-[#8F8B84] flex-wrap">
          <span className="flex items-center gap-1 text-[#C68A46] font-medium uppercase tracking-wider">
            <Quote className="w-3 h-3 rotate-180" />
            Daily Wisdom
          </span>
          <span className="text-[#4E535E]">•</span>
          <span className="text-[#8F8B84]">Day {currentDay}</span>
          <span className="text-[#4E535E] hidden sm:inline">•</span>
          <span className="text-[#8F8B84] bg-[#22262D] px-1.5 py-0.5 rounded-xs border border-[#2B2F38] hidden sm:inline">
            {activeItem.theme}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCycleQuote}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#22262D] hover:bg-[#2A2E37] text-[#8F8B84] hover:text-[#E9E6DF] border border-[#2B2F38] hover:border-[#8A6435] rounded-xs cursor-pointer transition-colors"
            title="Cycle next wisdom quote"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span className="text-[10.5px]">
              {isCustomIndex === null ? 'Explore' : `Maxim ${isCustomIndex + 1}`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-[#8F8B84] hover:text-[#E9E6DF] hover:bg-[#22262D] rounded-xs cursor-pointer transition-colors"
            title={copied ? 'Copied to clipboard' : 'Copy quote'}
            aria-label="Copy wisdom quote"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#6B8F71]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative pl-1">
        <p className="text-[14px] sm:text-[14.5px] text-[#E9E6DF] font-serif italic leading-relaxed m-0 selection:bg-[#C68A46] selection:text-[#15171B]">
          &ldquo;{activeItem.quote}&rdquo;
        </p>

        {/* Author Attribution */}
        <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 text-[12px]">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-serif text-[#E9E6DF] font-normal">
              — {activeItem.author}
            </span>
            <span className="font-mono-code text-[11px] text-[#8F8B84]">
              ({activeItem.role})
            </span>
          </div>

          {activeItem.context && (
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="text-[11px] font-mono-code text-[#C68A46] hover:text-[#e09f58] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showContext ? 'Hide Context' : 'Why this matters today'}</span>
              {showContext ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Expandable Context Card */}
        {showContext && activeItem.context && (
          <div className="mt-3 p-2.5 bg-[#14161A] border border-[#282C33] rounded-xs text-[12.5px] text-[#A6A29A] font-serif leading-relaxed animate-in fade-in duration-150">
            <span className="font-mono-code text-[10.5px] uppercase tracking-wider text-[#C68A46] block mb-1">
              Curriculum Link • {dayTitle}
            </span>
            {activeItem.context}
          </div>
        )}
      </div>
    </section>
  );
};
