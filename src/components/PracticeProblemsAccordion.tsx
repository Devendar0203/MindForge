import React, { useState } from 'react';
import { CurriculumDay, DayData } from '../types';
import { ChevronDown, ChevronUp, Sparkles, CheckSquare, Square, Lightbulb, ExternalLink } from 'lucide-react';

interface PracticeProblemsAccordionProps {
  curriculum: CurriculumDay;
  dayData: DayData;
  onToggleProblem: (index: number) => void;
  onOpenAiAid: (type: 'explain' | 'problems') => void;
}

export const PracticeProblemsAccordion: React.FC<PracticeProblemsAccordionProps> = ({
  curriculum,
  dayData,
  onToggleProblem,
  onOpenAiAid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const checkedIndices = dayData.practiceChecked || [];

  return (
    <div className="mt-3.5 border-t border-[#282C33] pt-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-[12.5px] text-[#C68A46] hover:text-[#e4a867] font-normal cursor-pointer transition-colors"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>
            {isOpen ? 'Hide practice guide & mental model' : 'Explore practice challenges & key mental model'}
          </span>
          {curriculum.practiceProblems.length > 0 && (
            <span className="font-mono-code text-[11px] px-1.5 py-0.2 bg-[#20232A] text-[#8F8B84] rounded-sm ml-1">
              {checkedIndices.filter(Boolean).length}/{curriculum.practiceProblems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onOpenAiAid('explain')}
          className="flex items-center gap-1 text-[11.5px] text-[#8F8B84] hover:text-[#C68A46] px-2 py-0.5 rounded bg-[#1C1F24] border border-[#2E333C] hover:border-[#8A6435] transition-colors cursor-pointer"
          title="Ask AI to break down this topic"
        >
          <Sparkles className="w-3 h-3 text-[#C68A46]" />
          <span>AI Coach</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 bg-[#181A1F] border border-[#282C33] p-3.5 rounded-sm space-y-3.5 animate-in fade-in duration-200">
          {/* Key Concepts */}
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8F8B84] uppercase tracking-wider font-mono-code mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#C68A46]" />
              <span>Core Mental Model</span>
            </div>
            <p className="text-[13px] text-[#E9E6DF] leading-relaxed italic m-0">
              "{curriculum.deepDive}"
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {curriculum.keyConcepts.map((concept, i) => (
                <span
                  key={i}
                  className="font-mono-code text-[11px] px-2 py-0.5 bg-[#20232A] border border-[#2E333C] text-[#C68A46] rounded-sm"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Curated Challenges */}
          {curriculum.practiceProblems.length > 0 && (
            <div>
              <div className="text-[12px] text-[#8F8B84] uppercase tracking-wider font-mono-code mb-2">
                Curated Practice Checklist
              </div>
              <div className="space-y-2">
                {curriculum.practiceProblems.map((prob, idx) => {
                  const isChecked = !!checkedIndices[idx];
                  const diffColor =
                    prob.difficulty === 'Easy'
                      ? 'text-[#6B8F71] bg-[#6B8F71]/10 border-[#6B8F71]/30'
                      : prob.difficulty === 'Medium'
                      ? 'text-[#C68A46] bg-[#C68A46]/10 border-[#C68A46]/30'
                      : 'text-[#E06C75] bg-[#E06C75]/10 border-[#E06C75]/30';

                  return (
                    <div
                      key={idx}
                      onClick={() => onToggleProblem(idx)}
                      className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#1C1F24]/40 border-[#282C33] opacity-75'
                          : 'bg-[#1C1F24] border-[#2E333C] hover:border-[#3E434D]'
                      }`}
                    >
                      <div className="mt-0.5 text-[#8F8B84]">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#6B8F71]" />
                        ) : (
                          <Square className="w-4 h-4 hover:text-[#C68A46]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[13.5px] ${
                              isChecked ? 'line-through text-[#8F8B84]' : 'text-[#E9E6DF]'
                            }`}
                          >
                            {prob.name}
                          </span>
                          <span
                            className={`font-mono-code text-[10px] px-1.5 py-0.2 border rounded-xs ${diffColor}`}
                          >
                            {prob.difficulty}
                          </span>
                          <span className="font-mono-code text-[11px] text-[#8F8B84]">
                            via {prob.technique}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#8F8B84] m-0 mt-0.5">
                          {prob.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick links & AI actions */}
          <div className="flex items-center justify-between pt-1 border-t border-[#23272F] text-[12px]">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                curriculum.title + ' LeetCode explanation guide'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8F8B84] hover:text-[#E9E6DF] flex items-center gap-1 transition-colors"
            >
              <span>Search problem solutions</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => onOpenAiAid('problems')}
              className="text-[#C68A46] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Generate 3 targeted interview questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
