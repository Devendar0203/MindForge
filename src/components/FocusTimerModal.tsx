import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Check, Volume2, VolumeX } from 'lucide-react';
import { playTickSound, playTimerComplete } from '../utils/audio';

interface FocusTimerModalProps {
  currentDay: number;
  dayTitle: string;
  isOpen: boolean;
  soundEnabled: boolean;
  onClose: () => void;
  onLogHours: (additionalHours: number) => void;
}

type TimerMode = 'pomodoro' | 'deep50' | 'deep90' | 'stopwatch';

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  currentDay,
  dayTitle,
  isOpen,
  soundEnabled,
  onClose,
  onLogHours,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientTicks, setAmbientTicks] = useState<boolean>(false);
  const [sessionLoggedSeconds, setSessionLoggedSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDurationForMode = (m: TimerMode): number => {
    switch (m) {
      case 'pomodoro':
        return 25 * 60;
      case 'deep50':
        return 50 * 60;
      case 'deep90':
        return 90 * 60;
      case 'stopwatch':
        return 0;
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setSecondsLeft(getDurationForMode(newMode));
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchSeconds((prev) => {
          const next = prev + 1;
          setSessionLoggedSeconds((s) => s + 1);
          if (ambientTicks && soundEnabled && next % 5 === 0) {
            playTickSound(true);
          }
          return next;
        });
      } else {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playTimerComplete(soundEnabled);
            return 0;
          }
          setSessionLoggedSeconds((s) => s + 1);
          if (ambientTicks && soundEnabled && prev % 5 === 0) {
            playTickSound(true);
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, ambientTicks, soundEnabled]);

  if (!isOpen) return null;

  const displaySeconds = mode === 'stopwatch' ? stopwatchSeconds : secondsLeft;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const elapsedMinutes = Math.floor(sessionLoggedSeconds / 60);
  const calculatedHours = Math.round((sessionLoggedSeconds / 3600) * 10) / 10;

  const handleFinishAndLog = () => {
    if (calculatedHours > 0 || sessionLoggedSeconds >= 300) {
      // At least 5 mins or calculated hours
      const hoursToAdd = Math.max(0.2, calculatedHours);
      onLogHours(hoursToAdd);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0B0C0E]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#15171B] border border-[#34383F] w-full max-w-md rounded-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8B84] hover:text-[#E9E6DF] cursor-pointer"
          aria-label="Close timer modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="font-mono-code text-[11px] text-[#C68A46] uppercase tracking-wider">
            Deep Focus Block • Day {currentDay}
          </div>
          <h3 className="text-[17px] text-[#E9E6DF] font-normal m-0 mt-1 line-clamp-1">
            {dayTitle}
          </h3>
          <p className="text-[12px] text-[#8F8B84] m-0 mt-0.5">
            Phone in another room. Eliminate distractions.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#1C1F24] border border-[#282C33] rounded-sm mb-6 text-[12px] font-mono-code">
          {[
            { id: 'pomodoro', label: '25 min' },
            { id: 'deep50', label: '50 min' },
            { id: 'deep90', label: '90 min' },
            { id: 'stopwatch', label: 'Open' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchMode(item.id as TimerMode)}
              className={`py-1.5 text-center rounded-xs transition-colors cursor-pointer ${
                mode === item.id
                  ? 'bg-[#C68A46] text-[#15171B] font-medium'
                  : 'text-[#8F8B84] hover:text-[#E9E6DF]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Big Digital Clock */}
        <div className="text-center my-8">
          <div className="font-mono-code text-[64px] font-light tracking-tight text-[#E9E6DF] select-none">
            {formattedTime}
          </div>
          <div className="text-[12px] text-[#8F8B84] mt-1 font-mono-code">
            {sessionLoggedSeconds > 0 && (
              <span>
                Session active: {elapsedMinutes}m ({calculatedHours}h logged)
              </span>
            )}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              if (!isRunning) playTickSound(soundEnabled);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-sm font-serif text-[15px] cursor-pointer transition-all ${
              isRunning
                ? 'bg-[#1C1F24] text-[#E9E6DF] border border-[#34383F] hover:border-[#8A6435]'
                : 'bg-[#C68A46] text-[#15171B] hover:bg-[#d89b57] font-medium'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              if (mode === 'stopwatch') setStopwatchSeconds(0);
              else setSecondsLeft(getDurationForMode(mode));
            }}
            className="p-2.5 text-[#8F8B84] hover:text-[#E9E6DF] border border-[#34383F] hover:border-[#8A6435] bg-[#1C1F24] rounded-sm cursor-pointer transition-colors"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#282C33] flex items-center justify-between text-[12px]">
          <button
            onClick={() => setAmbientTicks(!ambientTicks)}
            className="flex items-center gap-1.5 text-[#8F8B84] hover:text-[#E9E6DF] cursor-pointer"
          >
            {ambientTicks ? (
              <Volume2 className="w-3.5 h-3.5 text-[#C68A46]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>Gentle pulse sound ({ambientTicks ? 'on' : 'off'})</span>
          </button>

          <button
            onClick={handleFinishAndLog}
            className="flex items-center gap-1.5 text-[#6B8F71] hover:underline font-mono-code cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {sessionLoggedSeconds > 0
                ? `Log ${calculatedHours}h & Close`
                : 'Close'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
