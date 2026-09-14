import React from 'react';
import { CurriculumDay, DayData } from '../types';
import { isDayComplete } from '../utils/storage';
import { Timer, Check, Flame } from 'lucide-react';
import { PracticeProblemsAccordion } from './PracticeProblemsAccordion';

interface DailyTasksProps {
  currentDay: number;
  curriculum: CurriculumDay;
  dayData: DayData;
  onToggleTask: (field: 'skill' | 'rep' | 'scroll') => void;
  onChangeHours: (val: string) => void;
  onChangeRepDetail: (type: string, note: string) => void;
  onTogglePracticeProblem: (problemIdx: number) => void;
  onOpenFocusTimer: () => void;
  onOpenAiAid: (type: 'explain' | 'problems') => void;
}

const DISCOMFORT_SUGGESTIONS = [
  'Heavy gym session',
  'Cold shower / ice plunge',
  'Awkward / difficult conversation',
  'Public post / code published',
  'Fasting / delayed gratification',
];

export const DailyTasks: React.FC<DailyTasksProps> = ({
  currentDay,
  curriculum,
  dayData,
  onToggleTask,
  onChangeHours,
  onChangeRepDetail,
  onTogglePracticeProblem,
  onOpenFocusTimer,
  onOpenAiAid,
}) => {
  const complete = isDayComplete(dayData);

  return (
    <div className="mb-7">
      {/* Day label */}
      <div className="flex justify-between items-baseline mb-4 border-b border-[#282C33] pb-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[22px] font-normal m-0 text-[#E9E6DF]">
            Day {currentDay}
          </h2>
          {curriculum.week && (
            <span className="font-mono-code text-[11px] text-[#C68A46] bg-[#C68A46]/10 px-2 py-0.5 rounded-sm">
              {curriculum.week.split('—')[0].trim()}
            </span>
          )}
        </div>
        <div>
          {complete ? (
            <span className="font-mono-code text-[12px] text-[#6B8F71] flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>day complete</span>
            </span>
          ) : (
            <span className="font-mono-code text-[12px] text-[#8F8B84]">
              {[dayData.skill, dayData.rep, dayData.scroll].filter(Boolean).length}/3 completed
            </span>
          )}
        </div>
      </div>

      {/* Item 1: Hard Skill Block */}
      <div className="py-3 border-b border-[#282C33]">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleTask('skill')}
            aria-label="Toggle Hard Skill Block"
            className={`w-[19px] h-[19px] border flex-shrink-0 mt-1 cursor-pointer relative transition-all rounded-[2px] flex items-center justify-center ${
              dayData.skill
                ? 'bg-[#6B8F71] border-[#6B8F71] text-[#101410]'
                : 'bg-transparent border-[#8F8B84] hover:border-[#C68A46]'
            }`}
          >
            {dayData.skill && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          <div className="flex-1 min-w-0">
            <div
              onClick={() => onToggleTask('skill')}
              className={`text-[16px] cursor-pointer leading-snug transition-colors ${
                dayData.skill ? 'text-[#E9E6DF]' : 'text-[#E9E6DF] hover:text-[#C68A46]'
              }`}
            >
              {curriculum.title}
            </div>
            <div className="text-[12.5px] text-[#8F8B84] mt-1 font-serif">
              {curriculum.sub}
            </div>

            {/* Hours input & Focus timer launcher */}
            <div className="mt-2.5 flex items-center gap-3 text-[13px] text-[#8F8B84] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span>hours logged:</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={dayData.hours || ''}
                  onChange={(e) => onChangeHours(e.target.value)}
                  className="w-14 bg-transparent border-b border-[#34383F] focus:border-[#C68A46] outline-none text-[#C68A46] font-mono-code text-[13px] px-1 py-0.5 text-center transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={onOpenFocusTimer}
                className="flex items-center gap-1 text-[12px] text-[#8F8B84] hover:text-[#C68A46] bg-[#1C1F24] hover:bg-[#22262E] px-2 py-0.5 border border-[#34383F] rounded-xs cursor-pointer transition-colors"
              >
                <Timer className="w-3 h-3 text-[#C68A46]" />
                <span>Timer / Stopwatch</span>
              </button>
            </div>

            {/* Accordion for problems & concepts */}
            <PracticeProblemsAccordion
              curriculum={curriculum}
              dayData={dayData}
              onToggleProblem={onTogglePracticeProblem}
              onOpenAiAid={onOpenAiAid}
            />
          </div>
        </div>
      </div>

      {/* Item 2: Discomfort Rep */}
      <div className="py-3 border-b border-[#282C33]">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleTask('rep')}
            aria-label="Toggle Discomfort Rep"
            className={`w-[19px] h-[19px] border flex-shrink-0 mt-1 cursor-pointer relative transition-all rounded-[2px] flex items-center justify-center ${
              dayData.rep
                ? 'bg-[#6B8F71] border-[#6B8F71] text-[#101410]'
                : 'bg-transparent border-[#8F8B84] hover:border-[#C68A46]'
            }`}
          >
            {dayData.rep && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          <div className="flex-1 min-w-0">
            <div
              onClick={() => onToggleTask('rep')}
              className="text-[16px] cursor-pointer leading-snug hover:text-[#C68A46] transition-colors"
            >
              Discomfort rep
            </div>
            <div className="text-[12.5px] text-[#8F8B84] mt-0.5 font-serif">
              Gym, cold shower, a conversation you'd normally avoid.
            </div>

            {/* Quick discomfort logger */}
            <div className="mt-2.5 space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {DISCOMFORT_SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onChangeRepDetail(item, dayData.repNote || '')}
                    className={`font-mono-code text-[10.5px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                      dayData.repType === item
                        ? 'bg-[#C68A46]/15 border-[#C68A46] text-[#C68A46]'
                        : 'bg-[#1C1F24] border-[#2E333C] text-[#8F8B84] hover:border-[#8A6435]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="What was your rep today? (e.g. 5x5 squats or pitch call)"
                value={dayData.repNote || ''}
                onChange={(e) => onChangeRepDetail(dayData.repType || '', e.target.value)}
                className="w-full bg-[#1C1F24] border-b border-[#34383F] focus:border-[#C68A46] outline-none text-[#E9E6DF] text-[13px] px-2 py-1 placeholder:text-[#5D626C] rounded-xs font-serif transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Item 3: Dopamine Discipline */}
      <div className="py-3 border-b border-[#282C33]">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleTask('scroll')}
            aria-label="Toggle No Short-Form Content"
            className={`w-[19px] h-[19px] border flex-shrink-0 mt-1 cursor-pointer relative transition-all rounded-[2px] flex items-center justify-center ${
              dayData.scroll
                ? 'bg-[#6B8F71] border-[#6B8F71] text-[#101410]'
                : 'bg-transparent border-[#8F8B84] hover:border-[#C68A46]'
            }`}
          >
            {dayData.scroll && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          <div className="flex-1 min-w-0">
            <div
              onClick={() => onToggleTask('scroll')}
              className="text-[16px] cursor-pointer leading-snug hover:text-[#C68A46] transition-colors"
            >
              No short-form content before 1 &amp; 2 are done
            </div>
            <div className="text-[12.5px] text-[#8F8B84] mt-0.5 font-serif flex items-center gap-1">
              <span>Earn the dopamine after the work, not before.</span>
              {dayData.scroll && (
                <span className="font-mono-code text-[11px] text-[#6B8F71] ml-1 flex items-center gap-0.5">
                  <Flame className="w-3 h-3" />
                  dopamine protected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
