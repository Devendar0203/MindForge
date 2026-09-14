import React, { useState } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { RebuildState } from '../types';
import { isDayComplete } from '../utils/storage';
import { ChevronDown, ChevronUp, Search, CheckCircle2 } from 'lucide-react';

interface SyllabusDrawerProps {
  state: RebuildState;
  onSelectDay: (day: number) => void;
}

export const SyllabusDrawer: React.FC<SyllabusDrawerProps> = ({ state, onSelectDay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurriculum = CURRICULUM.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.sub.toLowerCase().includes(q) ||
        (item.week && item.week.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="mt-4 border-t border-[#34383F] pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-transparent border-none text-[#8F8B84] hover:text-[#E9E6DF] font-serif text-[14px] cursor-pointer flex items-center justify-between py-1 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>{isOpen ? 'hide full 30-day syllabus' : 'show full 30-day syllabus (DSA + AI/ML)'}</span>
          <span className="font-mono-code text-[11px] text-[#C68A46]">30 days mapped</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-[#282C33] animate-in fade-in duration-200">
          {/* Controls: Search & Category filter */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8F8B84]" />
              <input
                type="text"
                placeholder="Search topics (e.g. DP, trees, NumPy, transformers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C1F24] border border-[#34383F] focus:border-[#C68A46] text-[#E9E6DF] text-[12.5px] pl-8 pr-2.5 py-1.5 rounded-sm outline-none placeholder:text-[#5D626C] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 font-mono-code text-[11px] overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'dsa', label: 'DSA' },
                { id: 'ml', label: 'ML' },
                { id: 'math', label: 'Math' },
                { id: 'review', label: 'Review' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-2 py-1 rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                    filterCategory === tab.id
                      ? 'bg-[#C68A46]/20 border-[#C68A46] text-[#C68A46]'
                      : 'bg-[#1C1F24] border-[#2E333C] text-[#8F8B84] hover:border-[#3E434D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Syllabus Items */}
          <div className="space-y-0.5 divide-y divide-[#282C33]">
            {filteredCurriculum.map((item) => {
              const n = item.day;
              const isCurrent = n === state.currentDay;
              const dayData = state.days[n];
              const completed = isDayComplete(dayData);

              return (
                <React.Fragment key={n}>
                  {item.week && filterCategory === 'all' && !searchQuery && (
                    <div className="text-[11px] font-mono-code text-[#C68A46] pt-4 pb-1.5 uppercase tracking-wider">
                      {item.week}
                    </div>
                  )}

                  <div
                    onClick={() => {
                      onSelectDay(n);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-start gap-3 py-2.5 px-2 rounded-xs cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#20232A] border-l-2 border-[#C68A46]'
                        : 'hover:bg-[#1C1F24]'
                    }`}
                  >
                    <div
                      className={`font-mono-code text-[12px] w-6 flex-shrink-0 pt-0.5 ${
                        completed
                          ? 'text-[#6B8F71]'
                          : isCurrent
                          ? 'text-[#C68A46] font-bold'
                          : 'text-[#8F8B84]'
                      }`}
                    >
                      {String(n).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[14px] ${
                            completed
                              ? 'line-through text-[#8F8B84] decoration-[#34383F]'
                              : isCurrent
                              ? 'text-[#E9E6DF] font-medium'
                              : 'text-[#E9E6DF]'
                          }`}
                        >
                          {item.title}
                        </span>

                        {completed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F71]" />
                        )}

                        {dayData?.hours && parseFloat(dayData.hours) > 0 && (
                          <span className="font-mono-code text-[10.5px] px-1.5 py-0.2 bg-[#15171B] border border-[#2E333C] text-[#C68A46] rounded-xs">
                            {dayData.hours}h
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] text-[#8F8B84] mt-0.5 font-serif">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
