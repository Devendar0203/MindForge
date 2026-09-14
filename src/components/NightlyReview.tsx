import React, { useState } from 'react';
import { DayData } from '../types';
import { Sparkles, Compass, Check, AlertCircle } from 'lucide-react';

interface NightlyReviewProps {
  currentDay: number;
  dayData: DayData;
  onChangeField: (field: 'avoided' | 'faced' | 'notes', value: string) => void;
  onOpenAiReflectionCoach: () => void;
}

export const NightlyReview: React.FC<NightlyReviewProps> = ({
  currentDay,
  dayData,
  onChangeField,
  onOpenAiReflectionCoach,
}) => {
  const [showNotes, setShowNotes] = useState(Boolean(dayData.notes));
  const hasContent = Boolean(dayData.avoided.trim() || dayData.faced.trim());

  return (
    <div className="mt-7 pt-5 border-t border-[#34383F]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-normal text-[#8F8B84] m-0 tracking-wide uppercase font-mono-code text-[12px]">
            Tonight's review
          </h3>
          <p className="text-[12px] text-[#5D626C] m-0 mt-0.5 font-serif">
            Honest psychological audit — confronting friction rewires the nervous system.
          </p>
        </div>

        {hasContent && (
          <button
            type="button"
            onClick={onOpenAiReflectionCoach}
            className="flex items-center gap-1.5 text-[11.5px] text-[#C68A46] bg-[#1C1F24] hover:bg-[#242831] border border-[#34383F] hover:border-[#8A6435] px-2.5 py-1 rounded-sm cursor-pointer transition-colors"
            title="Get constructive feedback on avoidance and courage"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C68A46]" />
            <span>Stoic Feedback</span>
          </button>
        )}
      </div>

      {/* Avoided Field */}
      <div className="mb-4">
        <label
          htmlFor="ta-avoided"
          className="block text-[14px] text-[#E9E6DF] mb-1 font-serif flex items-center justify-between"
        >
          <span>What did I avoid today?</span>
          <span className="text-[11px] text-[#8F8B84] font-mono-code">Be specific. One sentence is enough.</span>
        </label>
        <textarea
          id="ta-avoided"
          rows={2}
          value={dayData.avoided}
          onChange={(e) => onChangeField('avoided', e.target.value)}
          placeholder="e.g. Procrastinated opening the dynamic programming problem; checked inbox instead."
          className="w-full bg-[#1C1F24] border-b border-[#34383F] focus:border-[#C68A46] text-[#E9E6DF] font-serif text-[14.5px] p-2.5 outline-none resize-y min-h-[44px] placeholder:text-[#595E68] transition-colors rounded-xs"
        />
      </div>

      {/* Faced Field */}
      <div className="mb-4">
        <label
          htmlFor="ta-faced"
          className="block text-[14px] text-[#E9E6DF] mb-1 font-serif flex items-center justify-between"
        >
          <span>What did I do despite fear or resistance?</span>
          <span className="text-[11px] text-[#8F8B84] font-mono-code">Even a small one counts.</span>
        </label>
        <textarea
          id="ta-faced"
          rows={2}
          value={dayData.faced}
          onChange={(e) => onChangeField('faced', e.target.value)}
          placeholder="e.g. Stayed at the desk through the confusion until the sliding window test passed."
          className="w-full bg-[#1C1F24] border-b border-[#34383F] focus:border-[#C68A46] text-[#E9E6DF] font-serif text-[14.5px] p-2.5 outline-none resize-y min-h-[44px] placeholder:text-[#595E68] transition-colors rounded-xs"
        />
      </div>

      {/* Optional Technical Scratchpad / Code Note */}
      <div>
        {!showNotes ? (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-[12px] text-[#8F8B84] hover:text-[#C68A46] cursor-pointer underline transition-colors"
          >
            + Add personal technical takeaway / solution notes for Day {currentDay}
          </button>
        ) : (
          <div className="mt-3 pt-3 border-t border-[#282C33]">
            <label
              htmlFor="ta-notes"
              className="block text-[13px] text-[#8F8B84] mb-1 font-mono-code flex items-center justify-between"
            >
              <span>Personal Technical Notes / Takeaways</span>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                className="text-[11px] text-[#5D626C] hover:text-[#8F8B84] cursor-pointer"
              >
                hide
              </button>
            </label>
            <textarea
              id="ta-notes"
              rows={3}
              value={dayData.notes || ''}
              onChange={(e) => onChangeField('notes', e.target.value)}
              placeholder="Code snippet, edge case reminder, or key formula..."
              className="w-full bg-[#1C1F24] border border-[#282C33] focus:border-[#C68A46] text-[#E9E6DF] font-mono-code text-[13px] p-2.5 outline-none resize-y placeholder:text-[#595E68] transition-colors rounded-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
