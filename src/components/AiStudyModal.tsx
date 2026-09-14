import React, { useState } from 'react';
import { X, Sparkles, Loader2, BookOpen, Brain, Compass, RefreshCw } from 'lucide-react';
import { CurriculumDay, DayData } from '../types';

interface AiStudyModalProps {
  isOpen: boolean;
  type: 'explain' | 'problems' | 'reflection_coach';
  curriculum: CurriculumDay;
  dayData: DayData;
  onClose: () => void;
}

export const AiStudyModal: React.FC<AiStudyModalProps> = ({
  isOpen,
  type,
  curriculum,
  dayData,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');

  // Pre-configured offline fallbacks so the app is always functional
  const getOfflineFallback = () => {
    if (type === 'explain') {
      return `### Day ${curriculum.day}: ${curriculum.title}\n\n**Core Mental Model:**\n${curriculum.deepDive}\n\n**Key Takeaways:**\n- **Invariants:** ${curriculum.keyConcepts.join(' • ')}\n- **Common Mistake:** Jumping to code before drawing edge cases.\n- **Interview Tip:** Always state Time & Space complexity upfront before writing the first line of syntax.`;
    } else if (type === 'problems') {
      return `### 3 High-Yield Practice Problems for Day ${curriculum.day}:\n\n` +
        curriculum.practiceProblems
          .map(
            (p, i) =>
              `**${i + 1}. ${p.name}** [${p.difficulty}]\n- *Approach:* ${p.technique}\n- *Task:* ${p.description}`
          )
          .join('\n\n');
    } else {
      const avoided = dayData.avoided.trim() || 'Nothing noted';
      const faced = dayData.faced.trim() || 'Nothing noted';
      return `### Stoic Review Feedback — Day ${curriculum.day}\n\n` +
        `**On Courage:** Recognizing that you faced "${faced}" is proof of intentional growth. Friction is the only environment where capacity expands.\n\n` +
        `**On Avoidance:** You identified avoiding "${avoided}". Avoidance is not laziness; it is fear of incompetence or uncertainty. Tomorrow, do this avoided task first before opening any browser tab.`;
    }
  };

  const fetchAiResponse = async (overridePrompt?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/study-aid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          day: curriculum.day,
          title: curriculum.title,
          sub: curriculum.sub,
          question: overridePrompt || customQuestion || undefined,
          userReflection: {
            avoided: dayData.avoided,
            faced: dayData.faced,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        // Use rich fallback
        setResponse(getOfflineFallback());
      } else {
        setResponse(data.result);
      }
    } catch {
      setResponse(getOfflineFallback());
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch initial prompt when opened without an answer
  React.useEffect(() => {
    if (isOpen && !response && !loading) {
      fetchAiResponse();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0C0E]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#15171B] border border-[#34383F] w-full max-w-xl rounded-sm p-6 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8B84] hover:text-[#E9E6DF] cursor-pointer"
          aria-label="Close AI modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#C68A46]" />
          <h3 className="text-[17px] font-normal text-[#E9E6DF] m-0">
            {type === 'explain' && `Concept Deep Dive • Day ${curriculum.day}`}
            {type === 'problems' && `Practice Challenge Generator • Day ${curriculum.day}`}
            {type === 'reflection_coach' && `Stoic Reflection Coach • Day ${curriculum.day}`}
          </h3>
        </div>

        <div className="text-[13px] text-[#8F8B84] mb-4 pb-3 border-b border-[#282C33]">
          {curriculum.title}
        </div>

        {/* Output area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[13.5px] leading-relaxed text-[#E9E6DF] font-serif">
          {loading ? (
            <div className="py-12 text-center text-[#8F8B84] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#C68A46]" />
              <p className="font-mono-code text-[12px]">Consulting Gemini AI coach...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap select-text bg-[#1C1F24] p-4 rounded-sm border border-[#282C33]">
              {response}
            </div>
          )}
        </div>

        {/* Custom question prompt */}
        <div className="mt-4 pt-3 border-t border-[#282C33] flex gap-2">
          <input
            type="text"
            placeholder={
              type === 'reflection_coach'
                ? 'Ask the coach another question...'
                : 'Ask a specific doubt (e.g. "What is the time complexity?")'
            }
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim()) {
                fetchAiResponse(customQuestion);
              }
            }}
            className="flex-1 bg-[#1C1F24] border border-[#34383F] focus:border-[#C68A46] text-[#E9E6DF] text-[12.5px] px-3 py-1.5 rounded-sm outline-none placeholder:text-[#595E68]"
          />
          <button
            onClick={() => customQuestion.trim() && fetchAiResponse(customQuestion)}
            disabled={loading || !customQuestion.trim()}
            className="px-3 py-1.5 bg-[#C68A46] disabled:opacity-50 text-[#15171B] font-mono-code text-[12px] font-medium rounded-sm cursor-pointer hover:bg-[#d89b57] transition-colors"
          >
            Ask
          </button>
          <button
            onClick={() => fetchAiResponse()}
            disabled={loading}
            title="Regenerate"
            className="p-1.5 bg-[#1C1F24] border border-[#34383F] hover:border-[#8A6435] text-[#8F8B84] hover:text-[#E9E6DF] rounded-sm cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
