import { RebuildState, DayData } from '../types';

export const STORAGE_KEY = 'rebuild-log-v2';

export function createEmptyDay(): DayData {
  return {
    skill: false,
    hours: '',
    rep: false,
    repType: '',
    repNote: '',
    scroll: false,
    avoided: '',
    faced: '',
    practiceChecked: [],
    notes: '',
  };
}

export function getDefaultState(): RebuildState {
  return {
    currentDay: 1,
    days: {},
    soundEnabled: true,
    startDate: new Date().toISOString().split('T')[0],
  };
}

export function loadState(): RebuildState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Also check previous prototype key 'rebuild-log' if exists
    const legacy = !raw ? localStorage.getItem('rebuild-log') : null;
    const source = raw || legacy;

    if (source) {
      const parsed = JSON.parse(source);
      return {
        currentDay: typeof parsed.currentDay === 'number' ? parsed.currentDay : 1,
        days: parsed.days || {},
        soundEnabled: parsed.soundEnabled ?? true,
        startDate: parsed.startDate || new Date().toISOString().split('T')[0],
      };
    }
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
  }
  return getDefaultState();
}

export function saveState(state: RebuildState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
    return false;
  }
}

export function isDayComplete(dayData?: DayData): boolean {
  if (!dayData) return false;
  return Boolean(dayData.skill && dayData.rep && dayData.scroll);
}

export function computeStats(state: RebuildState) {
  // Streak calculation: count consecutive completed days up to current day
  let currentStreak = 0;
  for (let n = state.currentDay; n >= 1; n--) {
    if (isDayComplete(state.days[n])) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Total completed days overall
  let totalDaysComplete = 0;
  let totalHours = 0;
  const hoursByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (let d = 1; d <= 30; d++) {
    const data = state.days[d];
    if (data) {
      if (isDayComplete(data)) {
        totalDaysComplete++;
      }
      const h = parseFloat(data.hours || '0');
      if (!isNaN(h) && h > 0) {
        totalHours += h;
        const weekNum = Math.min(4, Math.ceil(d / 7));
        hoursByWeek[weekNum] = (hoursByWeek[weekNum] || 0) + h;
      }
    }
  }

  return {
    streak: currentStreak,
    totalHours: Math.round(totalHours * 10) / 10,
    totalDaysComplete,
    percentComplete: Math.round((totalDaysComplete / 30) * 100),
    hoursByWeek,
  };
}
