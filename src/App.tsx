import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RebuildState, DayData } from './types';
import { CURRICULUM } from './data/curriculum';
import {
  loadState,
  saveState,
  createEmptyDay,
  isDayComplete,
  computeStats,
  getDefaultState,
} from './utils/storage';
import { playTickSound, playSuccessChime } from './utils/audio';

import { Header } from './components/Header';
import { DailyWisdom } from './components/DailyWisdom';
import { DayStrip } from './components/DayStrip';
import { DailyTasks } from './components/DailyTasks';
import { NightlyReview } from './components/NightlyReview';
import { SyllabusDrawer } from './components/SyllabusDrawer';
import { FocusTimerModal } from './components/FocusTimerModal';
import { AiStudyModal } from './components/AiStudyModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ResetModal } from './components/ResetModal';

export default function App() {
  const [state, setState] = useState<RebuildState>(() => loadState());
  const [saveFlash, setSaveFlash] = useState<string>('');
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals state
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [aiModal, setAiModal] = useState<{
    open: boolean;
    type: 'explain' | 'problems' | 'reflection_coach';
  }>({ open: false, type: 'explain' });

  const currentDay = state.currentDay;
  const curriculum = CURRICULUM[currentDay - 1] || CURRICULUM[0];
  const currentDayData = state.days[currentDay] || createEmptyDay();

  // Save changes to localStorage with debounced flash notice
  const triggerSave = useCallback((newState: RebuildState, showFlash = true) => {
    setState(newState);
    saveState(newState);
    if (showFlash) {
      setSaveFlash('saved');
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => {
        setSaveFlash('');
      }, 1200);
    }
  }, []);

  const stats = computeStats(state);

  // Toggle tasks (skill, rep, scroll)
  const handleToggleTask = (field: 'skill' | 'rep' | 'scroll') => {
    const prevComplete = isDayComplete(currentDayData);
    const updatedDay: DayData = {
      ...currentDayData,
      [field]: !currentDayData[field],
    };

    const nextDays = {
      ...state.days,
      [currentDay]: updatedDay,
    };

    const newState: RebuildState = {
      ...state,
      days: nextDays,
    };

    const nowComplete = isDayComplete(updatedDay);

    if (nowComplete && !prevComplete) {
      // Day newly completed!
      playSuccessChime(state.soundEnabled);
      try {
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C68A46', '#6B8F71', '#E9E6DF'],
        });
      } catch {
        // Ignore in environments without canvas
      }
    } else {
      playTickSound(state.soundEnabled);
    }

    triggerSave(newState, true);
  };

  // Update hours
  const handleChangeHours = (val: string) => {
    const updatedDay: DayData = {
      ...currentDayData,
      hours: val,
    };
    const newState: RebuildState = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: updatedDay,
      },
    };
    triggerSave(newState, true);
  };

  // Add hours from timer
  const handleLogTimerHours = (additional: number) => {
    const current = parseFloat(currentDayData.hours || '0');
    const newHours = (isNaN(current) ? 0 : current) + additional;
    const rounded = Math.round(newHours * 10) / 10;

    const updatedDay: DayData = {
      ...currentDayData,
      hours: String(rounded),
      skill: true, // Logging time automatically ticks the skill block!
    };

    const newState: RebuildState = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: updatedDay,
      },
    };
    triggerSave(newState, true);
    playTickSound(state.soundEnabled);
  };

  // Discomfort rep detail
  const handleChangeRepDetail = (type: string, note: string) => {
    const updatedDay: DayData = {
      ...currentDayData,
      repType: type,
      repNote: note,
    };
    const newState: RebuildState = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: updatedDay,
      },
    };
    triggerSave(newState, true);
  };

  // Toggle individual practice checklist
  const handleTogglePracticeProblem = (index: number) => {
    const cur = [...(currentDayData.practiceChecked || [])];
    cur[index] = !cur[index];
    const updatedDay: DayData = {
      ...currentDayData,
      practiceChecked: cur,
    };
    const newState: RebuildState = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: updatedDay,
      },
    };
    playTickSound(state.soundEnabled);
    triggerSave(newState, true);
  };

  // Review text fields
  const handleChangeReviewField = (
    field: 'avoided' | 'faced' | 'notes',
    value: string
  ) => {
    const updatedDay: DayData = {
      ...currentDayData,
      [field]: value,
    };
    const newState: RebuildState = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: updatedDay,
      },
    };
    triggerSave(newState, true);
  };

  // Navigation
  const handleSelectDay = (day: number) => {
    if (day >= 1 && day <= 30) {
      const newState = { ...state, currentDay: day };
      triggerSave(newState, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset confirmed
  const handleConfirmReset = () => {
    const fresh = getDefaultState();
    triggerSave(fresh, true);
  };

  return (
    <div className="min-h-screen bg-[#15171B] text-[#E9E6DF] py-7 px-4 sm:px-6 font-serif selection:bg-[#C68A46] selection:text-[#15171B]">
      <main className="max-w-[640px] mx-auto">
        {/* Header with Stats & Utilities */}
        <Header
          streak={stats.streak}
          hours={stats.totalHours}
          soundEnabled={state.soundEnabled}
          onToggleSound={() => {
            const next = !state.soundEnabled;
            triggerSave({ ...state, soundEnabled: next }, false);
          }}
          onOpenTimer={() => setTimerModalOpen(true)}
          onOpenAnalytics={() => setAnalyticsModalOpen(true)}
          onResetPrompt={() => setResetModalOpen(true)}
        />

        {/* Daily Wisdom Quote */}
        <DailyWisdom currentDay={currentDay} dayTitle={curriculum.title} />

        {/* 30-Day Grid Strip */}
        <DayStrip state={state} onSelectDay={handleSelectDay} />

        {/* Active Day Commitments */}
        <DailyTasks
          currentDay={currentDay}
          curriculum={curriculum}
          dayData={currentDayData}
          onToggleTask={handleToggleTask}
          onChangeHours={handleChangeHours}
          onChangeRepDetail={handleChangeRepDetail}
          onTogglePracticeProblem={handleTogglePracticeProblem}
          onOpenFocusTimer={() => setTimerModalOpen(true)}
          onOpenAiAid={(type) => setAiModal({ open: true, type })}
        />

        {/* Nightly Review Audit */}
        <NightlyReview
          currentDay={currentDay}
          dayData={currentDayData}
          onChangeField={handleChangeReviewField}
          onOpenAiReflectionCoach={() =>
            setAiModal({ open: true, type: 'reflection_coach' })
          }
        />

        {/* Expandable Syllabus Drawer */}
        <SyllabusDrawer state={state} onSelectDay={handleSelectDay} />

        {/* Prev / Next Navigation Footer */}
        <footer className="mt-8 pt-4 border-t border-[#282C33] flex justify-between items-center text-[13px] text-[#8F8B84]">
          <button
            type="button"
            disabled={currentDay <= 1}
            onClick={() => handleSelectDay(currentDay - 1)}
            className="border border-[#34383F] hover:border-[#8A6435] text-[#8F8B84] hover:text-[#E9E6DF] disabled:opacity-30 disabled:hover:border-[#34383F] disabled:hover:text-[#8F8B84] px-3.5 py-2 cursor-pointer disabled:cursor-not-allowed transition-colors font-serif rounded-xs"
          >
            ← previous day
          </button>

          <div className="font-mono-code text-[12px] text-[#8F8B84]">
            Day {currentDay} of 30
          </div>

          <button
            type="button"
            disabled={currentDay >= 30}
            onClick={() => handleSelectDay(currentDay + 1)}
            className="border border-[#34383F] hover:border-[#8A6435] text-[#8F8B84] hover:text-[#E9E6DF] disabled:opacity-30 disabled:hover:border-[#34383F] disabled:hover:text-[#8F8B84] px-3.5 py-2 cursor-pointer disabled:cursor-not-allowed transition-colors font-serif rounded-xs"
          >
            next day →
          </button>
        </footer>

        {/* Subtle Save Status Tag */}
        <div className="text-center min-h-[20px] text-[11px] font-mono-code text-[#8F8B84] mt-3">
          {saveFlash}
        </div>
      </main>

      {/* Deep Work Focus Timer Modal */}
      <FocusTimerModal
        currentDay={currentDay}
        dayTitle={curriculum.title}
        isOpen={timerModalOpen}
        soundEnabled={state.soundEnabled}
        onClose={() => setTimerModalOpen(false)}
        onLogHours={handleLogTimerHours}
      />

      {/* AI Coach & Problem Generator Modal */}
      <AiStudyModal
        isOpen={aiModal.open}
        type={aiModal.type}
        curriculum={curriculum}
        dayData={currentDayData}
        onClose={() => setAiModal({ open: false, type: 'explain' })}
      />

      {/* Analytics & Journal Archive Modal */}
      <AnalyticsModal
        isOpen={analyticsModalOpen}
        state={state}
        onClose={() => setAnalyticsModalOpen(false)}
        onImportState={(newState) => triggerSave(newState, true)}
        onSelectDay={handleSelectDay}
      />

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        onExportBackup={() => {
          const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(state, null, 2));
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', dataStr);
          downloadAnchor.setAttribute(
            'download',
            `30-day-rebuild-backup-${new Date().toISOString().split('T')[0]}.json`
          );
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
        }}
      />
    </div>
  );
}
